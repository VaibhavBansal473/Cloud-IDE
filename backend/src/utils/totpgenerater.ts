import { totp } from "otplib";
import { TOPT_SECRET } from "./envVars";

type TokenType = "AUTH" | "ADMIN_AUTH";


totp.options = {
  step: 300, 
  window: 1, 
};

export function getOTP(email: string, type: TokenType) {
  const secret = email + type + TOPT_SECRET;
  return totp.generate(secret);
}

export function verifyOTP(email: string, type: TokenType, otp: string) {
  const secret = email + type + TOPT_SECRET;
  return totp.check(otp, secret);
}
