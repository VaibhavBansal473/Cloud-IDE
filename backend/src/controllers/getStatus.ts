import { Request, Response } from "express";
import axios from "axios";
import { db } from "../db";
import { STATUS_URL } from "../utils/envVars";

interface Judge0Result {
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
}

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

    if (!submission) {
      res.status(400).json({
        message: "Not a valid submission",
      });
      return;
    }

    if (submission.state !== "pending") {
      res.status(200).json({
        status: submission.state,
        output: {
          time: submission.time,
          memory: submission.memory,
          stdout: submission.stdout,
        },
      });
      return;
    }

    const response = await axios.get(`${STATUS_URL}/${submission.judge0TrackingId}`, {
      params: {
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    });

    const result = response.data as Judge0Result;

    if (result.status.id > 2) {
      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          state: result.status.description,
          time: result.time ?? "",
          memory: result.memory ?? 0,
          stdout:
            result.stdout ??
            result.stderr ??
            result.compile_output ??
            "",
        },
      });

      res.status(200).json({
        status: result.status.description,
        output: {
          time: result.time ?? "",
          memory: result.memory ?? 0,
          stdout:
            result.stdout ??
            result.stderr ??
            result.compile_output ??
            "",
        },
      });
      return;
    }

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