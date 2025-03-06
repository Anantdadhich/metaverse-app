import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';

interface ChatProps {
  currentUser: User;
  users: { [userId: string]: User };
  send: (message: any) => void;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ currentUser, users, send, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', userId: 'user2', text: 'Hey everyone!', timestamp: Date.now() - 60000 },
    { id: '2', userId: 'user1', text: 'Hello there!', timestamp: Date.now() - 30000 },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: message,
        timestamp: Date.now(),
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // In a real application, you would send this via WebSocket
      send({
        type: 'chat',
        payload: {
          text: message,
        },
      });
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="absolute bottom-16 right-4 w-80 bg-white rounded-lg shadow-xl flex flex-col z-10 h-96">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-medium">Chat</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`mb-2 flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-2 ${
              msg.userId === currentUser.id 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.userId !== currentUser.id && (
                <p className="text-xs font-medium mb-1">
                  {msg.userId === 'user1' ? 'You' : `User ${msg.userId}`}
                </p>
              )}
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.userId === currentUser.id ? 'text-indigo-100' : 'text-gray-500'
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button 
          type="submit"
          className="bg-indigo-500 text-white px-4 rounded-r-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};