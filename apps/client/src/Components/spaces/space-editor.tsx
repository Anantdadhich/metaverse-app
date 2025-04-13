import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

interface Element {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  static: boolean;
  category: string;
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
  elements: MapElement[];
}

export const SpaceEditor = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [placedElements, setPlacedElements] = useState<MapElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

  // Fetch space and elements
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('metaverse_token');
        const spaceResponse = await fetch(`http://localhost:3000/api/v1/space/${spaceId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!spaceResponse.ok) throw new Error('Failed to fetch space details');
        const spaceData = await spaceResponse.json();

        if (spaceData.creatorId !== user?.id) {
          setError("You don't have permission to edit this space");
          navigate('/spaces');
          return;
        }

        setSpaceInfo(spaceData);
        if (spaceData.elements) {
          setPlacedElements(spaceData.elements);
          spaceData.elements.forEach((element: MapElement) => {
            if (element.elements?.imageUrl) {
              const img = new Image();
              img.src = element.elements.imageUrl;
              img.onload = () => setLoadedImages((prev) => ({ ...prev, [element.elements.imageUrl]: img }));
            }
          });
        }

        const elementsResponse = await fetch('http://localhost:3000/api/v1/elements', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!elementsResponse.ok) throw new Error('Failed to fetch elements');
        const elementsData = await elementsResponse.json();
        setElements(elementsData.elements);
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId && user) fetchData();
  }, [spaceId, user, navigate]);

  // Handle canvas rendering
  useEffect(() => {
    if (!canvasRef.current || !spaceInfo) return;

    const renderCanvas = () => {
      const canvas = canvasRef.current!;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1A103C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      placedElements.forEach((element) => {
        const image = loadedImages[element.elements.imageUrl];
        if (image) {
          ctx.drawImage(image, element.x, element.y, element.elements.width, element.elements.height);
        }
      });
    };

    renderCanvas();
  }, [placedElements, canvasSize, spaceInfo, loadedImages]);

  // Add element to space
  const addElement = async (x: number, y: number) => {
    if (!selectedElement || !spaceId) return;

    const newElement = {
      x,
      y,
      elementId: selectedElement.id,
      elements: {
        id: selectedElement.id,
        imageUrl: selectedElement.imageUrl,
        width: selectedElement.width,
        height: selectedElement.height,
        static: selectedElement.static,
      },
    };

    try {
      const token = localStorage.getItem('metaverse_token');
      const response = await fetch(`http://localhost:3000/api/v1/space/${spaceId}/elements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newElement),
      });
      if (!response.ok) throw new Error('Failed to add element');
      const data = await response.json();
      setPlacedElements((prev) => [...prev, data.element]);
    } catch (err) {
      setError(`Failed to add element: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addElement(x, y);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{spaceInfo?.name} - Editor</h2>
        <button
          onClick={() => navigate(`/spaces/${spaceId}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Space
        </button>
      </div>
      <div className="flex">
        <div className="w-1/4 bg-slate-800 p-4 rounded-lg mr-4">
          <h3 className="text-lg font-semibold mb-2">Elements</h3>
          {elements.map((element) => (
            <div
              key={element.id}
              onClick={() => setSelectedElement(element)}
              className={`p-2 mb-2 cursor-pointer rounded-lg ${
                selectedElement?.id === element.id ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              {element.name}
            </div>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          className="bg-slate-800/50 border border-slate-700 rounded-lg"
        />
      </div>
    </div>
  );
};