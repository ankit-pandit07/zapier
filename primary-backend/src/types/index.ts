import {z} from "zod"

export const SignupSchema=z.object({
    name:z.string().min(5),
    username:z.string().min(5),
    password:z.string().min(6)
})

export const SigninSchema=z.object({
    username:z.string(),
    password:z.string()
})