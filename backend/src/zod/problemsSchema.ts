import z from "zod";

export const addProblemZodSchema = z.object({
  visible: z.boolean(),

  name: z.string(),

  level: z.enum(["EASY", "MEDIUM", "HARD"]),

  tags: z.array(z.string()),

  problemStatement: z.string(),

  sampleInput: z.string(),

  sampleOutput: z.string(),

  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      hidden: z.boolean().optional().default(true),
    })
  ),
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
  compile_output: z.string().nullable(),
  message: z.string().nullable(),
  status: z.object({
    id: z.number(),
    description: z.string(),
  }),
});