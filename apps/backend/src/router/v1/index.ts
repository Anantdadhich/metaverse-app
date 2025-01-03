import { Router } from "express";
import db from "@repo/db/src/index"
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";

  
export const router=Router();

router.post("/signup",async (req,res)=>{
   const email=req.query;
   const password=req.query;
    
   
   
   

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