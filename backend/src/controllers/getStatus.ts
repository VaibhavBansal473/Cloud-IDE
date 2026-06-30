// for user polling for result

import { Request, Response } from "express";
import { db } from "../db";

const getStatus = async(req: Request, res: Response)=>{
    try {
        const submissionId = Array.isArray(req.params.submissionId) ? req.params.submissionId[0] : req.params.submissionId;

        const submission = await db.submission.findUnique({
            where:{
                id: submissionId
            }
        })

        if(!submission){
            res.status(400).json({message : "Not a valid problem"});
            return;
        }

        res.status(200).json({
            status: submission.state,
            output : {
                time : submission.time,
                memory : submission.memory,
                stdout : submission.stdout
            }
        })
        
    } catch (error) {
        console.log("error in the getStatus controller "+error);
        res.status(500).json({message : "Internal server error"});
    }
}

export default getStatus