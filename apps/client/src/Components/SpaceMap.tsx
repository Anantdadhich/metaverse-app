import React, { useEffect, useRef, useState } from 'react';

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

interface SpaceMapProps {
  elements: MapElement[];
  users: User[];
  currentUser: User | null;
  onMove: (x: number, y: number) => void;
  onInteract: (elementId: string) => void;
  width: number;
  height: number;
}

export const SpaceMap: React.FC<SpaceMapProps> = ({
  elements,
  users,
  currentUser,
  onMove,
  onInteract,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const TILE_SIZE = 32;
  const [isDragging, setIsDragging] = useState(false);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });

  // Load all images
  useEffect(() => {
    const loadImage = async (element: MapElement) => {
      return new Promise<[string, HTMLImageElement]>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve([element.id, img]);
        img.onerror = reject;
        img.src = element.imageUrl;
      });
    };

    Promise.all(elements.map(loadImage))
      .then(loadedImages => {
        const imageMap = Object.fromEntries(loadedImages);
        setImages(imageMap);
      })
      .catch(error => console.error('Error loading images:', error));
  }, [elements]);

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply view offset
    ctx.save();
    ctx.translate(viewOffset.x, viewOffset.y);

    // Draw floor grid
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
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

    // Draw map elements
    elements.forEach(element => {
      const image = images[element.id];
      if (image) {
        ctx.drawImage(
          image,
          element.x * TILE_SIZE,
          element.y * TILE_SIZE,
          element.width * TILE_SIZE,
          element.height * TILE_SIZE
        );

        // Draw interaction indicator if element is interactive
        if (element.interactionType) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(
            element.x * TILE_SIZE,
            element.y * TILE_SIZE,
            element.width * TILE_SIZE,
            element.height * TILE_SIZE
          );
        }
      }
    });

    // Draw other users
    users.forEach(user => {
      if (user.id !== currentUser?.id) {
        // Draw avatar background
        ctx.fillStyle = user.avatarColor;
        ctx.beginPath();
        ctx.arc(
          user.x * TILE_SIZE + TILE_SIZE / 2,
          user.y * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw username
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          user.username,
          user.x * TILE_SIZE + TILE_SIZE / 2,
          user.y * TILE_SIZE + TILE_SIZE + 15
        );
      }
    });

    // Draw current user
    if (currentUser) {
      // Draw avatar background
      ctx.fillStyle = currentUser.avatarColor;
      ctx.beginPath();
      ctx.arc(
        currentUser.x * TILE_SIZE + TILE_SIZE / 2,
        currentUser.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw highlight ring
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        currentUser.x * TILE_SIZE + TILE_SIZE / 2,
        currentUser.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 + 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Draw username
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        currentUser.username,
        currentUser.x * TILE_SIZE + TILE_SIZE / 2,
        currentUser.y * TILE_SIZE + TILE_SIZE + 15
      );
    }

    ctx.restore();
  }, [elements, users, currentUser, images, width, height, viewOffset]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentUser) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - viewOffset.x) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top - viewOffset.y) / TILE_SIZE);

    // Check if clicked on an interactive element
    const clickedElement = elements.find(
      element =>
        x >= element.x &&
        x < element.x + element.width &&
        y >= element.y &&
        y < element.y + element.height &&
        element.interactionType
    );

    if (clickedElement) {
      onInteract(clickedElement.id);
      return;
    }

    // Check if movement is valid (one step at a time)
    const dx = Math.abs(x - currentUser.x);
    const dy = Math.abs(y - currentUser.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Check if the new position is walkable
      const isBlocked = elements.some(
        element =>
          element.isStatic &&
          x >= element.x &&
          x < element.x + element.width &&
          y >= element.y &&
          y < element.y + element.height
      );

      if (!isBlocked) {
        onMove(x, y);
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      setViewOffset(prev => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-map">
      <canvas
        ref={canvasRef}
        width={width * TILE_SIZE}
        height={height * TILE_SIZE}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <style>{`
        .space-map {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1b26;
        }
        canvas {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
}; 