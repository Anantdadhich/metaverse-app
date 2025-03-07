/*import React from 'react';
import { User } from '../../types';

interface SidebarProps {
  users: { [userId: string]: User };
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ users, currentUser }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-gray-800">Users Online</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {Object.values(users).map(user => (
            <li 
              key={user.id} 
              className={`p-2 rounded-md flex items-center space-x-2 ${user.id === currentUser.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.id === currentUser.id ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <span className="text-white font-medium text-sm">{user.id.slice(0, 2)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user.id === currentUser.id ? 'You' : `User ${user.id}`}
                </p>
                <p className="text-xs text-gray-500">Position: ({Math.round(user.x)}, {Math.round(user.y)})</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rooms</h3>
        <ul className="space-y-1">
          <li className="text-sm px-2 py-1 bg-indigo-50 text-indigo-700 rounded">Main Hall</li>
          <li className="text-sm px-2 py-1 text-gray-600 hover:bg-gray-50 rounded">Meeting Room</li>
          <li className="text-sm px-2 py-1 text-gray-600 hover:bg-gray-50 rounded">Lounge</li>
        </ul>
      </div>
    </aside>
  );
};

*/



import type React from "react"
import type { User, Room } from "../../types"

interface SidebarProps {
  users: { [userId: string]: User }
  currentUser: User
  rooms: Room[]
  onRoomChange: (roomId: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  users,
  currentUser,
  rooms = [
    { id: "main", name: "Main Hall", isActive: true },
    { id: "meeting", name: "Meeting Room", isActive: false },
    { id: "lounge", name: "Lounge", isActive: false },
  ],
  onRoomChange,
}) => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col border-r border-indigo-100">
      <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="font-bold text-indigo-900">Users Online</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="p-3 space-y-2">
          {Object.values(users).map((user) => (
            <li
              key={user.id}
              className={`p-2 rounded-lg flex items-center space-x-3 ${
                user.id === currentUser.id
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  user.id === currentUser.id ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-200"
                }`}
              >
                <span className={`font-medium text-sm ${user.id === currentUser.id ? "text-white" : "text-gray-700"}`}>
                  {user.id.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">
                    {user.id === currentUser.id ? "You" : `User ${user.id}`}
                  </p>
                  {user.isInCall && (
                    <span className="ml-2 flex items-center text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      In Call
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Position: ({Math.round(user.x)}, {Math.round(user.y)})
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h3 className="text-sm font-medium text-indigo-900 mb-3">Rooms</h3>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => onRoomChange(room.id)}
              className={`text-sm px-3 py-2 rounded-lg cursor-pointer transition-all ${
                room.isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                {room.isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                )}
                {room.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

