import React from 'react';
import { User } from '../../types';

interface Props {
  users: User[];
  type: 'operators' | 'patients';
  title: string;
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
}

export default function UsersList({ users, type, title, onDeleteUser, deletingUser }: Props) {
  const filteredUsers = users.filter(user => 
    type === 'operators' ? user.role === 'operator' : user.role === 'patient'
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {title}
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-teal-600">
                    {user.name}
                  </div>
                  {user.email && (
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  )}
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