import z from 'zod'

export const userSignupZodSchema = z.object({
    email : z.string().email(),
    name : z.string()
})

export const userSignupVerifyZodSchema = z.object({
    email: z.string().email(),
    otp: z.string()
})

export const userSigninZodSchema = z.object({
    email : z.string().email(),
})

export const userSigninVerifyZodSchema = z.object({
    email: z.string().email(),
    otp: z.string()
})

export const adminSigninZodSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const addAdminZodSchema = z.object({
    email: z.string().email(),
    password : z.string(),
    confirmPassword: z.string()
})