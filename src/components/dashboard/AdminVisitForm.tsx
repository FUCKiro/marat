import React, { useState } from 'react';
import { User, Visit } from '../../types';

interface Props {
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  operators: User[];
  patients: User[];
  initialData?: Visit | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function AdminVisitForm({ 
  error, 
  success, 
  onSubmit, 
  operators, 
  patients, 
  initialData,
  isEditing,
  onCancel 
}: Props) {
  const [formData, setFormData] = useState({
    operatorId: initialData ? initialData.operatorId : '',
    patientId: initialData ? initialData.patientId : '',
    date: initialData ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: initialData ? initialData.duration : 60
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? `Modifica Visita del ${initialData?.date.toLocaleDateString('it-IT')}` : 'Aggiungi Nuova Visita'}
      </h2>
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
            Operatore
          </label>
          <select
            name="operatorId"
            required
            value={formData.operatorId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Seleziona un operatore</option>
            {operators.map(operator => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paziente
          </label>
          <select
            name="patientId"
            required
            value={formData.patientId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Seleziona un paziente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Durata (minuti)
          </label>
          <input
            type="number"
            name="duration"
            required
            min="15"
            step="15"
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            {isEditing ? 'Salva Modifiche' : 'Aggiungi Visita'}
          </button>
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
}