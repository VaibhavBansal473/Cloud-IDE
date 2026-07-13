import { Response } from "express";

type SubmissionStatusPayload = {
  status: string;
  output: {
    time: string;
    memory: number;
    stdout: string;
  };
  failedTestCase?: number | null;
};

const subscribers = new Map<string, Set<Response>>();

export const addSubmissionSubscriber = (
  submissionId: string,
  response: Response
) => {
  const submissionSubscribers = subscribers.get(submissionId) || new Set<Response>();
  submissionSubscribers.add(response);
  subscribers.set(submissionId, submissionSubscribers);

  return () => {
    submissionSubscribers.delete(response);
    if (submissionSubscribers.size === 0) {
      subscribers.delete(submissionId);
    }
  };
};

export const notifySubmissionUpdate = (
  submissionId: string,
  payload: SubmissionStatusPayload
) => {
  const submissionSubscribers = subscribers.get(submissionId);
  if (!submissionSubscribers) {
    return;
  }

  const event = `data: ${JSON.stringify(payload)}\n\n`;
  submissionSubscribers.forEach((response) => response.write(event));
};
