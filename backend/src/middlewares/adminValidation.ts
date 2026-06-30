import { NextFunction, Request, Response } from "express";
import checkSAdmin from "../utils/checkSadmin";
import jwt from 'jsonwebtoken'
import { ADMIN_JWT_SECRET } from "../utils/envVars";
import { db } from "../db";
import { user } from "../types/types";

const adminValidation = async(req:Request,res:Response,next:NextFunction) => {
    try {  
        if(checkSAdmin(req)){ 
            req.User = {
                id: "007"
            }
            next();
            return;
        };

        const token = req.cookies.AdminTokenCloudIDE;
        if(!token){
            res.status(400).json({message: "You are not logged in"});
            return;
        }
        
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET); 
        if(!decoded || typeof decoded === "string" || !decoded.id){
            res.status(400).json({message : "Invalid token"});
            return
        }

        const admin = await db.admin.findUnique({
            where:{
                id : decoded.id
            },
        })

        if(!admin){
            res.status(400).json({message: "No admin found"});
            return;
        }
        const Auser : user = {
            id: admin.id
        }
        req.User = Auser

        next();
        
    } catch (error) {
        console.log("error in admin validation middleware" + error);
        res.status(500).json({messagae : "Internal server error"});
    }
}

export default adminValidation



// 46a6f67f-5bf6-40f3-9a51-f8569d3f755c