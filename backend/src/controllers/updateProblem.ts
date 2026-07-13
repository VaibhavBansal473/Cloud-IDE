import { Request, Response } from "express";
import { db } from "../db";
import { Difficulty } from "@prisma/client";
import { clearCacheProblems } from "../cache/ProblemsChache";
import { addProblemZodSchema } from "../zod/problemsSchema";

const updateProblem = async(req: Request, res:Response)=>{
    try {
        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;
        const updatedData = addProblemZodSchema.safeParse(req.body);

        if (!updatedData.success) {
            res.status(400).json({ message: "Invalid inputs" });
            return;
        }

        const existingProblem = await db.problem.findUnique({
            where: { 
                id: problemId 
            }
          });
      
          if (!existingProblem) {
            res.status(400).json({ message: "Problem not found" });
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
        } = updatedData.data;

        const testCasesWithPositions = testCases.map((testCase, index) => ({
            ...testCase,
            position: index,
        }));

        const firstSample = testCasesWithPositions.find((testCase) => !testCase.hidden);

        const problem = await db.problem.update({
            where:{
                id: problemId,
            },
            data: {
                visible,
                name,
                level: level as Difficulty,
                tags,
                problemStatement,
                sampleInput: firstSample?.input ?? sampleInput,
                sampleOutput: firstSample?.output ?? sampleOutput,
                testCases: {
                    deleteMany: {},
                    create: testCasesWithPositions,
                },
            },
            include: {
                testCases: {
                    orderBy: [{ position: "asc" }, { id: "asc" }],
                },
            },
        })

        clearCacheProblems();

        res.status(200).json(problem);
        
    } catch (error) {
        console.log("error in update problem conrtoller "+ error);
        res.status(500).json({message : "Internal server error"});
    }
}

export default updateProblem
