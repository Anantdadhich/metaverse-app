import {  Router } from "express";
import { usermiddleware } from "../../middleware/user";
import { CreateSpaceSchema } from "../../types/types";
import client from "@repo/db"

export const spacerouter=Router()

spacerouter.post("/",usermiddleware,async(req,res)=>{
  console.log("endpoint")

  const parsedData=CreateSpaceSchema.safeParse(req.body);

  if(!parsedData.success){
     console.log(JSON.stringify(parsedData))
     res.status(400).json({messgae:"validation failed"})
       return 
    }

    if (!parsedData.data.mapId){
        const space=await client.space.create({
              data:{
                name:parsedData.data.name,
                width:parseInt(parsedData.data.dimensions.split("x")[0]),
                height:parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorid:req.userId!
              }
        })

        res.json({spaceid:space.id})
        return ;
    }
     const map=await client.map.findFirst({
        where:{
            id:parsedData.data.mapId
        },select:{
            mapelements:true,
            height:true,
            widht:true
        }
     })

     console.log("after")
     if(!map){
        res.status(400).json({messgae:"map not found"})


     }

     console.log(map?.mapelements.length);
})