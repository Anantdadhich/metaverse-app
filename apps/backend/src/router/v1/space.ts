import {  Router } from "express";
import { usermiddleware } from "../../middleware/user";
import { addElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types/types";
import client from "@repo/db/client"

export const spacerouter=Router()

spacerouter.post("/",usermiddleware,async(req,res)=>{
  console.log("endpoint", req.body);

  const parsedData=CreateSpaceSchema.safeParse(req.body);

  if(!parsedData.success){
     console.log(JSON.stringify(parsedData))
     res.status(400).json({message:"validation failed"})
     return 
  }

  if (!parsedData.data.mapId){
    // Handle case where width and height are sent directly
    let width = 20; // Default values
    let height = 15;
    
    if (parsedData.data.width && parsedData.data.height) {
      // If width and height are directly provided in the request
      width = parsedData.data.width;
      height = parsedData.data.height;
    } else if (parsedData.data.dimensions) {
      // If dimensions string is provided
      const dimensions = parsedData.data.dimensions.split("x");
      width = parseInt(dimensions[0]) || 20;
      height = parseInt(dimensions[1]) || 15;
    }

    try {
      const space=await client.space.create({
        data:{
          name:parsedData.data.name,
          width: width,
          height: height,
          creatorId:req.userId!
        }
      });

      res.json({
        spaceId: space.id,
        space: space  // Include both formats for compatibility
      });
    } catch (error) {
      console.error("Error creating space:", error);
      res.status(500).json({message:"Failed to create space"});
    }
    return;
  }
  
  // Rest of your existing code for handling mapId case...
});

spacerouter.delete("/element",usermiddleware,async (req,res)=>{
      const parsedData=DeleteElementSchema.safeParse(req.body)
     
       if(!parsedData.success){
     console.log(JSON.stringify(parsedData))
     res.status(400).json({messgae:"validation failed"})
       return 
    }


      const spaceElement=await client.spaceElement.findFirst({
        where:{
          id:parsedData.data.id
        },include:{
          space:true
        }
      })

      console.log(spaceElement?.space)
      
      if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !==req.userId){
        res.status(403).json({message:"unauth"})
        return 
      }
   

      await client.spaceElement.delete({
        where:{
          id:parsedData.data.id
        }
      })
       
      res.json({message:"Element Deleted"})
})

spacerouter.delete("/:spaceId",usermiddleware,async (req,res)=>{
     const space=await client.space.findUnique({
      where:{
        id:req.params.spaceId
      },select:{
        creatorId:true
      }
     })

     if(!space){
      res.status(400).json({message:"Space not found"})
      return 
     }
       
     if(space.creatorId !==req.userId){
        res.status(403).json({message:"unauth"})
        return 
     }

     await client.space.delete({
      where:{
        id:req.params.spaceId
      }
     })
   
     res.json({message:"Space Deleted"})

})


spacerouter.get("/all",usermiddleware,async (req,res)=>{
    const spaces=await client.space.findMany({
      where:{
     
        creatorId:req.userId!
      }
    })

    res.json({
      spaces:spaces.map(s => ({
         id:s.id,
         name:s.name,
         thumbnail:s.thumbnail,
         dimensions:`${s.width}*${s.height}`,
      }))
    })


})

spacerouter.post("/element",usermiddleware,async (req,res)=> {
        const parsedData=addElementSchema.safeParse(req.body)

        if (!parsedData.success) {
          res.status(400).json({message:"valid failed"})
          return
                }

                const space=await client.space.findUnique({
                  where:{
                    id:parsedData.data.spaceId,
                
                    creatorId:req.userId!
                  },select:{
                    width:true,
                    height:true 
                  }
                })

         if(!space){
          res.status(400).json({message:"space not found"})
          return  
         }


           if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!){
            res.status(400).json({message:"Space not found "})
            return 
           }    
           
           await client.spaceElement.create({
            data:{
              spaceId:req.body.spaceId,
              elementId:req.body.elementId,
              x:req.body.x,
              y:req.body.y
            }
           })


           res.json({message:"Element Added"})
})

/*
spacerouter.get("/:spaceId", async (req,res)=>{
    const space =await client.space.findUnique({
      where:{
        id:req.params.spaceId
      },include:{
        elements:{
          include:{
            element:true
          }
        }
      }
    })


    if(!space) {
      res.status(400).json({message:"space not found"})
     return  
    }


    res.json({
       "dimensions":`${space.width} * ${space.height}`,
       elements:space.elements.map(e => ({
          id:e.id ,
          elements:{
            id:e.element.id,
            imageUrl:e.element.imageUrl,
             width:e.element.width,
             height:e.element.height,
             static:e.element.static
          },
          x:e.x,
          y:e.y
       })),
    })
})


*/
spacerouter.get("/:spaceId", async (req,res)=>{
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId
      },
      include: {
        elements: {
          include: {
            element: true
          }
        }
      }
    });

    if (!space) {
      res.status(404).json({message: "Space not found"});
      return;
    }

    // Format the response in a more client-friendly way
    res.json({
      id: space.id,
      name: space.name,
      dimensions: `${space.width}*${space.height}`,
      width: space.width,
      height: space.height,
      creatorId: space.creatorId,
      elements: space.elements.map(e => ({
        id: e.id,
        x: e.x,
        y: e.y,
        elementId: e.elementId,
        elements: {
          id: e.element.id,
          imageUrl: e.element.imageUrl,
          width: e.element.width,
          height: e.element.height,
          static: e.element.static
        }
      }))
    });
  } catch (error) {
    console.error("Error fetching space:", error);
    res.status(500).json({message: "Server error"});
  }
});