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

export const CreateSpaceSchema=z.object({
    name:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId:z.string().optional(),

})


export const createElementSchema=z.object({
      imageurl:z.string(),
      width:z.number(),
      height:z.number(),
      static:z.boolean(),
})


export const MetaDataSchema=z.object({
    avatarId:z.string()
})