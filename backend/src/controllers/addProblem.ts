import { Request, Response } from "express";
import { db } from "../db";
import { Difficulty } from "@prisma/client";
import { addProblemZodSchema } from "../zod/problemsSchema";
import { clearCacheProblems } from "../cache/ProblemsChache";

const addProblem = async (req: Request, res: Response) => {
  try {
    const data = addProblemZodSchema.safeParse(req.body);

    if (!data.success) {
      res.status(400).json({ message: "Invalid inputs" });
      return;
    }

    const adminId = req.User?.id;

    if (!adminId) {
      res.status(401).json({ message: "Login as admin" });
      return;
    }

    const {
      visible,
      name,
      level,
      tags,
      problemStatement,
      sampleInput,
      sampleOutput,
      testCases,
    } = data.data;

    const testCasesWithPositions = testCases.map((testCase, index) => ({
      ...testCase,
      position: index,
    }));

    const firstSample = testCasesWithPositions.find((testCase) => !testCase.hidden);

    const problem = await db.problem.create({
      data: {
        visible,
        name,
        level: level as Difficulty,
        tags,
        problemStatement,
        sampleInput: firstSample?.input ?? sampleInput,
        sampleOutput: firstSample?.output ?? sampleOutput,

        testCases: {
          create: testCasesWithPositions,
        },

        adminId,
      },
    });

    clearCacheProblems();

    res.status(200).json({
      id: problem.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default addProblem;
