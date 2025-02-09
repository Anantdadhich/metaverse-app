import { WebSocketServer } from "ws";

const wss=new WebSocketServer({port:3000})


wss.on("connection",function connection(ws) {
    console.log("user connected")
    
    ws.on("error",console.error)

    ws.on("close",()=>{
        
    })
})