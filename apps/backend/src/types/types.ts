import z from "zod"

export const signupschema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    type: z.enum(["user", "admin"]).default("user")
});

export const signinschema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const CreateSpaceSchema = z.object({
    name: z.string().min(1),
    // Allow either dimensions as a string OR width and height as numbers
    dimensions: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    mapId: z.string().optional()
  }).refine(data => {
    // Ensure either dimensions OR (width AND height) are provided
    return (data.dimensions !== undefined) || (data.width !== undefined && data.height !== undefined);
  }, {
    message: "Either dimensions or both width and height must be provided"
  });


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