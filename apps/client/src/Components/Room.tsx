import { useEffect, useRef, useState } from "react"
import { WebSocket } from "ws";



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
                

        }
    } 



    return (
        <div>
        
        
        </div>
    )
}