



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
        
    }
}