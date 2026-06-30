import { Request } from "express";
import { S_ADMIN_JWT_SECRET } from "./envVars";
import jwt from 'jsonwebtoken'

const checkSAdmin = (req: Request) =>{
    const token = req.cookies.SAdminTokenCloudIDE;
        if(!token){
            return false
        }

        const decoded = jwt.verify(token, S_ADMIN_JWT_SECRET);
        if(!decoded){
            return false;
        }
        return true;
}

export default checkSAdmin