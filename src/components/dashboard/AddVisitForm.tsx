import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Props {
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  patients: User[];
}

export default function AddVisitForm({ error, success, onSubmit, patients }: Props) {
  const [formData, setFormData] = useState({
    patientId: '',
    type: 'Psicoterapia',
    date: new Date().toISOString().split('T')[0],
    duration: 60
  });
  const [therapyTypes, setTherapyTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTherapyTypes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'therapyPrices'));
        const types = querySnapshot.docs.map(doc => doc.data().type as string);
        const uniqueTypes = Array.from(new Set(types)).sort();
        if (uniqueTypes.length > 0) {
          setTherapyTypes(uniqueTypes);
          // If current type is not in the list, set to first available
          if (!uniqueTypes.includes(formData.type)) {
            setFormData(prev => ({ ...prev, type: uniqueTypes[0] }));
          }
        }
      } catch (error) {
        console.error("Error fetching therapy types:", error);
      }
    };
    fetchTherapyTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const raw = e.target.value;
    const value = e.target.name === 'duration' || e.target.type === 'number' ? parseInt(raw) : raw;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Aggiungi Nuova Visita</h2>
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
            Tipologia
          </label>
          <select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            {therapyTypes.length > 0 ? (
              therapyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))
            ) : (
              <>
                <option value="Psicoterapia">Psicoterapia</option>
                <option value="Psicoeducazione">Psicoeducazione</option>
                <option value="ABA">ABA</option>
                <option value="Logopedia">Logopedia</option>
                <option value="Neuropsicomotricità">Neuropsicomotricità</option>
                <option value="Gruppo">Gruppo</option>
                <option value="GLO">GLO</option>
              </>
            )}
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
            Durata
          </label>
          <select
            name="duration"
            required
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value={60}>1 ora (60 minuti)</option>
            <option value={90}>1 ora e mezza (90 minuti)</option>
            <option value={120}>2 ore (120 minuti)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          Aggiungi Visita
        </button>
      </form>
    </div>
  );
}