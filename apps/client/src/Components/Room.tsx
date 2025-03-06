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