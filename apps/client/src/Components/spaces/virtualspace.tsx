

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

interface Position {
  x: number;
  y: number;
}

interface User {
  id: string;
  username: string;
  position: Position;
  avatarColor: string;
  isTyping?: boolean;
}

interface MapElement {
  id: string;
  x: number;
  y: number;
  elementId: string;
  elements: {
    id: string;
    imageUrl: string;
    width: number;
    height: number;
    static: boolean;
  };
}

interface SpaceInfo {
  id: string;
  name: string;
  width: number;
  height: number;
  creatorId: string;
  dimensions?: string;
  elements?: MapElement[];
}

export const VirtualSpace = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || localStorage.getItem('metaverse_token');
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null);
  const [mapElements, setMapElements] = useState<MapElement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const animationFrameRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Fetch space details
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = token || localStorage.getItem('metaverse_token');
        if (!authToken) throw new Error('Authentication token not found');

        const response = await fetch(`http://localhost:3000/api/v1/space/${spaceId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch space details: ${response.status}`);
        const data = await response.json();

        let width = 800;
        let height = 600;
        if (data.dimensions) {
          const dimParts = data.dimensions.split('*').map((part: any) => parseInt(part.trim()));
          if (dimParts.length === 2 && !isNaN(dimParts[0]) && !isNaN(dimParts[1])) {
            width = dimParts[0];
            height = dimParts[1];
          }
        }

        if (data.elements && Array.isArray(data.elements)) {
          setMapElements(data.elements);
          preloadElementImages(data.elements);
        }

        setSpaceInfo({
          id: spaceId as string,
          name: data.name || 'Virtual Space',
          width,
          height,
          creatorId: data.creatorId || '',
          dimensions: data.dimensions,
          elements: data.elements || [],
        });
      } catch (err) {
        setError(`Failed to load space: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (spaceId) fetchSpaceDetails();
    else setError('Invalid space ID');
  }, [spaceId, token]);

  // Preload images
  const preloadElementImages = useCallback((elements: MapElement[]) => {
    elements.forEach((element) => {
      if (element.elements && element.elements.imageUrl) {
        const img = new Image();
        img.src = element.elements.imageUrl;
        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [element.elements.imageUrl]: img }));
        };
      }
    });
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: Math.min(window.innerWidth - 32, 1200),
        height: Math.min(window.innerHeight - 200, 800),
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up resources
  const cleanupResources = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (isLoading || !spaceInfo || !authUser || !spaceId || !token) return;

    cleanupResources();
    const connectWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:3001/spaces');

      wsRef.current.onopen = () => {
        setIsConnected(true);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'join-space',
              payload: {
                spaceId,
                token,
                username: authUser.username,
                avatarColor: authUser.avatarColor || getRandomColor(),
              },
            })
          );
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        reconnectTimeoutRef.current = window.setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = () => setError('Connection error. Server might be offline.');
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };
    };

    connectWebSocket();
    return cleanupResources;
  }, [authUser, spaceId, token, spaceInfo, isLoading, cleanupResources]);

  const handleWebSocketMessage = useCallback(
    (message: any) => {
      switch (message.type) {
        case 'space-joined':
          setCurrentUser({
            id: message.payload.userId,
            username: authUser!.username,
            position: message.payload.position || { x: 100, y: 100 },
            avatarColor: authUser!.avatarColor || getRandomColor(),
          });
          setUsers(message.payload.users?.filter((u: any) => u.id !== message.payload.userId) || []);
          break;
        case 'user-joined':
          setUsers((prev) => [...prev, { ...message.payload, position: message.payload.position || { x: 100, y: 100 } }]);
          break;
        case 'user-left':
          setUsers((prev) => prev.filter((u) => u.id !== message.payload.userId));
          break;
        case 'user-moved':
          setUsers((prev) =>
            prev.map((u) => (u.id === message.payload.userId ? { ...u, position: message.payload.position } : u))
          );
          break;
        case 'chat-message':
          setMessages((prev) => [...prev, { user: message.payload.username, text: message.payload.text }]);
          break;
        case 'element-added':
          setMapElements((prev) => [...prev, message.payload.element]);
          if (message.payload.element.elements?.imageUrl) {
            const img = new Image();
            img.src = message.payload.element.elements.imageUrl;
            img.onload = () => setLoadedImages((prev) => ({ ...prev, [message.payload.element.elements.imageUrl]: img }));
          }
          break;
        case 'element-removed':
          setMapElements((prev) => prev.filter((el) => el.id !== message.payload.elementId));
          break;
        case 'error':
          setError(message.payload.message);
          break;
      }
    },
    [authUser]
  );

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#073B4C', '#84C0C6', '#F0A202', '#5C80BC'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Collision detection
  const checkCollision = useCallback(
    (position: Position) => {
      const avatarRadius = 20;
      for (const element of mapElements) {
        if (!element.elements?.static) continue;
        const rect = { x: element.x, y: element.y, width: element.elements.width, height: element.elements.height };
        const closestX = Math.max(rect.x, Math.min(position.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(position.y, rect.y + rect.height));
        const distanceSquared = (position.x - closestX) ** 2 + (position.y - closestY) ** 2;
        if (distanceSquared < avatarRadius ** 2) return true;
      }
      return false;
    },
    [mapElements]
  );

  // Handle movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!currentUser || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const moveAmount = 10;
      let newPosition = { ...currentUser.position };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, newPosition.y - moveAmount);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(canvasSize.height - 40, newPosition.y + moveAmount);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, newPosition.x - moveAmount);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(canvasSize.width - 40, newPosition.x + moveAmount);
          break;
        default:
          return;
      }

      if (checkCollision(newPosition)) return;

      if (newPosition.x !== currentUser.position.x || newPosition.y !== currentUser.position.y) {
        wsRef.current.send(JSON.stringify({ type: 'move', payload: { spaceId, position: newPosition } }));
        setCurrentUser((prev) => (prev ? { ...prev, position: newPosition } : null));
      }
    },
    [currentUser, canvasSize, spaceId, checkCollision]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderCanvas = () => {
      const canvas = canvasRef.current!;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1A103C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      mapElements.forEach((element) => {
        if (element.elements?.imageUrl) {
          const image = loadedImages[element.elements.imageUrl];
          if (image) {
            ctx.drawImage(image, element.x, element.y, element.elements.width, element.elements.height);
            if (element.elements.static) {
              ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
              ctx.lineWidth = 2;
              ctx.strokeRect(element.x, element.y, element.elements.width, element.elements.height);
            }
          } else {
            ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
            ctx.fillRect(element.x, element.y, element.elements.width || 50, element.elements.height || 50);
          }
        }
      });

      [...users, ...(currentUser ? [currentUser] : [])].forEach((user) => {
        ctx.shadowColor = user.avatarColor;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.fillStyle = user.avatarColor;
        ctx.arc(user.position.x, user.position.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(user.username, user.position.x, user.position.y + 35);
        if (user.isTyping) ctx.fillText('typing...', user.position.x, user.position.y + 50);
      });

      animationFrameRef.current = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [users, currentUser, canvasSize, mapElements, loadedImages]);

  // Handle chat
  const sendMessage = () => {
    if (!chatInput.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'chat-message', payload: { spaceId, text: chatInput } }));
    setChatInput('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p>Loading virtual space...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="bg-red-600/20 border border-red-600 p-6 rounded-lg mb-6 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/spaces')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Back to Spaces
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-lg shadow-lg inline-flex items-center space-x-3">
          <h2 className="text-xl font-bold">{spaceInfo?.name || 'Virtual Space'}</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-300">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {spaceInfo?.creatorId === authUser?.id && (
            <button
              onClick={() => navigate(`/spaces/${spaceId}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Space
            </button>
          )}
          <button
            onClick={() => navigate('/spaces')}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            Exit Space
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg" />
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-slate-800/70 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h3 className="text-white font-semibold mb-2">Online Users ({users.length + (currentUser ? 1 : 0)})</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {currentUser && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentUser.avatarColor }} />
              <span className="text-white text-sm">{currentUser.username} (You)</span>
            </div>
          )}
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.avatarColor }} />
              <span className="text-white text-sm">{user.username}</span>
              {user.isTyping && <span className="text-white/50 text-xs">typing...</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-slate-800/70 backdrop-blur-sm p-4 rounded-lg shadow-lg w-1/3">
        <h3 className="text-white font-semibold mb-2">Chat</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-bold">{msg.user}:</span> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="px-2 py-1 border border-slate-600 bg-slate-800 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};