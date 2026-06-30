import { Request, Response } from "express";
import { cachedProblems, setCacheProblems } from "../cache/ProblemsChache";
import { db } from "../db";


export const getProblems = async(req: Request, res:Response) =>{
    try {

        const Cproblems = cachedProblems;

        if(Cproblems.length!==0){
            const Selectedprobelms = Cproblems.map((problem) => ({
                id: problem.id,
                name: problem.name,
                level: problem.level,
            }));
            res.status(200).json(Selectedprobelms);
            return
        }

        const problems = await db.problem.findMany({
            where:{
                visible: true
            },
            omit:{
                adminId: true,
                visible:true
            }
        });

        setCacheProblems(problems);

        const Selectedprobelms = problems.map((problem)=>({
            id:problem.id,
            name: problem.name,
            level: problem.level,
        }))


        res.status(200).json(Selectedprobelms);

    } catch (error) {
        console.log("error in get problems controller" + error);
        res.status(500).json({message : "Internal server error"});
    }
}

export const getProblemById = async(req:Request, res: Response)=>{
    try {
        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;
        const problem = cachedProblems.filter((problem)=> problem.id===problemId);

        if(problem.length!==0){
            res.status(200).json(problem[0]);
            return
        }

        const selectedProblem = await db.problem.findUnique({
            where:{
                id: problemId
            },
            omit:{
                adminId: true,
                visible:true
            }
        })

        res.status(200).json(selectedProblem);

    } catch (error) {
        console.log("error in get problem by id controller" + error);
        res.status(500).json({message :"Internal server error"});
    }
}

