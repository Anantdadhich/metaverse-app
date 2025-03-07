/*import React, { useState, useRef, useEffect } from 'react';
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

*/



import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { User, ChatMessage } from "../types"

interface ChatProps {
  currentUser: User
  users: { [userId: string]: User }
  send: (message: string, isGlobal: boolean) => void
  onClose: () => void
}

export const Chat: React.FC<ChatProps> = ({ currentUser, users, send, onClose }) => {
  const [message, setMessage] = useState("")
  const [isGlobal, setIsGlobal] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "system",
      text: "Welcome to the virtual space! You can chat with others here.",
      timestamp: Date.now(),
      isGlobal: true,
    },
    {
      id: "2",
      userId: "user2",
      text: "Hello everyone! How are you doing today?",
      timestamp: Date.now() - 60000,
      isGlobal: true,
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return

    // In a real app, this would be handled by the send prop
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      text: message,
      timestamp: Date.now(),
      isGlobal,
    }

    setMessages([...messages, newMessage])
    setMessage("")
    send(message, isGlobal)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="absolute bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-indigo-100">
      <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3 className="font-medium">{isGlobal ? "Global Chat" : "Nearby Chat"}</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-indigo-50 to-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                msg.userId === "system"
                  ? "bg-gray-200 text-gray-800"
                  : msg.userId === currentUser.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {msg.userId !== "system" && msg.userId !== currentUser.id && (
                <p className="text-xs font-medium text-indigo-600 mb-1">
                  {users[msg.userId]?.username || `User ${msg.userId}`}
                </p>
              )}
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setIsGlobal(true)}
            className={`text-xs px-2 py-1 rounded ${isGlobal ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Global
          </button>
          <button
            onClick={() => setIsGlobal(false)}
            className={`text-xs px-2 py-1 rounded ${!isGlobal ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Nearby
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

