import React, { useState } from 'react';

interface Props {
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddOperatorForm({ error, success, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    email: '@maratonda.it',
    password: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      const value = e.target.value;
      // Ensure the email always ends with @maratonda.it
      if (!value.endsWith('@maratonda.it')) {
        setFormData(prev => ({
          ...prev,
          [e.target.name]: value + '@maratonda.it'
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '@maratonda.it') {
      setFormData(prev => ({ ...prev, email: '@maratonda.it' }));
      return;
    }
    
    // Remove @maratonda.it if present in the input
    const username = value.replace('@maratonda.it', '');
    setFormData(prev => ({
      ...prev,
      email: username + '@maratonda.it'
    }));
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Aggiungi Nuovo Operatore</h2>
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 text-green-600 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome e Cognome
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative mt-1">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleEmailChange}
            placeholder="nome.cognome"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          Aggiungi Operatore
        </button>
      </form>
    </div>
  );
}