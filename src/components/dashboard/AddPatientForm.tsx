import React, { useState } from 'react';

interface Props {
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddPatientForm({ error, success, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Aggiungi Nuovo Paziente</h2>
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Email (opzionale)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          Aggiungi Paziente
        </button>
      </form>
    </div>
  );
}