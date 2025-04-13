import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Auth/AuthProvider';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user: authUser } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authUser) return;

    wsRef.current = new WebSocket('ws://localhost:3001/chat');

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'chat-message') {
        setMessages((prev) => [
          ...prev,
          {
            ...message.payload,
            timestamp: new Date(message.payload.timestamp),
          },
        ]);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, [authUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!wsRef.current || !authUser) return;

    setIsTyping(true);
    wsRef.current.send(
      JSON.stringify({
        type: 'typing',
        payload: {
          userId: authUser.id,
          isTyping: true,
        },
      })
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current as NodeJS.Timeout);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      wsRef.current?.send(
        JSON.stringify({
          type: 'typing',
          payload: {
            userId: authUser.id,
            isTyping: false,
          },
        })
      );
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !authUser) return;

    const message = {
      type: 'chat-message',
      payload: {
        userId: authUser.id,
        username: authUser.username,
        content: newMessage,
        timestamp: new Date().toISOString(),
      },
    };

    wsRef.current.send(JSON.stringify(message));
    setNewMessage('');
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg transform translate-y-[-100%] mb-4">
          <div className="p-4 border-b border-white/20">
            <h3 className="text-white font-semibold">Chat</h3>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === authUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.userId === authUser?.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <div className="text-xs text-white/70 mb-1">
                    {message.username}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/50"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 