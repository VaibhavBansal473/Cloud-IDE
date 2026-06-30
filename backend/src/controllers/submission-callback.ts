import { Request, Response } from "express";
import { db } from "../db";
import { SubmissionCallbackZodSchema } from "../zod/problemsSchema";

const submissionCallback = async(req: Request, res: Response)=>{
    try {
        console.log("control reached here in callback url");
        console.log(req.body);
        const parsedBody = SubmissionCallbackZodSchema.safeParse(req.body);

        if(!parsedBody.success){
            res.status(400);
            return;
        }  
        console.log(parsedBody.data.status.description);
        const { token } = parsedBody.data


        await db.submission.update({
            where:{
                judge0TrackingId: token
            },
            data:{
                state: parsedBody.data.status.description,
                time : parsedBody.data.time?? "NA",
                memory : parsedBody.data.memory ?? 0,
                stdout : parsedBody.data.stdout ? Buffer.from(parsedBody.data.stdout, 'base64').toString('utf-8') : ""
            }
        })

        res.send("recieved");
        
    } catch (error) {
    console.error(error);
    return res.status(500).json(error);
}
}
export default submissionCallback;