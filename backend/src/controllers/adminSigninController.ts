import { Request, Response } from "express";
import { adminSigninZodSchema } from "../zod/auth";
import { db } from "../db";
import bcrypt from 'bcryptjs'
import { ADMIN_JWT_SECRET } from "../utils/envVars";
import jwt from 'jsonwebtoken'

export const adminSigninController = async (req: Request, res: Response) =>  {
    try {
        const parsedData = adminSigninZodSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message: "Invalid inputs"});
            return;
        }

        const { email , password } = parsedData.data;
        
        const Admin = await db.admin.findUnique({
            where:{
                email
            }
        })

        const isPassValid = await bcrypt.compare(password, Admin? Admin.password : "" );

        if(!Admin || !isPassValid){
            res.status(400).json({error:"Invalid username or password"})
            return
        }

        const token = jwt.sign({id: Admin.id},ADMIN_JWT_SECRET,{
            expiresIn: '1h'
        });

        res.cookie("AdminTokenCloudIDE", token, {
            maxAge: 60*60*1000,
            httpOnly: true
        })

        res.status(200).json({
            id: Admin.id,
            token
        })

    } catch (error) {
        console.log("error in admin signin controller" + error);
        res.status(500).json({message : "Internal server error"})
    }
}
