/*import { useState } from 'react';
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

*/

import { useState } from "react"
import { User } from "./types"
import { Navbar } from "./Components/UI/Navbar"
import { Sidebar } from "./Components/UI/Sidebar"
import { Room } from "./Components/Room"
import { Chat } from "./Components/Chat"
import { Modal } from "./Components/UI/Modal"


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [displayName, setDisplayName] = useState("User1")
  const [avatarColor, setAvatarColor] = useState("#4f46e5")

  // In a real app, these would come from your backend
  const [users, setUsers] = useState<{ [userId: string]: User }>({
    user1: {
      id: "user1",
      x: 200,
      y: 200,
      targetX: 200,
      targetY: 200,
      username: "You",
      avatarColor: "#4f46e5",
    },
    user2: {
      id: "user2",
      x: 300,
      y: 250,
      targetX: 300,
      targetY: 250,
      username: "Alex",
      avatarColor: "#8b5cf6",
      isInCall: true,
    },
    user3: {
      id: "user3",
      x: 400,
      y: 150,
      targetX: 400,
      targetY: 150,
      username: "Taylor",
      avatarColor: "#ec4899",
    },
  })

  const [rooms, setRooms] = useState([
    { id: "main", name: "Main Hall", isActive: true },
    { id: "meeting", name: "Meeting Room", isActive: false },
    { id: "lounge", name: "Lounge", isActive: false },
  ])

  const currentUser: User = users["user1"]

  const toggleChat = () => setChatOpen(!chatOpen)
  const openSettings = () => setIsModalOpen(true)

  const updateUserPosition = (x: number, y: number) => {
    setUsers((prev) => ({
      ...prev,
      user1: {
        ...prev["user1"],
        targetX: x,
        targetY: y,
      },
    }))
  }

  const handleRoomChange = (roomId: string) => {
    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        isActive: room.id === roomId,
      })),
    )
  }

  const handleSendMessage = (message: string, isGlobal: boolean) => {
    // In a real app, this would send the message to your backend
    console.log("Sending message:", message, "isGlobal:", isGlobal)
  }

  const handleSaveSettings = () => {
    setUsers((prev) => ({
      ...prev,
      user1: {
        ...prev["user1"],
        name: displayName,
        avatarColor,
      },
    }))
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar onSettingsClick={openSettings} usersOnline={Object.keys(users).length} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar users={users} currentUser={currentUser} rooms={rooms} onRoomChange={handleRoomChange} />
        <main className="flex-1 flex flex-col relative">
          
          <Room  />
          <button
            onClick={toggleChat}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg z-10 hover:opacity-90 transition-opacity"
            aria-label="Toggle chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          {chatOpen && (
            <Chat currentUser={currentUser} users={users} send={handleSendMessage} onClose={() => setChatOpen(false)} />
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Settings">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Color</label>
            <div className="flex gap-2">
              {["#4f46e5", "#8b5cf6", "#ec4899", "#f97316", "#10b981"].map((color) => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-10 h-10 rounded-full ${avatarColor === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleSaveSettings}
              className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

