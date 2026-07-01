import { Request, Response } from "express";
import { submitProblemZodSchema } from "../zod/problemsSchema";
import axios from "axios";
import { db } from "../db";
import { SUBMISSION_URL } from "../utils/envVars";

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
        });

        if (!problem || !problem.visible) {
            res.status(400).json({ message: "Not a valid problem" });
            return;
        }

        const options = {
            method: "POST",
            url: SUBMISSION_URL,
            params: {
                base64_encoded: "false",
                wait: "false",
                fields: "*",
            },
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
            },
            data: {
                language_id: languageId,
                source_code: sourceCode,
                stdin: problem.input,
                expected_output: problem.expectedOutput,
            },
        };

        const response: any = await axios.request(options);

        const token: string = response.data.token;

        const submission = await db.submission.create({
            data: {
                state: "pending",
                judge0TrackingId: token,
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