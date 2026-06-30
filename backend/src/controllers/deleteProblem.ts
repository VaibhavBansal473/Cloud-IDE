import { Request, Response } from "express";
import { db } from "../db";

const deleteProblem = async(req:Request, res: Response)=>{
    try {
        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;

        const problem = await db.problem.delete({
            where:{
                id: problemId
            }
        });
        
        res.status(200).json(problem);
        
    } catch (error) {
        console.log("error in delete problem controller "+ error);
        res.status(500).json({message: "Internal server error"});
    }
}
export default deleteProblem;