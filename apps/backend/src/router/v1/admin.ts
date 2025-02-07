import { Router } from "express";
import { createElementSchema } from "../../types/types";
import client from "@repo/db"

export const adminrouter=Router()


adminrouter.post("/element" ,async (req,res)=>{
    const parsedData=createElementSchema.safeParse(req.body);

    if (!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }

    const element=await client.element.create({
        data:{
            width:parsedData.data.width,
            height:parsedData.data.height,
            static:parsedData.data.static,
            imageUrl:parsedData.data.imageurl
        }
    })

    res.json({
        id:element.id
    })
})