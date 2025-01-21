import z from "zod"


export const signupschema=z.object({
    username:z.string(),
    password:z.string(),
    type:z.enum(["user","admin"])
})

export const signinschema=z.object({
    username:z.string(),
    password:z.string()
})



