import { Router } from "express";
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";
import { signinschema, signupschema } from "../../types/types";
import { compare, hash } from "../../scryptalgo";
import jwt from "jsonwebtoken"
import client from "@repo/db"
import { JWT_PASSWORD } from "../../config";

  
export const router=Router();

router.post("/signup",async (req,res)=>{
 
   const parseddata=signupschema.safeParse(req.body)

   if(!parseddata.success   ) {
       console.log("parse data incorrect") 
       res.status(400).json({message:"validation failed"}) 
       return  
   } 

const hashedpadssword=await hash(parseddata.data.password)


  try {
   const user =await client.user.create({
    data:{
      email:parseddata.data.username,
      password:hashedpadssword, 
      role:parseddata.data.type === "admin" ? "User" :"Admin"
    }
   })

   res.json({userId:user.id})
  } catch (error) {
     console.log("error ")
      console.log(error)
     
  }
   
   
   

});







router.post("/signin",async(req,res)=>{
   
  const parseddata=signinschema.safeParse(req.body);

  if(!parseddata.success){
    res.status(403).json({message:"validation failed "})
    return 
  } 

  try {
      const user=await client.user.findFirst({
        where:{
          email:parseddata.data.username
        }
      })


      if(!user) {
         res.status(403).json({message:"user not found "});
         return
      } 

      const isvalid =await compare(parseddata.data.password,user.password)

      

      if(!isvalid) {
         res.status(403).json({message:"user not valid  "});
         return
      } 

      const token=jwt.sign({
        userId:user.id,
        role:user.role,

      },JWT_PASSWORD)


      res.json({
        token
      })
  } catch (error) {
      res.status(400).json({messsage:"error "})
  }


})

router.post("/user",(req,res)=>{ 
})


router.post("/avatar",(req,res)=>{

})

router.use("/user",userrouter);
router.use("/space",spacerouter);
router.use("/element",adminrouter);