import { Request, Response } from "express";
import { db } from "../db";
import { getOTP, verifyOTP } from "../utils/totpgenerater";
import sendMail from "../utils/mailer";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/envVars";
import { userSigninZodSchema , userSigninVerifyZodSchema } from "../zod/auth";

export const userSigninController = async(req : Request,res: Response)=>{
    try {
        
        const parsedData = userSigninZodSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message : "Invalid inputs"});
            return;
        }

        const {email} = parsedData.data;

        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            res.status(400).json("Email not registered");
            return;
        }

        const totp = getOTP(email, "AUTH");
        const message = `Your OTP for Cloud IDE is ${totp}`;
        sendMail(email,message);

        res.status(200).json({
            message: "otp sent"
        })


    } catch (e) {
        console.log("error in signin controller " + e);
        res.status(500).json({message : "Internal server error"});
    }
}

export const userSigninVerifyController = async(req : Request,res: Response)=>{
    try {

        const parsedData = userSigninVerifyZodSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message : "Invalid inputs"});
            return;
        }

        const {email,otp} = parsedData.data;

        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            res.status(400).json({message : "user does not exists"});
            return;
        }

        if(!verifyOTP(email,"AUTH",otp)){
            res.status(400).json({message :"invalid otp"});
            return;
        }

        
        const token = jwt.sign({Id:user.id}, JWT_SECRET,{
            expiresIn: '15d'
        });

        res.cookie("jwtCloudIDE",token, {
            maxAge: 15*24*60*60*1000,
            httpOnly: true,
            // sameSite: "none",
            secure: false
        })

        res.status(200).json({
            userId: user.id,
            token
        })

    } catch (e) {
        console.log("error in siginVerify controller " + e);
        res.status(500).json({message: "Internal server error"});
    }
}

