import { Request, Response } from "express";
import { db } from "../db";
import { Problem } from "../types/types";
import { setCacheProblems } from "../cache/ProblemsChache";

export const getProblems = async(req: Request,res: Response) : Promise<void> =>{
    try {
        const problems = await db.problem.findMany();
        const ModProbelms = problems.map((problem)=>({
            id: problem.id,
            name: problem.name,
            level: problem.level,
            visible: problem.visible,
        }))

        const Selectedproblems:Problem[] = problems.filter((item)=> item.visible).map((problem)=>({
            id: problem.id,
            name: problem.name,
            level:problem.level,
            problemStatement: problem.problemStatement,
            testCases: problem.testCases,
            expectedOutput: problem.expectedOutput,
        }))

        setCacheProblems(Selectedproblems);

        res.status(200).json(ModProbelms);

    } catch (error) {
        console.log("error in get problems admin controller" + error);
        res.status(500).json({message : "Internal server error"});
        return 
    }
}

export const getProblemById = async(req: Request,res: Response): Promise<void> =>{
    try {

        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;

        const problem = await db.problem.findUnique({
            where:{
                id: problemId
            }
        })

        if(!problem){
            res.status(400).json({message:"Not a valid id"}); 
            return
        }

        res.status(200).json(problem);
        
    } catch (error) {
        console.log("error in get problem by id admin controller" + error);
        res.status(500).json({message : "Internal server error"});
    }
}