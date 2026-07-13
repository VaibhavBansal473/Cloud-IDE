import axios from "axios";
import {
  JUDGE0_CALLBACK_SECRET,
  JUDGE0_CALLBACK_URL,
  RAPID_API_HOST,
  RAPID_API_KEY,
  SUBMISSION_URL,
} from "./envVars";

export const SUBMISSION_BATCH_SIZE = 1;

export interface Judge0Result {
  token: string;
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

export interface Judge0TestCase {
  input: string;
  output: string;
}

export const getJudge0Headers = () => ({
  "Content-Type": "application/json",
  "X-RapidAPI-Key": RAPID_API_KEY,
  "X-RapidAPI-Host": RAPID_API_HOST,
});

export const submitJudge0Batch = async (
  sourceCode: string,
  languageId: number,
  testCases: Judge0TestCase[]
) => {
  if (!JUDGE0_CALLBACK_URL) {
    throw new Error("JUDGE0_CALLBACK_URL is required for callback execution");
  }

  const callbackUrl = new URL(JUDGE0_CALLBACK_URL);
  if (JUDGE0_CALLBACK_SECRET) {
    callbackUrl.searchParams.set("secret", JUDGE0_CALLBACK_SECRET);
  }

  const response = await axios.post<{ token: string }[]>(
    `${SUBMISSION_URL}/batch`,
    {
      submissions: testCases.map((testCase) => ({
        language_id: languageId,
        source_code: sourceCode,
        stdin: testCase.input,
        expected_output: testCase.output,
        callback_url: callbackUrl.toString(),
      })),
    },
    {
      params: {
        base64_encoded: "false",
        wait: "false",
        fields: "*",
      },
      headers: getJudge0Headers(),
    }
  );

  return response.data.map((submission) => submission.token);
};

export const normalizeJudge0Status = (description: string) => {
  if (description === "Accepted") {
    return "Accepted";
  }

  if (description === "Wrong Answer") {
    return "Wrong Answer";
  }

  if (description === "Time Limit Exceeded") {
    return "Time Limit Exceeded";
  }

  if (description === "Compilation Error") {
    return "Compilation Error";
  }

  if (description.startsWith("Runtime Error")) {
    return "Runtime Error";
  }

  return description;
};
