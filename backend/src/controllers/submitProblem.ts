import { Request, Response } from "express";
import { submitProblemZodSchema } from "../zod/problemsSchema";
import { db } from "../db";
import { SUBMISSION_BATCH_SIZE, submitJudge0Batch } from "../utils/judge0";

const submitProblem = async (req: Request, res: Response) => {
    try {
        const data = submitProblemZodSchema.safeParse(req.body);

        if (!data.success) {
            res.status(400).json({ message: "invalid inputs" });
            return;
        }

        const { sourceCode, languageId } = data.data;

        const problemId = Array.isArray(req.params.problemId)
            ? req.params.problemId[0]
            : req.params.problemId;

        if (!req.User) {
            res.status(400).json({ message: "Not logged in" });
            return;
        }

        const userId = req.User.id;

        const problem = await db.problem.findUnique({
            where: {
                id: problemId,
            },
            include: {
                testCases: {
                    orderBy: [{ position: "asc" }, { id: "asc" }],
                },
            },
        });

        if (!problem || !problem.visible) {
            res.status(400).json({ message: "Not a valid problem" });
            return;
        }

        const hiddenTestCases = problem.testCases.filter((testCase) => testCase.hidden);
        const sampleTestCases = problem.testCases.filter((testCase) => !testCase.hidden);
        const testCasesToRun = hiddenTestCases.length > 0 ? hiddenTestCases : sampleTestCases;

        if (testCasesToRun.length === 0) {
            res.status(400).json({ message: "Problem has no test cases" });
            return;
        }

        const firstBatch = testCasesToRun.slice(0, SUBMISSION_BATCH_SIZE);
        const tokens = await submitJudge0Batch(sourceCode, languageId, firstBatch);

        const submission = await db.submission.create({
            data: {
                state: "pending",
                judge0TrackingId: tokens[0],
                judge0Tokens: tokens,
                currentBatchStart: 0,
                sourceCode,
                languageId,
                problemId,
                userId,
            },
        });

        res.status(200).json({
            submissionId: submission.id,
        });
    } catch (error: any) {
        console.log(
            "error in the submit problem controller",
            error?.response?.data || error?.message || error
        );

        res.status(502).json({
            message: "Code execution service rejected the request",
            details: error?.response?.data || error?.message || "Unknown error",
        });
    }
};

export default submitProblem;
