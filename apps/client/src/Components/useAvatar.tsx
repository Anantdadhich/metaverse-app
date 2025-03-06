
import React from 'react';

interface UserAvatarProps {
  avatarUrl: string;
  x: number;
  y: number;
  scale: number;
  label: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, x, y, scale, label }) => {
  const avatarSize = 40; 
  return (
    <image
      href={avatarUrl}
      x={x * scale - avatarSize / 2}
      y={y * scale - avatarSize / 2}
      width={avatarSize}
      height={avatarSize}
    />
  );
};