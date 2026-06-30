import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/envVars";
import { db } from "../db";

const uservalidation = async(req : Request,res: Response, next: NextFunction)=>{
    try {

        const token = req.cookies.jwtCloudIDE;
        if(!token){
            res.status(400).json({message : "Your are not logged in"});
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || typeof decoded ==="string" || !decoded.Id){
            res.status(400).json({message : "invalid token"});
            return;
        }

        const user = await db.user.findUnique({
            where:{
                id: decoded.Id
            }
        })

        if(!user){
            res.status(400).json({message : "User does not exist"});
            return;
        }

        req.User = {
            id: user.id
        }

        next();
        
    } catch (error) {
        console.log("error in user validation middleware" + error);
        res.status(500).json({message : "Internal server error"});
    }
}

export default uservalidation