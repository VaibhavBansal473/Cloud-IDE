import { Request, Response } from "express";
import { db } from "../db";
import {
  getJudge0BatchResults,
  normalizeJudge0Status,
  SUBMISSION_BATCH_SIZE,
  submitJudge0Batch,
} from "../utils/judge0";

const terminalStatuses = new Set([
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Runtime Error",
  "Compilation Error",
]);

const getStatus = async (req: Request, res: Response) => {
  try {
    const submissionId = Array.isArray(req.params.submissionId)
      ? req.params.submissionId[0]
      : req.params.submissionId;

    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
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
      res.status(400).json({
        message: "Not a valid submission",
      });
      return;
    }

    if (terminalStatuses.has(submission.state)) {
      res.status(200).json({
        status: submission.state,
        output: {
          time: submission.time,
          memory: submission.memory,
          stdout: submission.verdictMessage,
        },
        failedTestCase: submission.failedTestCase,
      });
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

    if (testCasesToRun.length === 0) {
      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          state: "Runtime Error",
          verdictMessage: "Problem has no test cases",
        },
      });

      res.status(200).json({
        status: "Runtime Error",
        output: {
          time: "",
          memory: 0,
          stdout: "Problem has no test cases",
        },
      });
      return;
    }

    const batchResults = await getJudge0BatchResults(submission.judge0Tokens);
    const pendingResult = batchResults.find((result) => result.status.id <= 2);

    if (pendingResult) {
      res.status(200).json({
        status: "pending",
        output: {
          time: "",
          memory: 0,
          stdout: "",
        },
      });
      return;
    }

    const failedResultIndex = batchResults.findIndex(
      (result) => normalizeJudge0Status(result.status.description) !== "Accepted"
    );

    if (failedResultIndex !== -1) {
      const failedResult = batchResults[failedResultIndex];
      const verdict = normalizeJudge0Status(failedResult.status.description);
      const failedTestCase = submission.currentBatchStart + failedResultIndex + 1;
      const verdictMessage = `Failed on ${testCaseLabel} ${failedTestCase}`;

      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          state: verdict,
          failedTestCase,
          verdictMessage,
          time: failedResult.time ?? "",
          memory: failedResult.memory ?? 0,
          stdout: "",
        },
      });

      res.status(200).json({
        status: verdict,
        output: {
          time: failedResult.time ?? "",
          memory: failedResult.memory ?? 0,
          stdout: verdictMessage,
        },
        failedTestCase,
      });
      return;
    }

    const nextBatchStart = submission.currentBatchStart + submission.judge0Tokens.length;
    const batchMaxMemory = Math.max(
      ...batchResults.map((result) => result.memory ?? 0),
      submission.memory
    );
    const batchMaxTime = batchResults.reduce((currentMax, result) => {
      const time = Number(result.time ?? 0);
      return Number.isFinite(time) && time > currentMax ? time : currentMax;
    }, Number(submission.time || 0));

    if (nextBatchStart >= testCasesToRun.length) {
      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          state: "Accepted",
          time: batchMaxTime ? String(batchMaxTime) : "",
          memory: batchMaxMemory,
          stdout: "",
          verdictMessage: "Accepted",
        },
      });

      res.status(200).json({
        status: "Accepted",
        output: {
          time: batchMaxTime ? String(batchMaxTime) : "",
          memory: batchMaxMemory,
          stdout: "Accepted",
        },
      });
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

    await db.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        currentBatchStart: nextBatchStart,
        judge0TrackingId: nextTokens[0],
        judge0Tokens: nextTokens,
        time: batchMaxTime ? String(batchMaxTime) : "",
        memory: batchMaxMemory,
      },
    });

    res.status(200).json({
      status: "pending",
      output: {
        time: "",
        memory: 0,
        stdout: "",
      },
    });
  } catch (error: any) {
    console.log(
      "error in getStatus",
      error?.response?.data || error?.message || error
    );

    res.status(500).json({
      message: "Failed to fetch execution status",
    });
  }
};

export default getStatus;
