import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider';


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
  const { spaceId } = useParams<{ spaceId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authUser || !spaceId) return;

    wsRef.current = new WebSocket('ws://localhost:3001/chat');

    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        type: 'join-chat',
        payload: {
          spaceId,
          userId: authUser.id,
          username: authUser.username
        }
      }));
    };

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
        
        // If chat is closed and we receive a message, show a notification
        if (!isOpen) {
          // This could be enhanced with browser notifications
          console.log('New message from', message.payload.username);
        }
      } else if (message.type === 'chat-history') {
        setMessages(message.payload.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, [authUser, spaceId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!wsRef.current || !authUser) return;

    if (!isTyping) {
      setIsTyping(true);
      wsRef.current.send(
        JSON.stringify({
          type: 'typing',
          payload: {
            spaceId,
            userId: authUser.id,
            isTyping: true,
          },
        })
      );
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current as NodeJS.Timeout);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      wsRef.current?.send(
        JSON.stringify({
          type: 'typing',
          payload: {
            spaceId,
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
        spaceId,
        userId: authUser.id,
        username: authUser.username,
        content: newMessage,
        timestamp: new Date().toISOString(),
      },
    };

    wsRef.current.send(JSON.stringify(message));
    setNewMessage('');
    setIsTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current as NodeJS.Timeout);
      wsRef.current.send(
        JSON.stringify({
          type: 'typing',
          payload: {
            spaceId,
            userId: authUser.id,
            isTyping: false,
          },
        })
      );
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[-100%] w-96 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg mb-4 border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Space Chat</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No messages yet. Start chatting!
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${
                    message.userId === authUser?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.userId === authUser?.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <div className="text-xs text-slate-300 mb-1">
                      {message.username}
                    </div>
                    <div className="break-words">{message.content}</div>
                    <div className="text-xs text-slate-300 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700">
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
                className="flex-1 p-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
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
