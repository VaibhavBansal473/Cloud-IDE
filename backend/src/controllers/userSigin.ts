import { Request, Response } from "express";
import { db } from "../db";
import { getOTP, verifyOTP } from "../utils/totpgenerater";
import sendMail from "../utils/mailer";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/envVars";
import {
  userSigninZodSchema,
  userSigninVerifyZodSchema,
} from "../zod/auth";

export const userSigninController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("1. Controller reached");

    const parsedData = userSigninZodSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log("2. Invalid input");
      res.status(400).json({ message: "Invalid inputs" });
      return;
    }

    const { email } = parsedData.data;

    console.log("3. Looking for user");

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    console.log("4. Database query completed");

    if (!user) {
      console.log("5. User not found");
      res.status(400).json({ message: "Email not registered" });
      return;
    }

    console.log("6. User found");

    const totp = getOTP(email, "AUTH");
    console.log("7. Generated OTP:", totp);

    const message = `Your OTP for Cloud IDE is ${totp}`;

    console.log("8. Calling sendMail");

    await sendMail(email, message);

    console.log("9. Returned from sendMail");

    res.status(200).json({
      message: "otp sent",
    });

    console.log("10. Response sent");
  } catch (e) {
    console.error("Signin controller error:", e);

    res.status(500).json({
      message: "Internal server error",
      error: e instanceof Error ? e.message : String(e),
    });
  }
};

export const userSigninVerifyController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedData = userSigninVerifyZodSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid inputs" });
      return;
    }

    const { email, otp } = parsedData.data;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "user does not exists" });
      return;
    }

    if (!verifyOTP(email, "AUTH", otp)) {
      res.status(400).json({ message: "invalid otp" });
      return;
    }

    const token = jwt.sign({ Id: user.id }, JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("jwtCloudIDE", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      userId: user.id,
      token,
    });
  } catch (e) {
    console.error("Signin verify controller error:", e);

    res.status(500).json({
      message: "Internal server error",
      error: e instanceof Error ? e.message : String(e),
    });
  }
};