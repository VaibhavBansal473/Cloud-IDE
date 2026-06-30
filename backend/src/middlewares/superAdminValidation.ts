import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import {  S_ADMIN_JWT_SECRET } from "../utils/envVars";
import checkSAdmin from "../utils/checkSadmin";

const superAdminValidation = (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        if(!checkSAdmin(req)){
            res.status(401).json({message : "You are not logged in as an admin"});
            return;
        }

        next();
        
    } catch (error) {
        console.log("Error in SuperAdmin validation middleware" + error);
        res.status(500).json({message:"internal server error"});
    }
}

export default superAdminValidation;