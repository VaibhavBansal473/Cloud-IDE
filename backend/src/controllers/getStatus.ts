import { Request, Response } from "express";
import { db } from "../db";
import { formatSubmissionStatus } from "../utils/submissionStatus";

const getStatus = async (req: Request, res: Response) => {
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
      res.status(400).json({
        message: "Not a valid submission",
      });
      return;
    }

    res.status(200).json(formatSubmissionStatus(submission));
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
