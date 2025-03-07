/*import { useEffect, useRef, useState } from "react"




export const Room =() =>{

    const [currentUser,setcurrentUser]=useState<any>({});
    const [users,setUsers]=useState(new Map());

    const wsRef=useRef<any>(null);

    const canavsRef=useRef<any>(null);
    const [params,setParams]=useState({token:" ",spaceId:" "});
    
    

      
    //websocket initalize   
    useEffect(()=>{
        const urlParams=new URLSearchParams(window.location.search);
        const token=urlParams.get('token') || '';
        const spaceId=urlParams.get('spaceId') || '';
        setParams({token,spaceId})

        wsRef.current=new WebSocket('ws://localhost:3001');
       
        wsRef.current.onopen =() =>{
            wsRef.current.send(JSON.stringify({
                type:'join',
                payload:{
                    spaceId,
                    token
                }
            }))
        };

        wsRef.current.onmessage=(event:any) =>{
            const message=JSON.parse(event.data);
            handleWebSocketMessage(message);
        
        }
       
        return () =>{
            if (wsRef.current){
                wsRef.current.close();
            }
        }
    },[])

    const handleWebSocketMessage=(message:any)=>{
       
        switch (message.type){
            case 'space-joined':
               console.log("Set");
               console.log({
                x:message.payload.spawn.x,
                y:message.payload.spawn.y,
                userId:message.payload.userId
               })

            setcurrentUser({
                x:message.payload.spawn.x,
                y:message.payload.spawn.y,
                userId:message.payload.userId  
            });


            const userMap=new Map();
            message.payload.users.forEach((user:any)=>{
                userMap.set(user.userId,user);
            });

            setUsers(userMap);
            break;

          case 'user-joined' :
            setUsers(prev => {
                const newusers=new Map(prev);
                newusers.set(message.payload.userId,{
                      x:message.payload.x,
                      y:message.payload.y,
                      userId:message.payload.userId
                });


                return newusers

            });
            break;

            case 'movement':
                setUsers(prev =>{
                    const newUsers=new Map(prev);
                    const user=newUsers.get(message.payload.userId)
                    if(user){
                        user.x=message.payload.x;
                        user.y=message.payload.y;

                        newUsers.set(message.payload.userId,user);


                    }
                    return newUsers
                })
                break; 

                case 'movement': 
                setUsers(prev  =>  {
                      const newusers=new Map(prev);
                       const user=newusers.get(message.payload.userId) ;
                       if (user) {
                        user.x=message.payload.x;
                        user.y=message.payload.y;
                        newusers.set(message.payload.userId,user)
                       }

                      return newusers
                }) ;
                break;
                case 'movement-rejected':
                    setcurrentUser((prev:any) => ({
                        ...prev,
                        x:message.payload.x ,
                        y:message.payload.y
                    }));
                    break;

                    case 'user-left' : 
                    setUsers(prev => {
                        const newusers=new Map(prev);
                        newusers.delete(message.payload.userId);
                        return  newusers 
                    });
                    break;


                

        }
    } 


    const handleMove=(newX:any ,newY:any )=>{
           if(!currentUser) return  

           wsRef.current.send(JSON.stringify({
            type:"move",
            payload:{
                x:newX,
                y:newY,
                userId:currentUser.userId
            
            }
           })) ;
    } ;

    useEffect(()=>{
        console.log("render") 
        const canvas=canavsRef.current; 
        if(!canvas) return
        console.log("below render") 

        const ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height); 


        ctx.strokeStyle='#eee' 

        for (let i=0;i<canvas.width ;i +=50){
            ctx.beginPath();
            ctx.moveTo(i,0);
            ctx.lineTo(canvas.width,i);
            ctx.stroke() ;
        }

        console.log("before current ") 
        console.log(currentUser) 

        if(currentUser && currentUser.x) {
            console.log("draw myse")
            console.log(currentUser) 

            ctx.beginPath() ;
            ctx.fillStyle='#FF6B6B';
            ctx.arc(currentUser.x* 50 ,currentUser.y*50 ,20,0, Math.PI *2) ;
            ctx.fill();
            ctx.fillStyle='#000';
            ctx.font='14px Arial';
            ctx.textAlign='center';
            ctx.fillText('You',currentUser.x *50 ,currentUser.y * 50 + 40);
        }


        users.forEach(user =>{
            if(!user.x) {
                return
            }
           console.log("drawing other user")
    console.log(user)
      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
      ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);

        })
    },[currentUser,users])

  const handleKeyDown=(e:any) =>{
    if(!currentUser) return  

    const {x,y}=currentUser;  
    switch (e.key) {
        case 'ArrowUp':
             handleMove(x,y-1);
             break;
         case 'ArrowDown' :
            handleMove(x,y+1)  ;
            break;
        case 'ArrowLeft' : 
            handleMove(x-1,y);
            break; 
            case 'ArrowRight' :
                handleMove(x+1,y) ;
                break;     
    }

  }; 


    return (
        <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
           <h1 className="text-2xl font-bold mb-4">Space </h1>

               <div className="mb-4">
                <p className="text-sm text-gray-800">Token {params.token}</p>
                <p className="text-sm text-gray-800">space id {params.spaceId}</p> 
                <p className="text-sm text-gray-800">connected user {users.size + (currentUser ? 1 : 0)} </p>
                </div>     
                <div>
                    <canvas
                    ref={canavsRef}
                    width={2000}
                    height={2000} 
                    className="bg-white"
                    >

                    </canvas>
                    <p className="text-sm text-gray-800">arrow key to move the user </p>
                    </div>   
        </div>
    )
}

*/
/*
import { useEffect, useRef, useState, useCallback } from "react";
import { User } from "../types";
import { useWebSocket } from "../hooks/useWebsocket";

export const Room = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentUserRef = useRef<User | null>(null);
  const usersRef = useRef<{ [userId: string]: User }>({});
  const [loadingState, setLoadingState] = useState<string>("connecting");
  const [roomControls, setRoomControls] = useState({
    grid: true,
    smoothMovement: true,
    showUsernames: true,
  });

  // Extract token and spaceId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || "demo-token";
  const spaceId = urlParams.get("spaceId") || "main-hall";

  const { send } = useWebSocket("ws://localhost:3001", (message) => {
    console.log("Received WebSocket message:", message);
    switch (message.type) {
      case "space-joined":
        setLoadingState("connected");
        currentUserRef.current = {
          id: message.payload.userId || "current-user",
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          targetX: message.payload.spawn.x,
          targetY: message.payload.spawn.y,
        };
        usersRef.current = {};
        message.payload.users.forEach((user: any) => {
          usersRef.current[user.id] = {
            id: user.id,
            x: user.x,
            y: user.y,
            targetX: user.x,
            targetY: user.y,
          };
        });
        console.log("Current user set:", currentUserRef.current);
        console.log("Other users set:", usersRef.current);
        break;
      case "user-joined":
        usersRef.current[message.payload.id] = {
          id: message.payload.id,
          x: message.payload.x,
          y: message.payload.y,
          targetX: message.payload.x,
          targetY: message.payload.y,
        };
        console.log("User joined:", usersRef.current[message.payload.id]);
        break;
      case "movement":
        if (usersRef.current[message.payload.id]) {
          usersRef.current[message.payload.id].targetX = message.payload.x;
          usersRef.current[message.payload.id].targetY = message.payload.y;
          console.log("User moved:", usersRef.current[message.payload.id]);
        }
        break;
      case "movement-rejected":
        if (currentUserRef.current) {
          currentUserRef.current.targetX = message.payload.x;
          currentUserRef.current.targetY = message.payload.y;
          console.log("Movement rejected, current user:", currentUserRef.current);
        }
        break;
      case "user-left":
        delete usersRef.current[message.payload.id];
        console.log("User left, remaining users:", usersRef.current);
        break;
    }
  });

  // For demo purposes, if no WebSocket connection, create demo users
  useEffect(() => {
    if (loadingState === "connecting") {
      // Create a timeout to simulate connection
      const timeout = setTimeout(() => {
        if (loadingState === "connecting") {
          setLoadingState("demo-mode");
          // Set up some demo users
          currentUserRef.current = {
            id: "user1",
            x: 8,
            y: 6,
            targetX: 8,
            targetY: 6,
          };
          usersRef.current = {
            user2: {
              id: "user2",
              x: 10,
              y: 4,
              targetX: 10,
              targetY: 4,
            },
            user3: {
              id: "user3",
              x: 5,
              y: 8,
              targetX: 5,
              targetY: 8,
            },
          };
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [loadingState]);

  // Send join message on mount
  useEffect(() => {
    if (token && spaceId && loadingState === "connecting") {
      send({
        type: "join",
        payload: { spaceId, token },
      });
    } else if (!token || !spaceId) {
      console.error("Missing token or spaceId in URL params");
    }
  }, [send, token, spaceId, loadingState]);

  // Handle canvas click for movement
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentUserRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    const scale = 50; // Grid size
    
    // Calculate grid position
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    
    // Update local state immediately for responsive feel
    currentUserRef.current.targetX = x;
    currentUserRef.current.targetY = y;
    
    // In demo mode, don't send WebSocket messages
    if (loadingState !== "demo-mode") {
      send({
        type: "move",
        payload: { x, y },
      });
    }
  }, [loadingState, send]);

  // Canvas rendering and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 50; // Grid size
    canvas.width = 800;
    canvas.height = 600;

    const animate = () => {
      // Update positions with easing if smooth movement is enabled
      if (currentUserRef.current) {
        const user = currentUserRef.current;
        if (roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }
      
      for (const userId in usersRef.current) {
        const user = usersRef.current[userId];
        if (roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }

      // Clear canvas and draw background
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid if enabled
      if (roomControls.grid) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        for (let i = 0; i <= canvas.width; i += scale) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= canvas.height; i += scale) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
      }

      // Draw some environment elements
      ctx.fillStyle = "#E1F5FE";
      ctx.fillRect(50, 50, 200, 150); // Meeting room area
      ctx.fillStyle = "#E8F5E9";
      ctx.fillRect(350, 300, 250, 200); // Lounge area
      
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Meeting Room", 150, 125);
      ctx.fillText("Lounge", 475, 400);
      
      // Draw some furniture
      // Table in meeting room
      ctx.fillStyle = "#795548";
      ctx.fillRect(100, 100, 100, 50);
      
      // Couches in lounge
      ctx.fillStyle = "#9E9E9E";
      ctx.fillRect(380, 350, 50, 20);
      ctx.fillRect(450, 350, 50, 20);
      ctx.fillRect(520, 350, 50, 20);
      
      // Center table in lounge
      ctx.fillStyle = "#795548";
      ctx.beginPath();
      ctx.arc(475, 400, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw other users
      for (const userId in usersRef.current) {
        const { x, y, id } = usersRef.current[userId];
        ctx.beginPath();
        ctx.fillStyle = "#4ECDC4";
        ctx.arc(x * scale + scale/2, y * scale + scale/2, 20, 0, Math.PI * 2);
        ctx.fill();
        
        if (roomControls.showUsernames) {
          ctx.fillStyle = "#000";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`User ${id.slice(0, 4)}`, x * scale + scale/2, y * scale + scale/2 + 40);
        }
      }

      // Draw current user
      if (currentUserRef.current) {
        const { x, y } = currentUserRef.current;
        ctx.beginPath();
        ctx.fillStyle = "#FF6B6B";
        ctx.arc(x * scale + scale/2, y * scale + scale/2, 20, 0, Math.PI * 2);
        ctx.fill();
        
        if (roomControls.showUsernames) {
          ctx.fillStyle = "#000";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText("You", x * scale + scale/2, y * scale + scale/2 + 40);
        }
      }

      requestAnimationFrame(animate);
    };

    // Handle keyboard movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUserRef.current) return;
      const { x, y } = currentUserRef.current;
      let newX = x;
      let newY = y;
      
      switch (e.key) {
        case "ArrowUp":
          newY -= 1;
          break;
        case "ArrowDown":
          newY += 1;
          break;
        case "ArrowLeft":
          newX -= 1;
          break;
        case "ArrowRight":
          newX += 1;
          break;
      }
      
      if (newX !== x || newY !== y) {
        currentUserRef.current.targetX = newX;
        currentUserRef.current.targetY = newY;
        
        if (loadingState !== "demo-mode") {
          send({
            type: "move",
            payload: { x: newX, y: newY },
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [send, loadingState, roomControls]);

  // UI controls for the virtual space
  const toggleControl = (control: keyof typeof roomControls) => {
    setRoomControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {loadingState === "connecting" ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to virtual space...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <canvas
              ref={canvasRef}
              className="bg-white shadow-md rounded-lg cursor-pointer"
              onClick={handleCanvasClick}
            />
            <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.grid}
                    onChange={() => toggleControl('grid')}
                    className="rounded text-indigo-500"
                  />
                  <span>Show Grid</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.smoothMovement}
                    onChange={() => toggleControl('smoothMovement')}
                    className="rounded text-indigo-500"
                  />
                  <span>Smooth Movement</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.showUsernames}
                    onChange={() => toggleControl('showUsernames')}
                    className="rounded text-indigo-500"
                  />
                  <span>Show Usernames</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-600">
            <p>Use arrow keys to move or click on the grid</p>
            {loadingState === "demo-mode" && (
              <p className="mt-2 text-xs text-amber-600">Running in demo mode. No WebSocket connection.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};



import { useEffect, useRef, useState, useCallback } from "react";
import { User } from "../types";
import { useWebSocket } from "../hooks/useWebsocket";

// Define interaction zones and objects
interface InteractionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "meeting" | "lounge" | "desk" | "whiteboard";
  name: string;
}

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "table" | "chair" | "couch" | "plant" | "tv" | "whiteboard" | "storage";
  color: string;
  rotation?: number;
}

export const Room = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentUserRef = useRef<User | null>(null);
  const usersRef = useRef<{ [userId: string]: User }>({});
  const [loadingState, setLoadingState] = useState<string>("connecting");
  const [activeZone, setActiveZone] = useState<InteractionZone | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [roomControls, setRoomControls] = useState({
    grid: false,
    smoothMovement: true,
    showUsernames: true,
    showZoneLabels: true,
    minimap: true,
  });

  // Extract token and spaceId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || "demo-token";
  const spaceId = urlParams.get("spaceId") || "main-hall";

  // Define room layout - zones and objects
  const interactionZones: InteractionZone[] = [
    { id: "meeting-room-1", x: 1, y: 1, width: 8, height: 6, type: "meeting", name: "Meeting Room A" },
    { id: "meeting-room-2", x: 10, y: 1, width: 8, height: 6, type: "meeting", name: "Meeting Room B" },
    { id: "lounge-area", x: 1, y: 8, width: 8, height: 6, type: "lounge", name: "Lounge" },
    { id: "open-space", x: 10, y: 8, width: 14, height: 10, type: "desk", name: "Open Space" },
    { id: "whiteboard-zone", x: 25, y: 1, width: 8, height: 6, type: "whiteboard", name: "Whiteboard Area" },
  ];

  const gameObjects: GameObject[] = [
    // Meeting Room A Tables and Chairs
    { id: "table-1", x: 3, y: 3, width: 3, height: 2, type: "table", color: "#8D6E63" },
    { id: "chair-1", x: 2, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-2", x: 4, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-3", x: 6, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-4", x: 2, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-5", x: 4, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-6", x: 6, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },

    // Meeting Room B Tables and Chairs
    { id: "table-2", x: 12, y: 3, width: 3, height: 2, type: "table", color: "#8D6E63" },
    { id: "chair-7", x: 11, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-8", x: 13, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-9", x: 15, y: 2, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-10", x: 11, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-11", x: 13, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },
    { id: "chair-12", x: 15, y: 5, width: 1, height: 1, type: "chair", color: "#26A69A" },

    // Lounge Area Furniture
    { id: "couch-1", x: 2, y: 9, width: 3, height: 1, type: "couch", color: "#5D4037" },
    { id: "couch-2", x: 2, y: 12, width: 3, height: 1, type: "couch", color: "#5D4037" },
    { id: "table-3", x: 3, y: 10.5, width: 1.5, height: 1, type: "table", color: "#A1887F" },
    { id: "plant-1", x: 6, y: 8.5, width: 1, height: 1, type: "plant", color: "#66BB6A" },
    { id: "tv", x: 7, y: 9, width: 1, height: 2, type: "tv", color: "#424242" },

    // Open Space Area
    { id: "desk-1", x: 12, y: 10, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "desk-2", x: 12, y: 12, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "desk-3", x: 12, y: 14, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "desk-4", x: 18, y: 10, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "desk-5", x: 18, y: 12, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "desk-6", x: 18, y: 14, width: 2, height: 1, type: "table", color: "#90A4AE" },
    { id: "chair-13", x: 11, y: 10, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-14", x: 11, y: 12, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-15", x: 11, y: 14, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-16", x: 20, y: 10, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-17", x: 20, y: 12, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-18", x: 20, y: 14, width: 1, height: 1, type: "chair", color: "#78909C" },

    // Whiteboard Area
    { id: "whiteboard", x: 27, y: 1.5, width: 4, height: 0.5, type: "whiteboard", color: "#ECEFF1" },
    { id: "chair-19", x: 26, y: 3, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-20", x: 28, y: 3, width: 1, height: 1, type: "chair", color: "#78909C" },
    { id: "chair-21", x: 30, y: 3, width: 1, height: 1, type: "chair", color: "#78909C" },

    // Plants and decorative elements
    { id: "plant-2", x: 20, y: 6, width: 1, height: 1, type: "plant", color: "#66BB6A" },
    { id: "plant-3", x: 25, y: 15, width: 1, height: 1, type: "plant", color: "#66BB6A" },
    { id: "storage", x: 1, y: 15, width: 2, height: 3, type: "storage", color: "#BDBDBD" },
  ];

  // Avatar colors for different users
  const avatarColors = [
    { id: "default", color: "#FF6B6B" }, // Red - current user
    { id: "blue", color: "#4ECDC4" },    // Teal - other users
    { id: "green", color: "#2ECC71" },
    { id: "purple", color: "#9B59B6" },
    { id: "orange", color: "#E67E22" },
  ];

  // WebSocket connection
  const { send, readyState } = useWebSocket("ws://localhost:3001", (message) => {
    console.log("Received WebSocket message:", message);

    switch (message.type) {
      case "space-joined":
        setLoadingState("connected");
        currentUserRef.current = {
          id: message.payload.userId,
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          targetX: message.payload.spawn.x,
          targetY: message.payload.spawn.y,
          name: message.payload.name || "You",
          avatarColor: message.payload.avatarColor || avatarColors[0].color,
        };

        // Clear existing users and add only connected users
        usersRef.current = {};
        message.payload.users.forEach((user: any) => {
          if (user.id !== message.payload.userId) {
            usersRef.current[user.id] = {
              id: user.id,
              x: user.x,
              y: user.y,
              targetX: user.x,
              targetY: user.y,
              name: user.name || `User ${user.id.slice(0, 4)}`,
              avatarColor: user.avatarColor || avatarColors[Math.floor(Math.random() * (avatarColors.length - 1)) + 1].color,
            };
          }
        });
        console.log("Current user set:", currentUserRef.current);
        console.log("Other users set:", usersRef.current);
        break;

      case "user-joined":
        if (currentUserRef.current && message.payload.id !== currentUserRef.current.id) {
          usersRef.current[message.payload.id] = {
            id: message.payload.id,
            x: message.payload.x,
            y: message.payload.y,
            targetX: message.payload.x,
            targetY: message.payload.y,
            name: message.payload.name || `User ${message.payload.id.slice(0, 4)}`,
            avatarColor: message.payload.avatarColor || avatarColors[Math.floor(Math.random() * (avatarColors.length - 1)) + 1].color,
          };
          console.log("User joined:", usersRef.current[message.payload.id]);
        }
        break;

      case "chat-message":
        setMessages((prev) => [
          ...prev,
          {
            user: message.payload.userId === currentUserRef.current?.id ? "You" : usersRef.current[message.payload.userId]?.name || "Unknown",
            text: message.payload.text,
          },
        ]);
        break;

      case "movement":
        if (usersRef.current[message.payload.id] && currentUserRef.current && message.payload.id !== currentUserRef.current.id) {
          usersRef.current[message.payload.id].targetX = message.payload.x;
          usersRef.current[message.payload.id].targetY = message.payload.y;
          console.log("User moved:", usersRef.current[message.payload.id]);
        }
        break;

      case "movement-rejected":
        if (currentUserRef.current) {
          currentUserRef.current.targetX = message.payload.x;
          currentUserRef.current.targetY = message.payload.y;
          console.log("Movement rejected, reverting to:", currentUserRef.current);
        }
        break;

      case "movement-accepted":
        if (currentUserRef.current) {
          console.log("Movement accepted at:", message.payload.x, message.payload.y);
        }
        break;

      case "user-left":
        if (usersRef.current[message.payload.id]) {
          delete usersRef.current[message.payload.id];
          console.log("User left, remaining users:", usersRef.current);
        }
        break;
    }
  });

  // Handle connection status
  useEffect(() => {
    if (readyState === WebSocket.CONNECTING) {
      setLoadingState("connecting");
    } else if (readyState === WebSocket.OPEN) {
      if (loadingState === "connecting" && token && spaceId) {
        send({ type: "join", payload: { spaceId, token } });
      }
    } else if (readyState === WebSocket.CLOSED) {
      setLoadingState("disconnected");
      currentUserRef.current = null;
      usersRef.current = {};
    }
  }, [readyState, loadingState, send, token, spaceId]);

  // Add timeout to detect connection issues
  useEffect(() => {
    if (readyState === WebSocket.OPEN && loadingState === "connecting") {
      const timeout = setTimeout(() => {
        if (!currentUserRef.current) {
          console.error("No space-joined message received after 5 seconds. Check server.");
          setLoadingState("disconnected");
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [readyState, loadingState]);

  // Check if user is in an interaction zone
  const checkInteractionZones = useCallback(() => {
    if (!currentUserRef.current) return;

    const { x, y } = currentUserRef.current;
    const zone = interactionZones.find(
      (zone) => x >= zone.x && x < zone.x + zone.width && y >= zone.y && y < zone.y + zone.height
    );
    //@ts-ignore
    setActiveZone(zone);
  }, [interactionZones]);

  // Check for collision with objects or other users
  const checkCollision = useCallback((x: number, y: number): boolean => {
    for (const obj of gameObjects) {
      if (["plant", "table", "tv", "storage", "whiteboard"].includes(obj.type)) {
        if (x >= obj.x && x < obj.x + obj.width && y >= obj.y && y < obj.y + obj.height) {
          return true;
        }
      }
    }

    for (const userId in usersRef.current) {
      const user = usersRef.current[userId];
      if (Math.abs(user.x - x) < 0.5 && Math.abs(user.y - y) < 0.5) {
        return true;
      }
    }

    if (x < 0 || y < 0 || x > 32 || y > 18) {
      return true;
    }

    return false;
  }, [gameObjects]);

  // Handle canvas click for movement
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !currentUserRef.current || isInteracting) return;

      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / 32;
      const x = Math.floor((e.clientX - rect.left) / scale);
      const y = Math.floor((e.clientY - rect.top) / scale);

      if (checkCollision(x, y)) return;

      currentUserRef.current.targetX = x;
      currentUserRef.current.targetY = y;

      if (readyState === WebSocket.OPEN) {
        send({ type: "move", payload: { x, y } });
      }
    },
    [readyState, send, checkCollision, isInteracting]
  );

  // Send chat message
  const sendChatMessage = useCallback(() => {
    if (!inputMessage.trim() || !currentUserRef.current) return;

    if (readyState === WebSocket.OPEN) {
      send({ type: "chat", payload: { text: inputMessage } });
    }

    setInputMessage("");
  }, [inputMessage, readyState, send]);

  // Handle interaction with active zone
  const handleInteraction = useCallback(() => {
    if (!activeZone) return;

    setIsInteracting(true);
    setShowChat(true);

    if (readyState === WebSocket.OPEN) {
      send({ type: "interact", payload: { zoneId: activeZone.id } });
    }
  }, [activeZone, readyState, send]);

  // Exit interaction
  const exitInteraction = useCallback(() => {
    setIsInteracting(false);
    setShowChat(false);

    if (activeZone && readyState === WebSocket.OPEN) {
      send({ type: "exit-interaction", payload: { zoneId: activeZone.id } });
    }
  }, [activeZone, readyState, send]);

  // Handle keyboard movement
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!currentUserRef.current || isInteracting) return;

      const { x, y } = currentUserRef.current;
      let newX = x;
      let newY = y;

      switch (e.key) {
        case "ArrowUp": newY -= 1; break;
        case "ArrowDown": newY += 1; break;
        case "ArrowLeft": newX -= 1; break;
        case "ArrowRight": newX += 1; break;
        case "Escape":
          if (isInteracting) exitInteraction();
          return;
        case "Enter":
          if (activeZone && !isInteracting) handleInteraction();
          return;
      }

      if (checkCollision(newX, newY)) return;

      currentUserRef.current.targetX = newX;
      currentUserRef.current.targetY = newY;

      if (readyState === WebSocket.OPEN) {
        send({ type: "move", payload: { x: newX, y: newY } });
      }
    },
    [checkCollision, isInteracting, readyState, send, activeZone, handleInteraction, exitInteraction]
  );

  // Canvas rendering and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1280; // 32 grid cells * 40 pixels
    canvas.height = 720; // 18 grid cells * 40 pixels
    const gridSize = canvas.width / 32;

    const drawAvatar = (x: number, y: number, avatarColor: string | undefined) => {
      const size = gridSize * 0.8;
      const centerX = x * gridSize + gridSize / 2;
      const centerY = y * gridSize + gridSize / 2;

      ctx.fillStyle = avatarColor || "#FF6B6B";
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, size / 3, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFD8B1";
      ctx.beginPath();
      ctx.arc(centerX, centerY - size / 3, size / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - size / 3 - size / 8, size / 3.5, size / 6, 0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${size / 6}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("3", centerX, centerY - size / 3 - size / 12);
      ctx.restore();
    };

    let animationFrameId: number;
    const animate = () => {
      // Only update user positions if connected
      if (currentUserRef.current && readyState === WebSocket.OPEN) {
        const user = currentUserRef.current;
        if (roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
          if (Math.abs(user.targetX - user.x) < 0.05) user.x = user.targetX;
          if (Math.abs(user.targetY - user.y) < 0.05) user.y = user.targetY;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }

      for (const userId in usersRef.current) {
        const user = usersRef.current[userId];
        if (readyState === WebSocket.OPEN && roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
          if (Math.abs(user.targetX - user.x) < 0.05) user.x = user.targetX;
          if (Math.abs(user.targetY - user.y) < 0.05) user.y = user.targetY;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }

      // Check interaction zones only if user exists
      if (currentUserRef.current) {
        checkInteractionZones();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#F5F5F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw interaction zones
      interactionZones.forEach((zone) => {
        let zoneColor;
        switch (zone.type) {
          case "meeting": zoneColor = "rgba(179, 229, 252, 0.5)"; break;
          case "lounge": zoneColor = "rgba(200, 230, 201, 0.5)"; break;
          case "desk": zoneColor = "rgba(255, 248, 225, 0.5)"; break;
          case "whiteboard": zoneColor = "rgba(225, 190, 231, 0.5)"; break;
          default: zoneColor = "rgba(224, 224, 224, 0.5)";
        }
        ctx.fillStyle = zoneColor;
        ctx.fillRect(zone.x * gridSize, zone.y * gridSize, zone.width * gridSize, zone.height * gridSize);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 2;
        ctx.strokeRect(zone.x * gridSize, zone.y * gridSize, zone.width * gridSize, zone.height * gridSize);
        if (roomControls.showZoneLabels) {
          ctx.fillStyle = "#424242";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText(zone.name, (zone.x + zone.width / 2) * gridSize, (zone.y + 0.7) * gridSize);
        }
      });

      // Draw grid if enabled
      if (roomControls.grid) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 32; i++) {
          ctx.beginPath();
          ctx.moveTo(i * gridSize, 0);
          ctx.lineTo(i * gridSize, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= 18; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * gridSize);
          ctx.lineTo(canvas.width, i * gridSize);
          ctx.stroke();
        }
      }

      // Draw all game objects
      gameObjects.forEach((obj) => {
        ctx.fillStyle = obj.color;
        switch (obj.type) {
          case "table":
            ctx.beginPath();
            ctx.roundRect(obj.x * gridSize, obj.y * gridSize, obj.width * gridSize, obj.height * gridSize, 8);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.beginPath();
            ctx.roundRect((obj.x + 0.1) * gridSize, (obj.y + 0.1) * gridSize, (obj.width - 0.2) * gridSize, (obj.height - 0.2) * gridSize, 6);
            ctx.fill();
            break;
          case "chair":
            ctx.beginPath();
            ctx.roundRect((obj.x + 0.1) * gridSize, (obj.y + 0.1) * gridSize, (obj.width - 0.2) * gridSize, (obj.height - 0.2) * gridSize, 5);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect((obj.x + 0.2) * gridSize, (obj.y + 0.2) * gridSize, (obj.width - 0.4) * gridSize, (obj.height - 0.6) * gridSize);
            break;
          case "couch":
            ctx.beginPath();
            ctx.roundRect(obj.x * gridSize, obj.y * gridSize, obj.width * gridSize, obj.height * gridSize, 10);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            for (let i = 0; i < obj.width; i++) {
              ctx.beginPath();
              ctx.roundRect((obj.x + i) * gridSize + 5, obj.y * gridSize + 5, gridSize - 10, obj.height * gridSize - 10, 5);
              ctx.fill();
            }
            break;
          case "plant":
            ctx.fillStyle = "#795548";
            ctx.beginPath();
            ctx.roundRect((obj.x + 0.2) * gridSize, (obj.y + 0.6) * gridSize, (obj.width - 0.4) * gridSize, (obj.height - 0.6) * gridSize, 5);
            ctx.fill();
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc((obj.x + obj.width / 2) * gridSize, (obj.y + 0.3) * gridSize, gridSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "tv":
            ctx.fillStyle = "#424242";
            ctx.fillRect((obj.x + 0.2) * gridSize, (obj.y + 0.8) * gridSize, (obj.width - 0.4) * gridSize, (obj.height - 0.8) * gridSize);
            ctx.fillStyle = "#212121";
            ctx.fillRect(obj.x * gridSize, obj.y * gridSize, obj.width * gridSize, (obj.height - 0.3) * gridSize);
            break;
          case "whiteboard":
            ctx.fillStyle = "#9E9E9E";
            ctx.fillRect(obj.x * gridSize, obj.y * gridSize, obj.width * gridSize, obj.height * gridSize);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect((obj.x + 0.05) * gridSize, (obj.y + 0.05) * gridSize, (obj.width - 0.1) * gridSize, (obj.height - 0.1) * gridSize);
            break;
          case "storage":
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x * gridSize, obj.y * gridSize, obj.width * gridSize, obj.height * gridSize);
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            for (let i = 0; i < obj.height; i++) {
              ctx.fillRect((obj.x + 0.1) * gridSize, (obj.y + i + 0.1) * gridSize, (obj.width - 0.2) * gridSize, 0.2 * gridSize);
            }
            break;
        }
      });

      // Draw users only if connected
      if (readyState === WebSocket.OPEN) {
        for (const userId in usersRef.current) {
          const user = usersRef.current[userId];
          drawAvatar(user.x, user.y, user.avatarColor);
          if (roomControls.showUsernames) {
            ctx.fillStyle = "#424242";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(user.name || `User ${user.id.slice(0, 4)}`, user.x * gridSize + gridSize / 2, (user.y + 1) * gridSize);
          }
        }

        if (currentUserRef.current) {
          drawAvatar(currentUserRef.current.x, currentUserRef.current.y, currentUserRef.current.avatarColor);
          if (roomControls.showUsernames) {
            ctx.fillStyle = "#424242";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(currentUserRef.current.name || "You", currentUserRef.current.x * gridSize + gridSize / 2, (currentUserRef.current.y + 1) * gridSize);
          }
        }
      }

      if (roomControls.minimap) {
        const minimapWidth = 200;
        const minimapHeight = 112.5;
        const minimapScale = minimapWidth / 32;
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(canvas.width - minimapWidth - 10, 10, minimapWidth, minimapHeight);
        interactionZones.forEach((zone) => {
          let zoneColor;
          switch (zone.type) {
            case "meeting": zoneColor = "rgba(179, 229, 252, 0.5)"; break;
            case "lounge": zoneColor = "rgba(200, 230, 201, 0.5)"; break;
            case "desk": zoneColor = "rgba(255, 248, 225, 0.5)"; break;
            case "whiteboard": zoneColor = "rgba(225, 190, 231, 0.5)"; break;
            default: zoneColor = "rgba(224, 224, 224, 0.5)";
          }
          ctx.fillStyle = zoneColor;
          ctx.fillRect(canvas.width - minimapWidth - 10 + zone.x * minimapScale, 10 + zone.y * minimapScale, zone.width * minimapScale, zone.height * minimapScale);
        });
        if (readyState === WebSocket.OPEN) {
          for (const userId in usersRef.current) {
            const user = usersRef.current[userId];
            ctx.fillStyle = user.avatarColor || "#FF6B6B";
            ctx.beginPath();
            ctx.arc(canvas.width - minimapWidth - 10 + user.x * minimapScale, 10 + user.y * minimapScale, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          if (currentUserRef.current) {
            const user = currentUserRef.current;
            ctx.fillStyle = user.avatarColor || "#FF6B6B";
            ctx.beginPath();
            ctx.arc(canvas.width - minimapWidth - 10 + user.x * minimapScale, 10 + user.y * minimapScale, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [roomControls, checkInteractionZones, readyState]);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center p-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Virtual Space: {spaceId}
      </h1>
      {loadingState === "connecting" && (
        <p className="text-gray-600">Connecting to server...</p>
      )}
      {loadingState === "disconnected" && (
        <p className="text-red-600">Disconnected. Attempting to reconnect...</p>
      )}
      {loadingState === "connected" && !currentUserRef.current && (
        <p className="text-gray-600">Failed to join space. Please refresh or check server.</p>
      )}
      <div className="relative w-full max-w-5xl h-[720px] overflow-auto rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="bg-white"
        />
        {activeZone && !isInteracting && (
          <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
            <p className="text-sm font-bold">{activeZone.name}</p>
            <p className="text-xs">Press Enter to interact</p>
          </div>
        )}
        {showChat && (
          <div className="absolute bottom-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Chat</h3>
            <div className="h-48 overflow-y-auto mb-2">
              {messages.map((msg, index) => (
                <p key={index} className="text-sm">
                  <span className="font-bold">{msg.user}:</span> {msg.text}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
            <button
              onClick={exitInteraction}
              className="mt-2 w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Exit Chat (Esc)
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roomControls.grid}
            onChange={(e) => setRoomControls((prev) => ({ ...prev, grid: e.target.checked }))}
          />
          Show Grid
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roomControls.smoothMovement}
            onChange={(e) => setRoomControls((prev) => ({ ...prev, smoothMovement: e.target.checked }))}
          />
          Smooth Movement
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roomControls.showUsernames}
            onChange={(e) => setRoomControls((prev) => ({ ...prev, showUsernames: e.target.checked }))}
          />
          Show Usernames
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roomControls.showZoneLabels}
            onChange={(e) => setRoomControls((prev) => ({ ...prev, showZoneLabels: e.target.checked }))}
          />
          Show Zone Labels
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roomControls.minimap}
            onChange={(e) => setRoomControls((prev) => ({ ...prev, minimap: e.target.checked }))}
          />
          Show Minimap
        </label>
      </div>
    </div>
  );
};

*/



