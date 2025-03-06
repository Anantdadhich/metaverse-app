import { useState } from 'react';
import { Navbar } from './Components/UI/Navbar';
import { Sidebar } from './Components/UI/Sidebar';
import { Room } from './Components/Room';
import { Chat } from './Components/Chat';
import { Modal } from './Components/UI/Modal';
import { User } from './types';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // In a real app, these would come from your backend
  const users: { [userId: string]: User } = {
    'user1': { id: 'user1', x: 10, y: 10, targetX: 10, targetY: 10 },
    'user2': { id: 'user2', x: 12, y: 12, targetX: 12, targetY: 12 },
  };
  
  const currentUser: User = { id: 'user1', x: 10, y: 10, targetX: 10, targetY: 10 };
  
  const toggleChat = () => setChatOpen(!chatOpen);
  const openSettings = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onSettingsClick={openSettings} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar users={users} currentUser={currentUser} />
        <main className="flex-1 flex flex-col relative">
          <Room/>
          <button 
            onClick={toggleChat}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          {chatOpen && (
            <Chat 
              currentUser={currentUser} 
              users={users} 
              send={() => {}} 
              onClose={() => setChatOpen(false)}
            />
          )}
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="User1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Avatar Color</label>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-red-500"></button>
              <button className="w-8 h-8 rounded-full bg-blue-500"></button>
              <button className="w-8 h-8 rounded-full bg-green-500"></button>
              <button className="w-8 h-8 rounded-full bg-purple-500"></button>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;