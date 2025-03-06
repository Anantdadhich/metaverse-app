export interface User {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  name?: string;
  avatarColor?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}