import { useEffect, useRef, useState, useCallback } from "react";
import { User, GameObject, SpaceAsset } from "../types";
import { useWebSocket } from "../hooks/useWebsocket";

// Space asset definitions
const ASSETS: Record<string, SpaceAsset> = {
  desk: { width: 2, height: 1, color: "#8D6E63", name: "Desk" },
  roundTable: { width: 2, height: 2, color: "#795548", name: "Round Table", isRound: true },
  chair: { width: 1, height: 1, color: "#5D4037", name: "Chair", isRound: true },
  sofa: { width: 3, height: 1, color: "#3949AB", name: "Sofa" },
  plant: { width: 1, height: 1, color: "#388E3C", name: "Plant", isRound: true },
  whiteboard: { width: 3, height: 1, color: "#E0E0E0", name: "Whiteboard" },
  coffeeTable: { width: 2, height: 1, color: "#A1887F", name: "Coffee Table" },
  chill_zone: { width: 8, height: 6, color: "rgba(179, 229, 252, 0.3)", name: "Chill Zone", isZone: true },
  meeting_zone: { width: 7, height: 5, color: "rgba(200, 230, 201, 0.3)", name: "Meeting Zone", isZone: true },
  collaboration_zone: { width: 6, height: 6, color: "rgba(255, 236, 179, 0.3)", name: "Collaboration Zone", isZone: true },
  entrance_zone: { width: 4, height: 3, color: "rgba(225, 190, 231, 0.3)", name: "Entrance", isZone: true },
};

