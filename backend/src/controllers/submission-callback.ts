import { Request, Response } from "express";
import { db } from "../db";
import { SubmissionCallbackZodSchema } from "../zod/problemsSchema";
import { JUDGE0_CALLBACK_SECRET } from "../utils/envVars";
import {
  normalizeJudge0Status,
  SUBMISSION_BATCH_SIZE,
  submitJudge0Batch,
} from "../utils/judge0";
import { notifySubmissionUpdate } from "../utils/submissionEvents";
import { formatSubmissionStatus, terminalStatuses } from "../utils/submissionStatus";

const getResultOutput = (data: {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
}) => data.stdout || data.stderr || data.compile_output || data.message || "";

const getMaxTime = (currentTime: string, nextTime?: string | null) => {
  const current = Number(currentTime || 0);
  const next = Number(nextTime || 0);

  if (!Number.isFinite(next) || next <= current) {
    return currentTime;
  }

  return String(next);
};

const submissionCallback = async (req: Request, res: Response) => {
  try {
    console.log("🔥 Callback received");
    if (JUDGE0_CALLBACK_SECRET) {
      const providedSecret =
        req.query.secret || req.header("x-callback-secret");

      if (providedSecret !== JUDGE0_CALLBACK_SECRET) {
        res.status(401).json({ message: "Invalid callback secret" });
        return;
      }
    }

    const parsedBody = SubmissionCallbackZodSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ message: "Invalid callback payload" });
      return;
    }

    const result = parsedBody.data;
    const submission = await db.submission.findFirst({
      where: {
        judge0Tokens: {
          has: result.token,
        },
      },
      include: {
        problem: {
          include: {
            testCases: {
              orderBy: [{ position: "asc" }, { id: "asc" }],
            },
          },
        },
      },
    });

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    if (terminalStatuses.has(submission.state)) {
      res.status(200).json({ message: "Submission already finalized" });
      return;
    }

    const hiddenTestCases = submission.problem.testCases.filter(
      (testCase) => testCase.hidden
    );
    const sampleTestCases = submission.problem.testCases.filter(
      (testCase) => !testCase.hidden
    );
    const testCasesToRun =
      hiddenTestCases.length > 0 ? hiddenTestCases : sampleTestCases;
    const testCaseLabel = hiddenTestCases.length > 0 ? "hidden test case" : "test case";
    const resultOutput = getResultOutput(result);
    const maxTime = getMaxTime(submission.time, result.time);
    const maxMemory = Math.max(submission.memory, result.memory ?? 0);
    const normalizedStatus = normalizeJudge0Status(result.status.description);

    if (result.status.id <= 2) {
      const updatedSubmission = await db.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          state: "pending",
          time: maxTime,
          memory: maxMemory,
          stdout: resultOutput,
        },
      });

      notifySubmissionUpdate(
        updatedSubmission.id,
        formatSubmissionStatus(updatedSubmission)
      );
      res.status(200).json({ message: "Pending result received" });
      return;
    }

    if (normalizedStatus !== "Accepted") {
      const failedTestCase = submission.currentBatchStart + 1;
      const verdictMessage = resultOutput
        ? `Failed on ${testCaseLabel} ${failedTestCase}\n${resultOutput}`
        : `Failed on ${testCaseLabel} ${failedTestCase}`;

      const updatedSubmission = await db.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          state: normalizedStatus,
          failedTestCase,
          verdictMessage,
          time: maxTime,
          memory: maxMemory,
          stdout: resultOutput,
        },
      });

      notifySubmissionUpdate(
        updatedSubmission.id,
        formatSubmissionStatus(updatedSubmission)
      );
      res.status(200).json({ message: "Submission finalized" });
      return;
    }

    const nextBatchStart = submission.currentBatchStart + SUBMISSION_BATCH_SIZE;

    if (nextBatchStart >= testCasesToRun.length) {
      const updatedSubmission = await db.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          state: "Accepted",
          time: maxTime,
          memory: maxMemory,
          stdout: resultOutput,
          verdictMessage: "Accepted",
        },
      });

      notifySubmissionUpdate(
        updatedSubmission.id,
        formatSubmissionStatus(updatedSubmission)
      );
      res.status(200).json({ message: "Submission accepted" });
      return;
    }

    const nextBatch = testCasesToRun.slice(
      nextBatchStart,
      nextBatchStart + SUBMISSION_BATCH_SIZE
    );
    const nextTokens = await submitJudge0Batch(
      submission.sourceCode,
      submission.languageId,
      nextBatch
    );

    const updatedSubmission = await db.submission.update({
      where: {
        id: submission.id,
      },
      data: {
        state: "pending",
        currentBatchStart: nextBatchStart,
        judge0TrackingId: nextTokens[0],
        judge0Tokens: nextTokens,
        time: maxTime,
        memory: maxMemory,
        stdout: resultOutput,
      },
    });

    notifySubmissionUpdate(
      updatedSubmission.id,
      formatSubmissionStatus(updatedSubmission)
    );
    res.status(200).json({ message: "Next test case submitted" });
  } catch (error: any) {
    console.error(
      "error in submission callback",
      error?.response?.data || error?.message || error
    );
    return res.status(500).json({
      message: "Failed to process submission callback",
    });
  }
};

export default submissionCallback;
