import { NextFunction,Request,Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";
import { adminrouter } from "../router/v1/admin";
import { updateElementSchema } from "../types/types";



export const adminmiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["authorization"];
    const token=header?.split(" ")[1];

    if(!token){
        res.status(403).json({message:"unauthorized"})
        return 
    }


    try {
        const decoded=jwt.verify(token,JWT_PASSWORD) as {role:string,useId:string};

        if(decoded.role !== "Admin") {
            res.status(403).json({message:"unauuthori"})
            return
        }
         //@ts-ignore
        req.userId=decoded.useId
        next()

    }catch(e){
         res.status(403).json({message:"unauuthori"})
            return
    }
}

