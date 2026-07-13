import axios from "axios";
import { RAPID_API_HOST, RAPID_API_KEY, STATUS_URL, SUBMISSION_URL } from "./envVars";

export const SUBMISSION_BATCH_SIZE = 2;

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
  const response = await axios.post<{ token: string }[]>(
    `${SUBMISSION_URL}/batch`,
    {
      submissions: testCases.map((testCase) => ({
        language_id: languageId,
        source_code: sourceCode,
        stdin: testCase.input,
        expected_output: testCase.output,
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

export const getJudge0BatchResults = async (tokens: string[]) => {
  const response = await axios.get<{ submissions: Judge0Result[] }>(
    `${STATUS_URL}/batch`,
    {
      params: {
        tokens: tokens.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: getJudge0Headers(),
    }
  );

  return response.data.submissions;
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
