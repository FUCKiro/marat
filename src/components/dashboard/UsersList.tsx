import React from 'react';
import { User } from '../../types';

interface Props {
  users: User[];
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
}

export default function UsersList({ users, onDeleteUser, deletingUser }: Props) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Lista Utenti
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'operator' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Amministratore' :
                     user.role === 'operator' ? 'Operatore' : 'Paziente'}
                  </span>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      disabled={deletingUser === user.id}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                    >
                      {deletingUser === user.id ? 'Eliminazione...' : 'Elimina'}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}