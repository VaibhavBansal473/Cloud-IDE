import { Request, Response } from "express";
import { cachedProblems, setCacheProblems } from "../cache/ProblemsChache";
import { db } from "../db";

export const getProblems = async (req: Request, res: Response) => {
  try {
    if (cachedProblems.length !== 0) {
      const selectedProblems = cachedProblems.map((problem) => ({
        id: problem.id,
        name: problem.name,
        level: problem.level,
        tags: problem.tags,
      }));

      res.status(200).json(selectedProblems);
      return;
    }

    const problems = await db.problem.findMany({
      where: {
        visible: true,
      },
      select: {
        id: true,
        name: true,
        level: true,
        tags: true,
        problemStatement: true,
        sampleInput: true,
        sampleOutput: true,
        testCases: {
          where: {
            hidden: false,
          },
          orderBy: [{ position: "asc" }, { id: "asc" }],
          select: {
            input: true,
            output: true,
          },
        },
      },
    });

    const visibleProblems = problems.map((problem) => ({
      id: problem.id,
      name: problem.name,
      level: problem.level,
      tags: problem.tags,
      problemStatement: problem.problemStatement,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      sampleTestCases: problem.testCases,
    }));

    setCacheProblems(visibleProblems);

    const selectedProblems = visibleProblems.map((problem) => ({
      id: problem.id,
      name: problem.name,
      level: problem.level,
      tags: problem.tags,
    }));

    res.status(200).json(selectedProblems);
  } catch (error) {
    console.log("error in get problems controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const problemId = Array.isArray(req.params.problemId)
      ? req.params.problemId[0]
      : req.params.problemId;

    const cachedProblem = cachedProblems.find(
      (problem) => problem.id === problemId
    );

    if (cachedProblem) {
      res.status(200).json(cachedProblem);
      return;
    }

    const selectedProblem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      select: {
        id: true,
        name: true,
        level: true,
        tags: true,
        problemStatement: true,
        sampleInput: true,
        sampleOutput: true,
        testCases: {
          where: {
            hidden: false,
          },
          orderBy: [{ position: "asc" }, { id: "asc" }],
          select: {
            input: true,
            output: true,
          },
        },
      },
    });

    if (!selectedProblem) {
      res.status(400).json({
        message: "Not a valid problem",
      });
      return;
    }

    res.status(200).json({
      id: selectedProblem.id,
      name: selectedProblem.name,
      level: selectedProblem.level,
      tags: selectedProblem.tags,
      problemStatement: selectedProblem.problemStatement,
      sampleInput: selectedProblem.sampleInput,
      sampleOutput: selectedProblem.sampleOutput,
      sampleTestCases: selectedProblem.testCases,
    });
  } catch (error) {
    console.log("error in get problem by id controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
