import { WebSocket } from "ws";
import jwt ,{JwtPayload}  from "jsonwebtoken"
import { JWT_PASSWORD } from "./data";
import client from "@repo/db/client"

  
function getRandomString(length:number){
    const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result="";
    for(let i=0;i<length ;i++){
        result +=characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result;
}


export class User {
    public id:string;
    public userId?:string;
    private spaceId?:string;
    private x:number;
    private y:number;
    private ws:WebSocket;
    
    
    constructor (ws:WebSocket) {
        this.id=getRandomString(10);
        this.x=0;
        this.y=0;
        this.ws=ws;
        this.inithandlers()
        
    }

    inithandlers(){
       this.ws.on("message",async(data)=>{
          console.log(data);

          const parsedData=JSON.parse(data.toString());
           console.log(parsedData);

           switch(parsedData.type){
             case "join": 
              const spaceId=parsedData.payload.spaceId;
              const token=parsedData.payload.token;

              const userId=(jwt.verify(token,JWT_PASSWORD)as JwtPayload).userId 

              if(!userId){
                this.ws.close()
                return
              }
               
              console.log("joiin receiverdfd 2")

              
              this.userId=userId;
               
              const space=await client.space.findFirst({
                where:{
                    id:spaceId
                }
              })

               console.log("join recieved 3 ")

               if(!space){
                this.ws.close()
                return
               }

               console.log("join recieved 4 ")


               this.spaceId=spaceId;
                 
               
               this.x=Math.floor(Math.random() * space?.width)
               this.y=Math.floor(Math.random() *space?.height)
                  
               
           }
       })
    }
}