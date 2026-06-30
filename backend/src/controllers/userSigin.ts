import { Request, Response } from "express";
import { db } from "../db";
import { getOTP, verifyOTP } from "../utils/totpgenerater";
import sendMail from "../utils/mailer";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/envVars";
import { userSigninZodSchema , userSigninVerifyZodSchema } from "../zod/auth";

export const userSigninController = async (req: Request, res: Response) => {
    try {

        console.log("1. Controller reached");

        const parsedData = userSigninZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid inputs" });
            return;
        }

        const { email } = parsedData.data;

        console.log("2. Looking for user");

        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        console.log("3. Database query completed");

        if (!user) {
            console.log("4. User not found");
            res.status(400).json({ message: "Email not registered" });
            return;
        }

        console.log("5. User found");

        const totp = getOTP(email, "AUTH");
        console.log("6. Generated OTP:", totp);

        const message = `Your OTP for Cloud IDE is ${totp}`;

        console.log("7. Calling sendMail");

        await sendMail(email, message);

        console.log("8. sendMail returned");

        res.status(200).json({
            message: "otp sent"
        });

        console.log("9. Response sent");

    } catch (e) {
        console.error("Signin controller error:", e);
        res.status(500).json({
            message: "Internal server error",
            error: e instanceof Error ? e.message : String(e)
        });
    }
};

