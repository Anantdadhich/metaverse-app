import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../hooks/useWebsocket';

interface Position {
  id?: string;
  x: number;
  y: number;
}

interface User {
  id: string;
  x: number;
  y: number;
  userId?: string;
}

interface VirtualMapProps {
  spaceId: string;
  token: string;
  width: number;
  height: number;
}

export const VirtualMap: React.FC<VirtualMapProps> = ({ spaceId, token, width, height }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const TILE_SIZE = 32; // Size of each tile in pixels

  const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    // Join the space when component mounts
    sendMessage({
      type: 'join',
      payload: { spaceId, token }
    });
  }, [spaceId, token, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        switch (data.type) {
          case 'space-joined':
            setCurrentPosition(data.payload.spawn);
            setUsers(data.payload.users);
            break;
          case 'user-joined':
            setUsers(prev => [...prev, {
              id: data.payload.id,
              x: data.payload.x,
              y: data.payload.y,
              userId: data.payload.userId
            }]);
            break;
          case 'movement':
            setUsers(prev => prev.map(user => 
              user.id === data.payload.id 
                ? { ...user, x: data.payload.x, y: data.payload.y }
                : user
            ));
            if (data.payload.id === currentPosition?.id) {
              setCurrentPosition({
                x: data.payload.x,
                y: data.payload.y
              });
            }
            break;
          case 'user-left':
            setUsers(prev => prev.filter(user => user.id !== data.payload.id));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage, currentPosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#ddd';
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * TILE_SIZE, 0);
      ctx.lineTo(x * TILE_SIZE, height * TILE_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * TILE_SIZE);
      ctx.lineTo(width * TILE_SIZE, y * TILE_SIZE);
      ctx.stroke();
    }

    // Draw users
    users.forEach(user => {
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(user.x * TILE_SIZE, user.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw current user
    if (currentPosition) {
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(
        currentPosition.x * TILE_SIZE,
        currentPosition.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }, [users, currentPosition, width, height]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPosition) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);

    // Check if the move is valid (only one step at a time)
    const xDiff = Math.abs(x - currentPosition.x);
    const yDiff = Math.abs(y - currentPosition.y);

    if ((xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1)) {
      sendMessage({
        type: 'move',
        payload: { x, y }
      });
    }
  };

  return (
    <div className="virtual-map">
      <canvas
        ref={canvasRef}
        width={width * TILE_SIZE}
        height={height * TILE_SIZE}
        onClick={handleCanvasClick}
        style={{ border: '1px solid #ccc' }}
      />
      <style>{`
        .virtual-map {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #f5f5f5;
        }
        canvas {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}; 