import { Request, Response } from "express"
import { addProblemZodSchema } from "../zod/problemsSchema";
import { db } from "../db";

const addProblem  = async(req: Request, res: Response) => {
    try {
        const data = addProblemZodSchema.safeParse(req.body);
        if(!data.success){
            res.status(400).json({message: "invalid inputs"});
            return;
        }

        const adminId = req.User?.id;
        if(!adminId){
            res.status(400).json({message : "log in as an admin"});
            return;
        }

        const { visible , name , level , problemStatement , testCases , expectedOutput , input } = data.data;

        const problem = await db.problem.create({
            data:{
                visible,
                name,
                level,
                problemStatement,
                testCases,
                expectedOutput,
                input,
                adminId
            }
        });

        res.status(200).json({
            id: problem.id
        });
        
    } catch (error) {
        console.log("error in add problem controller "+error);
        res.status(500).json({message : "Internal server error"});
    }
}
export default addProblem