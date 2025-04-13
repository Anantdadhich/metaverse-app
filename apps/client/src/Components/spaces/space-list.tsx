import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';


interface Space {
  id: string;
  name: string;
  width: number;
  height: number;
  creatorId: string;
  userCount?: number;
}

export const SpacesList = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchSpaces();
  }, [user, navigate]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('metaverse_token');
      const response = await fetch('http://localhost:3000/api/v1/space/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }
      
      const data = await response.json();
      setSpaces(data.spaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setError('Failed to load spaces. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async () => {
    if (!newSpaceName.trim()) {
      setError('Please enter a space name');
      return;
    }
    
    try {
      setError(null);
      const token = localStorage.getItem('metaverse_token');
      const response = await fetch('http://localhost:3000/api/v1/space/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSpaceName,
          dimensions: "20x15"  // Changed to match backend expectation
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create space');
      }
      
      const data = await response.json();
      if (data.space || data.spaceId) {
        await fetchSpaces();
        setNewSpaceName('');
      }
    } catch (error) {
      console.error('Error creating space:', error);
      setError('Failed to create space. Please try again.');
    }
  };

  const joinSpace = (spaceId: string) => {
    const token = localStorage.getItem('metaverse_token');
    navigate(`/spaces/${spaceId}?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Virtual Spaces</h1>
          <button 
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
          >
            Profile
          </button>
        </div>
        
        {error && (
          <div className="bg-red-600/20 border border-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Space</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="Enter space name"
              className="px-4 py-2 border border-slate-600 bg-slate-800 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createSpace}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
            >
              Create
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400">
                No spaces found. Create your first space above!
              </div>
            ) : (
              spaces.map((space) => (
                <div
                  key={space.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
                  <div className="text-slate-400 mb-6 space-y-1">
                    <p>Size: {space.width}x{space.height}</p>
                    <p>
                      {space.userCount || 0} {(space.userCount || 0) === 1 ? 'user' : 'users'} online
                    </p>
                  </div>
                  <button
                    onClick={() => joinSpace(space.id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Join Space
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
