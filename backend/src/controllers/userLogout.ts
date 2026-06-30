import { Request, Response } from "express";

const userLogoutController = async(req:Request, res: Response)=>{
    try {

        res.cookie("jwtCloudIDE","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully"})
        
    } catch (error) {
        console.log("error in user logout controller "+error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default userLogoutController;