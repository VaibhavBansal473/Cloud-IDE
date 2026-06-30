import z from 'zod'

export const addProblemZodSchema = z.object({
    visible : z.boolean(),
    name : z.string(),
    level : z.string(),
    problemStatement: z.string(),
    testCases: z.string(),
    expectedOutput : z.string(),
    input : z.string()
})

export const submitProblemZodSchema = z.object({
    sourceCode: z.string(),
    languageId: z.number()
})

export const SubmissionCallbackZodSchema = z.object({
    stdout: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    memory: z.number().optional().nullable(),
    stderr: z.string().nullable().optional().nullable(),
    token: z.string(),
    compile_output: z.string().nullable(),
    message: z.string().nullable(),
    status: z.object({
      id: z.number(),
      description: z.string(),
    }),
  });