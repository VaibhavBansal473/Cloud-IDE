import { Request, Response } from "express";
import { adminSigninZodSchema } from "../zod/auth";
import jwt from 'jsonwebtoken'
import { S_ADMIN_JWT_SECRET } from "../utils/envVars";

const SAdminSignin= async(req:Request,res:Response)=>{
    try {

        const parsedData = adminSigninZodSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message: "Invalid inputs"});
            return;
        }
        const { email , password } = parsedData.data;

        if(email !== process.env.S_ADMIN_MAIL || password !== process.env.S_ADMIN_PASS){
            res.status(400).json({message : "invalid email or password"});
            return;
        }

        const token = jwt.sign({id: "007"}, S_ADMIN_JWT_SECRET,{
            expiresIn: '1h'
        });

        res.cookie("SAdminTokenCloudIDE",token,{
            maxAge: 60*60*1000,
            httpOnly: true
        })

        res.status(200).json({message: "seccess"});

    } catch (error) {
        console.log("Error in Sadmin signin controller "+error);
        res.status(500).json({message:"internal server error"})
    }
}

export default SAdminSignin;