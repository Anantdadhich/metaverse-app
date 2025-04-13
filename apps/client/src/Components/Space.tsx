import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebsocket';
import { SpaceMap } from './SpaceMap';

interface SpaceProps {
  spaceId: string;
  token: string;
}

interface SpaceData {
  id: string;
  name: string;
  width: number;
  height: number;
  creatorId: string;
  elements: MapElement[];
}

interface MapElement {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'furniture' | 'wall' | 'floor' | 'interactive';
  isStatic: boolean;
  interactionType?: 'portal' | 'video' | 'whiteboard' | 'chat';
}

interface User {
  id: string;
  username: string;
  x: number;
  y: number;
  avatarUrl?: string;
  avatarColor: string;
}

export const Space: React.FC<SpaceProps> = ({ spaceId, token }) => {
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/space/${spaceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch space data');
        }
        const data = await response.json();
        setSpaceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load space');
      }
    };

    fetchSpaceData();
  }, [spaceId]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        switch (data.type) {
          case 'users-update':
            setUsers(data.payload.users);
            break;
          case 'current-user':
            setCurrentUser(data.payload.user);
            break;
          case 'chat-message':
            setMessages(prev => [...prev, data.payload]);
            break;
          case 'user-joined':
            setUsers(prev => [...prev, data.payload.user]);
            break;
          case 'user-left':
            setUsers(prev => prev.filter(u => u.id !== data.payload.userId));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  const handleMove = (x: number, y: number) => {
    sendMessage({
      type: 'move',
      payload: { x, y }
    });
  };

  const handleInteract = (elementId: string) => {
    sendMessage({
      type: 'interact',
      payload: { elementId }
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage({
        type: 'chat-message',
        payload: { text: newMessage }
      });
      setNewMessage('');
    }
  };

  const handleExitSpace = () => {
    // Handle space exit logic
    window.location.href = '/spaces';
  };

  if (error) return <div className="space-error">{error}</div>;
  if (!spaceData) return <div className="space-loading">Loading space...</div>;

  return (
    <div className="space-container">
      <div className="space-header">
        <div className="space-info">
          <h1>{spaceData.name}</h1>
          <div className="connection-status">
            <span className="status-dot"></span>
            Connected
          </div>
        </div>
        <div className="space-actions">
          <button onClick={() => setShowSettings(true)}>Settings</button>
          <button onClick={handleExitSpace}>Exit Space</button>
        </div>
      </div>

      <div className="space-content">
        <SpaceMap
          elements={spaceData.elements}
          users={users}
          currentUser={currentUser}
          onMove={handleMove}
          onInteract={handleInteract}
          width={spaceData.width}
          height={spaceData.height}
        />

        {showChat && (
          <div className="chat-panel">
            <div className="chat-header">
              <h3>Chat</h3>
              <button onClick={() => setShowChat(false)}>×</button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className="chat-message">
                  <span className="user">{msg.user}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-footer">
        <div className="user-controls">
          <button className="mic-control">🎤</button>
          <button className="video-control">📹</button>
          <button className="screen-share">📺</button>
          <button onClick={() => setShowChat(!showChat)}>💬</button>
        </div>
        <div className="user-info">
          {currentUser?.username}
          <div className="avatar" style={{ backgroundColor: currentUser?.avatarColor }} />
        </div>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2>Space Settings</h2>
            {/* Add settings controls here */}
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        .space-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1b26;
          color: white;
        }

        .space-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #24253d;
        }

        .space-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4CAF50;
        }

        .space-actions {
          display: flex;
          gap: 1rem;
        }

        .space-content {
          flex: 1;
          display: flex;
          position: relative;
        }

        .chat-panel {
          width: 300px;
          background: #24253d;
          border-left: 1px solid #383a59;
        }

        .chat-header {
          padding: 1rem;
          border-bottom: 1px solid #383a59;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          height: calc(100% - 120px);
          overflow-y: auto;
          padding: 1rem;
        }

        .chat-message {
          margin-bottom: 0.5rem;
        }

        .chat-input {
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #383a59;
          background: #1a1b26;
          color: white;
        }

        .space-footer {
          padding: 1rem;
          background: #24253d;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-controls {
          display: flex;
          gap: 1rem;
        }

        button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          background: #383a59;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover {
          background: #4a4c6e;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .settings-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-content {
          background: #24253d;
          padding: 2rem;
          border-radius: 8px;
          min-width: 400px;
        }

        .space-error {
          padding: 2rem;
          text-align: center;
          color: #ff5252;
        }

        .space-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #666;
        }
      `}</style>
    </div>
  );
}; 