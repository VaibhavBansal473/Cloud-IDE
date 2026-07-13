import { Request, Response } from "express";
import { db } from "../db";
import { addSubmissionSubscriber } from "../utils/submissionEvents";
import { formatSubmissionStatus, terminalStatuses } from "../utils/submissionStatus";

const streamStatus = async (req: Request, res: Response) => {
  try {
    const submissionId = Array.isArray(req.params.submissionId)
      ? req.params.submissionId[0]
      : req.params.submissionId;

    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission || submission.userId !== req.User?.id) {
      res.status(404).json({ message: "Not a valid submission" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    res.write(`data: ${JSON.stringify(formatSubmissionStatus(submission))}\n\n`);

    if (terminalStatuses.has(submission.state)) {
      res.end();
      return;
    }

    const unsubscribe = addSubmissionSubscriber(submissionId, res);

    req.on("close", () => {
      unsubscribe();
    });
  } catch (error) {
    console.log("error in streamStatus", error);
    res.status(500).json({ message: "Failed to stream execution status" });
  }
};

export default streamStatus;
