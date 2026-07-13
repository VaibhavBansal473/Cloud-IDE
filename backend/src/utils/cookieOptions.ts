import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = (maxAge: number): CookieOptions => ({
    maxAge,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
});

export const clearAuthCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};
