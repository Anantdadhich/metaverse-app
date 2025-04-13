// components/virtual-space/UserAvatar.tsx
import React from 'react';

interface UserAvatarProps {
  username: string;
  color: string;
  x: number;
  y: number;
  isTyping?: boolean;
  isCurrentUser?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  color,
  x,
  y,
  isTyping = false,
  isCurrentUser = false
}) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {/* Avatar circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
      
      {/* Username label */}
      <div className="mt-1 px-2 py-1 bg-slate-800/80 rounded text-xs text-white whitespace-nowrap">
        {username}{isCurrentUser && ' (You)'}
      </div>
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-1 px-2 py-1 bg-slate-800/80 rounded text-xs text-slate-300 whitespace-nowrap">
          typing...
        </div>
      )}
    </div>
  );
};