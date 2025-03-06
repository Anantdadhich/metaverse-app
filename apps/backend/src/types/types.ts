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

export const addElementSchema=z.object({
    spaceId:z.string(),
    elementId:z.string(),
    x:z.number(),
    y:z.number(),
})


export const updateElementSchema=z.object({
    imageUrl:z.string()
})

export const DeleteElementSchema=z.object({
    id:z.string()
})

export const createavatartSchema=z.object({
    name:z.string(),
    imageUrl:z.string()
})

export const createmapSchema=z.object({
    thumbnail:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name:z.string(),
    defaultElements:z.array(z.object({
        elementid:z.string(),
        x:z.number(),
        y:z.number()
    }))
})



declare  global {
      namespace Express {
         export interface Request {
            role? :"Admin " | "User";
            userId?:string
         }
      }
}