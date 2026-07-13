import { Submission } from "@prisma/client";

export const terminalStatuses = new Set([
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Runtime Error",
  "Compilation Error",
]);

export const formatSubmissionStatus = (
  submission: Pick<
    Submission,
    "state" | "time" | "memory" | "stdout" | "verdictMessage" | "failedTestCase"
  >
) => ({
  status: submission.state,
  output: {
    time: submission.time,
    memory: submission.memory,
    stdout: submission.verdictMessage || submission.stdout,
  },
  failedTestCase: submission.failedTestCase,
});
