export const JWT_SECRET = process.env.JWT_SECRET || "heyhey";
export const TOPT_SECRET = process.env.TOTP_SECRET;
export const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "123123";
export const S_ADMIN_JWT_SECRET = process.env.S_ADMIN_JWT_SECRET || "123123";

export const SUBMISSION_URL =
    process.env.SUBMISSION_URL ||
    "https://judge029.p.rapidapi.com/submissions";

export const STATUS_URL =
    process.env.STATUS_URL ||
    "https://judge029.p.rapidapi.com/submissions";