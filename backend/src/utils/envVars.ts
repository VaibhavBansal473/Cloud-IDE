const isProduction = process.env.NODE_ENV === "production";

const envOrLocalDefault = (name: string, localDefault: string) => {
    const value = process.env[name];

    if (value) {
        return value;
    }

    if (isProduction) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return localDefault;
};

export const JWT_SECRET = envOrLocalDefault(
    "JWT_SECRET",
    "local-user-jwt-secret"
);
export const TOPT_SECRET = envOrLocalDefault(
    "TOTP_SECRET",
    "local-totp-secret"
);
export const ADMIN_JWT_SECRET = envOrLocalDefault(
    "ADMIN_JWT_SECRET",
    "local-admin-jwt-secret"
);
export const S_ADMIN_JWT_SECRET = envOrLocalDefault(
    "S_ADMIN_JWT_SECRET",
    "local-super-admin-jwt-secret"
);

export const RAPID_API_KEY =
    process.env.RAPID_API_KEY || process.env.RAPIDAPI_KEY;

export const RAPID_API_HOST =
    process.env.RAPID_API_HOST || process.env.RAPIDAPI_HOST;

export const SUBMISSION_URL =
    process.env.SUBMISSION_URL ||
    "https://judge0-ce.p.rapidapi.com/submissions";

export const STATUS_URL =
    process.env.STATUS_URL ||
    "https://judge0-ce.p.rapidapi.com/submissions";
