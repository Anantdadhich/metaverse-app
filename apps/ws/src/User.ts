import { WebSocket } from "ws";
import jwt ,{JwtPayload}  from "jsonwebtoken"
import { JWT_PASSWORD, OutgoingMessage } from "./data";
import client from "@repo/db/client"
import { RoomManager } from "./Roommanager";

  
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
                
              if(!token){
                     console.log("Token is missing ")
                     this.ws.close();
                     return 
              }

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
                
               RoomManager.getInstance().addUser(spaceId,this);
             this.send({
                type:"space-joined",
                payload:{
                    spawn:{
                        x:this.x,
                        y:this.y
                    },
                    users:RoomManager.getInstance().rooms.get(spaceId)?.filter(x=>x.id !== this.id).map((u)=> ({
                        id:u.id
                    })) ?? []
                }
             });

             console.log("join recieved 5");
             RoomManager.getInstance().brodcast({
                type:"user-joined",
                 payload:{
                    userId:this.userId,
                    x:this.x,
                    y:this.y
                 }
             },this,this.spaceId!)
                

             break;
             
         case "move": 
         const movex=parsedData.payload.x;
         const movey=parsedData.payload.y;
         
         
         const xDisplacement=Math.abs(this.x - movex);
         const yDispacement=Math.abs(this.y -movey)


         if( (xDisplacement ==1 && yDispacement==0) || (xDisplacement ==0 && yDispacement==1)) {
            this.x=movex;
            this.y=movey


            RoomManager.getInstance().brodcast({
                type:"movement",
                payload:{
                    x:this.x,
                    y:this.y
                }
            },this,this.spaceId!);
            return
         }


         this.send({
            type:"movement-rejected",
            payload:{
                x:this.x,
                y:this.y
            }
         })
           }
       })
    }
    destroy(){
    RoomManager.getInstance().brodcast({
          type:"user-left",
          payload:{
            userId:this.userId
          }
    },this,this.spaceId!);

    RoomManager.getInstance().removeuser(this,this.spaceId !);
}
send(payload:OutgoingMessage){
      this.ws.send(JSON.stringify(payload))
}
}
 
