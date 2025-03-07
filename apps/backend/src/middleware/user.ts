import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";

export const usermiddleware=(req:Request,res:Response,next:NextFunction) =>  {
       const header=req.headers["authorization"]

       const  token=header?.split(" ")[1]

       console.log(req.route.path) 
       console.log(token)

       if (!token) {
          res.status(403).json({message:"unauth"})
          return 
       }

       try {
         const decoded=jwt.verify(token,JWT_PASSWORD) as {role:string,userId:string}
         
         req.userId=decoded.userId
         next()
       } catch (error) {
          res.status(403).json({message:"unauth"})
          return 
       }
}


