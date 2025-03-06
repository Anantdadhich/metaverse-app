/*import { Router } from "express";
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";
import { signinschema, signupschema } from "../../types/types";
import { compare, hash } from "../../scryptalgo";
import jwt from "jsonwebtoken"
import client from "@repo/db/client"
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

router.post("/elements",async (req,res)=>{ 
const elements=await client.element.findMany()

res.json({elements:elements.map(e => ({
    id:e.id,
    imageUrl:e.imageUrl,
    heigth:e.height,
    width:e.width,
    static:e.static
}))})

})


router.post("/avatar",async(req,res)=>{
   const avatars=await client.avatar.findMany();
   
    res.json({
      avatars: avatars.map(e =>({
        id:e.id,
        imageUrl:e.imageUrl,
        name:e.name
      }))
    })


})

router.use("/user",userrouter);
router.use("/space",spacerouter);
router.use("/element",adminrouter);
*/
import { Router } from "express";
import { userrouter } from "./user";
import { spacerouter } from "./space";
import { adminrouter } from "./admin";
import { signinschema, signupschema } from "../../types/types";
import { compare, hash } from "../../scryptalgo";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
  const parseddata = signupschema.safeParse(req.body);

  if (!parseddata.success) {
    res.status(400).json({ message: "validation failed" });
    return
  }

  const hashedpassword = await hash(parseddata.data.password);

  try {
    const user = await client.user.create({
      data: {
        email: parseddata.data.username,
        password: hashedpassword,
        role: parseddata.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({ userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const parseddata = signinschema.safeParse(req.body);

  if (!parseddata.success) {
    res.status(403).json({ message: "validation failed" });
     return
  }

  try {
    const user = await client.user.findFirst({
      where: { email: parseddata.data.username },
    });

    if (!user) {
   res.status(403).json({ message: "user not found" });
       return
  }

    const isvalid = await compare(parseddata.data.password, user.password);

    if (!isvalid) {
   res.status(403).json({ message: "invalid credentials" });
       return
  }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_PASSWORD
    );
    res.json({ token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/elements", async (req, res) => {
  try {
    const elements = await client.element.findMany();
    res.json({
      elements: elements.map((e) => ({
        id: e.id,
        imageUrl: e.imageUrl,
        height: e.height,
        width: e.width,
        static: e.static,
      })),
    });
  } catch (error) {
    console.error("Elements fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/avatar", async (req, res) => {
  try {
    const avatars = await client.avatar.findMany();
    res.json({
      avatars: avatars.map((e) => ({
        id: e.id,
        imageUrl: e.imageUrl,
        name: e.name,
      })),
    });
  } catch (error) {
    console.error("Avatar fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.use("/user", userrouter);
router.use("/space", spacerouter);
router.use("/element", adminrouter);