export const Room= () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentUserRef = useRef<User | null>(null);
  const usersRef = useRef<{ [userId: string]: User }>({});
  const [loadingState, setLoadingState] = useState<string>("connecting");
  const [spaceObjects, setSpaceObjects] = useState<GameObject[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [roomControls, setRoomControls] = useState({
    grid: true,
    smoothMovement: true,
    showUsernames: true,
    showZoneNames: true,
    viewMode: "2d",
  });

  // Extract token and spaceId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || "demo-token";
  const spaceId = urlParams.get("spaceId") || "main-hall";

  // Initialize space objects
  useEffect(() => {
    // Create a predefined space layout
    const objects: GameObject[] = [
      // Zones
      { type: "chill_zone", x: 2, y: 2, id: "zone1" },
      { type: "meeting_zone", x: 11, y: 2, id: "zone2" },
      { type: "collaboration_zone", x: 3, y: 10, id: "zone3" },
      { type: "entrance_zone", x: 12, y: 10, id: "zone4" },
      
      // Entrance area furniture
      { type: "sofa", x: 12, y: 11, id: "sofa1" },
      { type: "plant", x: 14, y: 10, id: "plant1" },
      
      // Meeting zone furniture
      { type: "roundTable", x: 13, y: 4, id: "table1" },
      { type: "chair", x: 12, y: 3, id: "chair1" },
      { type: "chair", x: 14, y: 3, id: "chair2" },
      { type: "chair", x: 12, y: 5, id: "chair3" },
      { type: "chair", x: 14, y: 5, id: "chair4" },
      { type: "whiteboard", x: 11, y: 1, id: "whiteboard1" },
      
      // Chill zone furniture
      { type: "sofa", x: 3, y: 3, id: "sofa2" },
      { type: "sofa", x: 3, y: 5, id: "sofa3" },
      { type: "coffeeTable", x: 5, y: 4, id: "coffeeTable1" },
      { type: "plant", x: 7, y: 2, id: "plant2" },
      
      // Collaboration zone furniture
      { type: "desk", x: 4, y: 11, id: "desk1" },
      { type: "desk", x: 4, y: 13, id: "desk2" },
      { type: "chair", x: 3, y: 11, id: "chair5" },
      { type: "chair", x: 3, y: 13, id: "chair6" },
      { type: "whiteboard", x: 7, y: 12, id: "whiteboard2" },
      { type: "plant", x: 7, y: 10, id: "plant3" },
    ];
    
    setSpaceObjects(objects);
  }, []);

  const { send } = useWebSocket("ws://localhost:3001", (message) => {
    console.log("Received WebSocket message:", message);
    switch (message.type) {
      case "space-joined":
        setLoadingState("connected");
        currentUserRef.current = {
          id: message.payload.userId || "current-user",
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          targetX: message.payload.spawn.x,
          targetY: message.payload.spawn.y,
          username: message.payload.username || "You",
          avatarColor: message.payload.avatarColor || getRandomColor(),
        };
        usersRef.current = {};
        message.payload.users.forEach((user: any) => {
          usersRef.current[user.id] = {
            id: user.id,
            x: user.x,
            y: user.y,
            targetX: user.x,
            targetY: user.y,
            username: user.username || `User ${user.id.slice(0, 4)}`,
            avatarColor: user.avatarColor || getRandomColor(),
          };
        });
        showNotification("Connected to virtual space!");
        break;
      case "user-joined":
        usersRef.current[message.payload.id] = {
          id: message.payload.id,
          x: message.payload.x,
          y: message.payload.y,
          targetX: message.payload.x,
          targetY: message.payload.y,
          username: message.payload.username || `User ${message.payload.id.slice(0, 4)}`,
          avatarColor: message.payload.avatarColor || getRandomColor(),
        };
        showNotification(`${usersRef.current[message.payload.id].username} joined`);
        break;
      case "movement":
        if (usersRef.current[message.payload.id]) {
          usersRef.current[message.payload.id].targetX = message.payload.x;
          usersRef.current[message.payload.id].targetY = message.payload.y;
        }
        break;
      case "movement-rejected":
        if (currentUserRef.current) {
          currentUserRef.current.targetX = message.payload.x;
          currentUserRef.current.targetY = message.payload.y;
          showNotification("Movement rejected: location is occupied");
        }
        break;
      case "user-left":
        if (usersRef.current[message.payload.id]) {
          const username = usersRef.current[message.payload.id].username;
          delete usersRef.current[message.payload.id];
          showNotification(`${username} left the space`);
        }
        break;
      case "interaction":
        showNotification(`${message.payload.username} is interacting with ${message.payload.objectId}`);
        break;
    }
  });

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // For demo purposes, if no WebSocket connection, create demo users
  useEffect(() => {
    if (loadingState === "connecting") {
      const timeout = setTimeout(() => {
        if (loadingState === "connecting") {
          setLoadingState("demo-mode");
          currentUserRef.current = {
            id: "user1",
            x: 13, 
            y: 11,
            targetX: 13,
            targetY: 11,
            username: "You",
            avatarColor: "#FF6B6B",
          };
          usersRef.current = {
            user2: {
              id: "user2",
              x: 13,
              y: 4,
              targetX: 13,
              targetY: 4,
              username: "Maya",
              avatarColor: "#4ECDC4",
            },
            user3: {
              id: "user3",
              x: 5,
              y: 4,
              targetX: 5,
              targetY: 4,
              username: "Alex",
              avatarColor: "#FFD166",
            },
            user4: {
              id: "user4",
              x: 4,
              y: 12,
              targetX: 4,
              targetY: 12,
              username: "Jordan",
              avatarColor: "#06D6A0",
            },
          };
          showNotification("Running in demo mode - No server connection");
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [loadingState]);

  // Send join message on mount
  useEffect(() => {
    if (token && spaceId && loadingState === "connecting") {
      send({
        type: "join",
        payload: { spaceId, token },
      });
    } else if (!token || !spaceId) {
      console.error("Missing token or spaceId in URL params");
    }
  }, [send, token, spaceId, loadingState]);

  // Check if a position is valid for movement
  const isValidPosition = useCallback((x: number, y: number): boolean => {
    // Check space boundaries
    if (x < 0 || y < 0 || x >= 18 || y >= 15) return false;
    
    // Check if position is occupied by furniture (non-zone objects)
    for (const obj of spaceObjects) {
      const asset = ASSETS[obj.type];
      if (asset && !asset.isZone) {
        const objX = obj.x;
        const objY = obj.y;
        const objWidth = asset.width;
        const objHeight = asset.height;
        
        if (x >= objX && x < objX + objWidth && y >= objY && y < objY + objHeight) {
          return false;
        }
      }
    }
    
    // Check if position is occupied by another user
    for (const userId in usersRef.current) {
      const user = usersRef.current[userId];
      if (Math.floor(user.x) === x && Math.floor(user.y) === y) {
        return false;
      }
    }
    
    return true;
  }, [spaceObjects]);

  // Handle canvas click for movement
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentUserRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    const scale = 40; // Grid size
    
    // Calculate grid position
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    
    // Check if the position is valid for movement
    if (!isValidPosition(x, y)) {
      // Check if clicking on an object to interact with it
      for (const obj of spaceObjects) {
        const asset = ASSETS[obj.type];
        if (
          x >= obj.x && 
          x < obj.x + asset.width && 
          y >= obj.y && 
          y < obj.y + asset.height
        ) {
          showNotification(`Interacting with ${asset.name}`);
          if (loadingState !== "demo-mode") {
            send({
              type: "interact",
              payload: { objectId: obj.id },
            });
          }
          return;
        }
      }
      
      showNotification("Cannot move there - position is occupied");
      return;
    }
    
    // Update local state immediately for responsive feel
    currentUserRef.current.targetX = x;
    currentUserRef.current.targetY = y;
    
    // In demo mode, don't send WebSocket messages
    if (loadingState !== "demo-mode") {
      send({
        type: "move",
        payload: { x, y },
      });
    }
  }, [loadingState, send, isValidPosition, spaceObjects]);

  // Get a random color for user avatars
  const getRandomColor = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2", "#073B4C", "#7B2CBF", "#F72585"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Find the zone a user is in
  const getUserZone = (x: number, y: number): string | null => {
    for (const obj of spaceObjects) {
      const asset = ASSETS[obj.type];
      if (asset && asset.isZone) {
        if (
          x >= obj.x && 
          x < obj.x + asset.width && 
          y >= obj.y && 
          y < obj.y + asset.height
        ) {
          return asset.name;
        }
      }
    }
    return null;
  };

  // Canvas rendering and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 40; // Grid size
    canvas.width = 720;
    canvas.height = 600;

    const drawUser = (user: User, isCurrentUser: boolean) => {
      const { x, y, username, avatarColor } = user;
      
      if (roomControls.viewMode === "2d") {
        // Draw user avatar
        ctx.beginPath();
        ctx.fillStyle = avatarColor;
        ctx.arc(x * scale + scale/2, y * scale + scale/2, scale/2 - 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw avatar border
        ctx.strokeStyle = isCurrentUser ? "#000" : "#555";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add user initials
        //@ts-ignore
        const initials = username.slice(0, 2).toUpperCase();
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initials, x * scale + scale/2, y * scale + scale/2);
      } else {
        // Draw 3D-ish user avatar (isometric view)
        ctx.beginPath();
        ctx.fillStyle = avatarColor;
        
        // Base circle (shadow)
        ctx.ellipse(x * scale + scale/2, y * scale + scale/2 + 5, scale/2 - 4, scale/4 - 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.fillStyle = avatarColor;
        ctx.ellipse(x * scale + scale/2, y * scale + scale/2 - 6, scale/2 - 6, scale/4 - 1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.fillStyle = avatarColor;
        ctx.arc(x * scale + scale/2, y * scale + scale/2 - 15, scale/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Outline
        if (isCurrentUser) {
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x * scale + scale/2, y * scale + scale/2 + 5, scale/2 - 4, scale/4 - 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Draw username if enabled
      if (roomControls.showUsernames) {
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        //@ts-ignore
        ctx.fillText(username, x * scale + scale/2, y * scale + scale/2 + 25);
      }
    };
    
    const drawObject = (obj: GameObject) => {
      const asset = ASSETS[obj.type];
      if (!asset) return;
      
      const x = obj.x * scale;
      const y = obj.y * scale;
      const width = asset.width * scale;
      const height = asset.height * scale;
      
      ctx.fillStyle = asset.color;
      
      if (asset.isZone) {
        // Draw zones as transparent rectangles
        ctx.fillRect(x, y, width, height);
        
        // Draw zone name if enabled
        if (roomControls.showZoneNames) {
          ctx.fillStyle = "#000";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText(asset.name, x + width/2, y + height/2);
        }
        
        // Draw zone border
        ctx.strokeStyle = asset.color.replace("0.3", "0.7");
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      } else if (asset.isRound) {
        if (roomControls.viewMode === "2d") {
          // Draw round objects
          ctx.beginPath();
          ctx.arc(x + width/2, y + height/2, Math.min(width, height)/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Add shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.beginPath();
          ctx.ellipse(x + width/2, y + height/2 + 3, Math.min(width, height)/2 - 2, Math.min(width, height)/4 - 1, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 3D-ish round objects
          // Shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.beginPath();
          ctx.ellipse(x + width/2, y + height/2 + 3, Math.min(width, height)/2 - 2, Math.min(width, height)/4 - 1, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Side
          ctx.fillStyle = darkenColor(asset.color, 20);
          ctx.beginPath();
          ctx.ellipse(x + width/2, y + height/2, Math.min(width, height)/2 - 2, Math.min(width, height)/4 - 1, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Top
          ctx.fillStyle = asset.color;
          ctx.beginPath();
          ctx.ellipse(x + width/2, y + height/2 - 5, Math.min(width, height)/2 - 2, Math.min(width, height)/4 - 1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        if (roomControls.viewMode === "2d") {
          // Draw rectangular objects
          ctx.fillRect(x, y, width, height);
          
          // Add shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.fillRect(x + 3, y + 3, width - 3, height - 3);
        } else {
          // 3D-ish rectangular objects
          // Shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.fillRect(x + 3, y + 3, width - 3, height - 3);
          
          // Side
          ctx.fillStyle = darkenColor(asset.color, 20);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y);
          ctx.lineTo(x + width, y + height);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x, y);
          ctx.fill();
          
          // Top
          ctx.fillStyle = asset.color;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y);
          ctx.lineTo(x + width - 5, y - 5);
          ctx.lineTo(x - 5, y - 5);
          ctx.lineTo(x, y);
          ctx.fill();
        }
      }
    };
    
    const darkenColor = (color: string, percent: number): string => {
      // Handle rgba colors
      if (color.startsWith("rgba")) {
        return color;
      }
      
      // Handle hex colors
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.floor(r * (100 - percent) / 100);
      g = Math.floor(g * (100 - percent) / 100);
      b = Math.floor(b * (100 - percent) / 100);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const animate = () => {
      // Update positions with easing if smooth movement is enabled
      if (currentUserRef.current) {
        const user = currentUserRef.current;
        if (roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }
      
      for (const userId in usersRef.current) {
        const user = usersRef.current[userId];
        if (roomControls.smoothMovement) {
          user.x += (user.targetX - user.x) * 0.15;
          user.y += (user.targetY - user.y) * 0.15;
        } else {
          user.x = user.targetX;
          user.y = user.targetY;
        }
      }

      // Clear canvas and draw background
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid if enabled
      if (roomControls.grid) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += scale) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= canvas.height; i += scale) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
      }

      // Draw zones first (background)
      spaceObjects
        .filter(obj => ASSETS[obj.type]?.isZone)
        .forEach(drawObject);
      
      // Draw non-zone objects
      spaceObjects
        .filter(obj => !ASSETS[obj.type]?.isZone)
        .forEach(drawObject);
      
      // Draw other users
      for (const userId in usersRef.current) {
        drawUser(usersRef.current[userId], false);
      }

      // Draw current user
      if (currentUserRef.current) {
        drawUser(currentUserRef.current, true);
      }

      requestAnimationFrame(animate);
    };

    // Handle keyboard movement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUserRef.current) return;
      const { targetX, targetY } = currentUserRef.current;
      let newX = targetX;
      let newY = targetY;
      
      switch (e.key) {
        case "ArrowUp":
          newY -= 1;
          break;
        case "ArrowDown":
          newY += 1;
          break;
        case "ArrowLeft":
          newX -= 1;
          break;
        case "ArrowRight":
          newX += 1;
          break;
      }
      
      if (newX !== targetX || newY !== targetY) {
        if (isValidPosition(newX, newY)) {
          currentUserRef.current.targetX = newX;
          currentUserRef.current.targetY = newY;
          
          if (loadingState !== "demo-mode") {
            send({
              type: "move",
              payload: { x: newX, y: newY },
            });
          }
        } else {
          showNotification("Cannot move there - position is occupied");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [send, loadingState, roomControls, isValidPosition, spaceObjects]);

  // UI controls for the virtual space
  const toggleControl = (control: keyof typeof roomControls) => {
    setRoomControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const changeViewMode = () => {
    setRoomControls(prev => ({
      ...prev,
      viewMode: prev.viewMode === "2d" ? "3d" : "2d"
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {loadingState === "connecting" ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to virtual space...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              {spaceId.charAt(0).toUpperCase() + spaceId.slice(1).replace(/-/g, ' ')}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentUserRef.current && getUserZone(currentUserRef.current.x, currentUserRef.current.y)}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                {Object.keys(usersRef.current).length + 1} users online
              </span>
            </div>
          </div>
          
          <div className="relative flex-1 p-4">
            <canvas
              ref={canvasRef}
              className="bg-white shadow-md rounded-lg cursor-pointer mx-auto"
              onClick={handleCanvasClick}
            />
            {notification && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm transition-opacity">
                {notification}
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={changeViewMode}
                  className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                >
                  Switch to {roomControls.viewMode === "2d" ? "3D" : "2D"} View
                </button>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.grid}
                    onChange={() => toggleControl('grid')}
                    className="rounded text-indigo-500"
                  />
                  <span>Show Grid</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.smoothMovement}
                    onChange={() => toggleControl('smoothMovement')}
                    className="rounded text-indigo-500"
                  />
                  <span>Smooth Movement</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.showUsernames}
                    onChange={() => toggleControl('showUsernames')}
                    className="rounded text-indigo-500"
                  />
                  <span>Show Usernames</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={roomControls.showZoneNames}
                    onChange={() => toggleControl('showZoneNames')}
                    className="rounded text-indigo-500"
                  />
                  <span>Show Zone Names</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Use arrow keys to move, click on the canvas to move to a location, or click on objects to interact.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Leave Space
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};