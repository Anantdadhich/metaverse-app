import { Router } from "express";
import { usermiddleware } from "../../middleware/user";
import { MetaDataSchema } from "../../types/types";
import client from "@repo/db"

export const userrouter=Router()

userrouter.post("/metadata",usermiddleware,async (req,res)=>{
    const parsedData=MetaDataSchema.safeParse(req.body);
    
    if (!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }


    try {
        await client.user.update({
            where:{
                //@ts-ignore
               id:req.userId
            },data:{
                avatarId:parsedData.data.avatarId
            }
        }) 

        res.json({message:"metadata required"})
    } catch (error) {
        console.log("error ");
        res.status(400).json({message:"internal server erorr "})
    }
})