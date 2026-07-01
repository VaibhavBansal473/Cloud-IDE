import { Request, Response } from "express";
import { db } from "../db";
import { Problem } from "../types/types";
import { setCacheProblems } from "../cache/ProblemsChache";

export const getProblems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const problems = await db.problem.findMany();

    const modifiedProblems = problems.map((problem) => ({
      id: problem.id,
      name: problem.name,
      level: problem.level,
      visible: problem.visible,
      tags: problem.tags,
    }));

    const selectedProblems: Problem[] = problems
      .filter((item) => item.visible)
      .map((problem) => ({
        id: problem.id,
        name: problem.name,
        level: problem.level,
        tags: problem.tags,
        problemStatement: problem.problemStatement,
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
      }));

    setCacheProblems(selectedProblems);

    res.status(200).json(modifiedProblems);
  } catch (error) {
    console.log("error in get problems admin controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProblemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const problemId = Array.isArray(req.params.problemId)
      ? req.params.problemId[0]
      : req.params.problemId;

    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      res.status(400).json({
        message: "Not a valid id",
      });
      return;
    }

    res.status(200).json(problem);
  } catch (error) {
    console.log("error in get problem by id admin controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};