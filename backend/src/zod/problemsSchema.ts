import z from "zod";

const testCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
  hidden: z.boolean().optional().default(true),
});

export const addProblemZodSchema = z.object({
  visible: z.boolean(),

  name: z.string(),

  level: z.enum(["EASY", "MEDIUM", "HARD"]),

  tags: z.array(z.string()),

  problemStatement: z.string(),

  sampleInput: z.string(),

  sampleOutput: z.string(),

  testCases: z.array(testCaseSchema),
}).superRefine((problem, ctx) => {
  const sampleCount = problem.testCases.filter((testCase) => !testCase.hidden).length;
  const hiddenCount = problem.testCases.filter((testCase) => testCase.hidden).length;

  if (sampleCount < 1 || sampleCount > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Problem must have between 1 and 3 sample test cases",
      path: ["testCases"],
    });
  }

  if (hiddenCount > 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Problem cannot have more than 5 hidden test cases",
      path: ["testCases"],
    });
  }
});

export const submitProblemZodSchema = z.object({
  sourceCode: z.string(),
  languageId: z.number(),
});

export const SubmissionCallbackZodSchema = z.object({
  stdout: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  memory: z.number().optional().nullable(),
  stderr: z.string().optional().nullable(),
  token: z.string(),
  compile_output: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  status: z.object({
    id: z.number(),
    description: z.string(),
  }),
});
