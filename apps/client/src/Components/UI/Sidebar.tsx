import React from 'react';
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