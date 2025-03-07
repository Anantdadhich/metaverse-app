export interface User {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  username?: string;
  avatarColor?: any;
    isInCall?: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  text: string
  timestamp: number
  isGlobal: boolean
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface GameObject {
  type: string;      
  x: number;        
  y: number;        
  id: string;     
}


export interface SpaceAsset {
  width: number;     
  height: number;    
  color: string;      
  name: string;      
  isRound?: boolean; 
  isZone?: boolean;  
}

export interface Room {
  id: string
  name: string
  isActive: boolean
}

