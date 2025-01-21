import { Router } from "express";
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";
import { signupschema } from "../../types/types";
import { hash } from "../../scryptalgo";


  
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
   
  } catch (error) {
   
  }
   
   
   

});

router.post("/signin",(req,res)=>{
 

})

router.post("/user",(req,res)=>{ 
})


router.post("/avatar",(req,res)=>{

})

router.use("/user",userrouter);
router.use("/space",spacerouter);
router.use("/element",adminrouter);