import { Request, Response } from "express";
import { db } from "../db";

const updateProblem = async(req: Request, res:Response)=>{
    try {
        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;
        const updatedData = req.body;

        const existingProblem = await db.problem.findUnique({
            where: { 
                id: problemId 
            }
          });
      
          if (!existingProblem) {
            res.status(400).json({ message: "Problem not found" });
            return;
          }

        const problem = await db.problem.update({
            where:{
                id: problemId,
            },
            data: updatedData
        })

        res.status(200).json(problem);
        
    } catch (error) {
        console.log("error in update problem conrtoller "+ error);
        res.status(500).json({message : "Internal server error"});
    }
}

export default updateProblem