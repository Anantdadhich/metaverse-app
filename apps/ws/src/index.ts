/*import { WebSocketServer } from "ws";
import { User } from "./User";

const wss=new WebSocketServer({port:3001})


wss.on("connection",function connection(ws) {
    console.log("user connected")
     let user=new User(ws)
    ws.on("error",console.error)

    ws.on("close",()=>{
        user?.destroy();
    })
})
    */


import { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", function connection(ws) {
  console.log("user connected");
  const user = new User(ws); // Create a new User instance for each connection
  ws.on("error", console.error);

  ws.on("close", () => {
    user?.destroy(); // Clean up user on disconnect
  });
});

console.log("WebSocket server running on ws://localhost:3001");