import { Request, Response } from "express"
import { addAdminZodSchema } from "../zod/auth"
import bcrypt from 'bcryptjs'
import { db } from "../db";


const addAdmin = async(req : Request, res: Response)=>{
    try {
        const parsedData = addAdminZodSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message : "Invalid inputs"});
            return;
        }
        const { email , password , confirmPassword } = parsedData.data;
        if(password!==confirmPassword){
            res.status(401).json({message : "Passwords do not match"});
            return;
        }

        const hashedPass = await bcrypt.hash(password,10);

        const admin = await db.admin.create({
            data:{
                email,
                password: hashedPass
            }
        });

        res.status(200).json({
            Id: admin.id
        })
        
    } catch (error) {
        console.log("Error while adding an admin" + error)
        res.status(500).json({message: "Internal server error"});
    }
}

export default addAdmin;