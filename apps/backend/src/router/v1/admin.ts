import { Router } from "express";
import { createavatartSchema, createElementSchema, createmapSchema, updateElementSchema } from "../../types/types";
import client from "@repo/db/client"

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


adminrouter.put("/element/:elementId",(req,res)=>{
     const parsedData=updateElementSchema.safeParse(req.body);
    if (!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }


    client.element.update({
        where:{
            id:req.params.elementId
        },data:{
            imageUrl:parsedData.data.imageUrl
        }
    })

    res.json({message:"Element update"})

})


adminrouter.post("/avatar",async (req,res)=>{
    const parsedData=createavatartSchema.safeParse(req.body);

        if (!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }


    const avatar=await client.avatar.create({
        data:{
            name:parsedData.data.name,
            imageUrl:parsedData.data.imageUrl
        }
    })

    res.json({avatarId:avatar.id})
})


adminrouter.post("/map",async (req,res)=>{
    const parsedData=createmapSchema.safeParse(req.body);
    
    
        if (!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }


     const map=await client.map.create({
        data:{
            name:parsedData.data.name,
            width:parseInt(parsedData.data.dimensions),
            height:parseInt(parsedData.data.dimensions),
            thumbnail:parsedData.data.thumbnail,
            mapelements:{
                create:parsedData.data.defaultElements.map(m => ({
                    elementId:m.elementid,
                    x:m.x,
                    y:m.y
                }))
            }

            
        }
     })
   

     res.json({
        id:map.id
     })

})
 