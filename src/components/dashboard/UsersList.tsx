import React from 'react';
import { ChevronDown } from 'lucide-react';
import { User } from '../../types';
import { useState } from 'react';

interface Props {
  users: User[];
  type: 'operators' | 'patients';
  title: string;
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
}

export default function UsersList({ users, type, title, onDeleteUser, deletingUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const filteredUsers = users.filter(user => 
    type === 'operators' ? user.role === 'operator' : user.role === 'patient'
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div 
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer md:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {title}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      <div className={`border-t border-gray-200 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-teal-600">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email || 'Email non fornita'}
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    disabled={deletingUser === user.id}
                    className="ml-4 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                  >
                    {deletingUser === user.id ? 'Eliminazione...' : 'Elimina'}
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredUsers.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">
              Nessun {type === 'operators' ? 'operatore' : 'paziente'} presente
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}