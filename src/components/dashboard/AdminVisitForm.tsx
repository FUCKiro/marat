import React, { useState, useEffect } from 'react';
import { User, Visit } from '../../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
    type: initialData ? initialData.type : 'Psicoterapia',
    date: initialData ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: initialData ? initialData.duration : 60
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
          if (!isEditing && !uniqueTypes.includes(formData.type)) {
            setFormData(prev => ({ ...prev, type: uniqueTypes[0] }));
          }
        }
      } catch (error) {
        console.error("Error fetching therapy types:", error);
      }
    };
    fetchTherapyTypes();
  }, [isEditing]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const operatorName = operators.find(o => o.id === formData.operatorId)?.name || 'Sconosciuto';
    const patientName = patients.find(p => p.id === formData.patientId)?.name || 'Sconosciuto';
    const dateStr = new Date(formData.date).toLocaleDateString('it-IT');
    
    const action = isEditing ? 'modificare' : 'aggiungere';
    
    const confirmMessage = `Riepilogo Visita:
Operatore: ${operatorName}
Paziente: ${patientName}
Tipologia: ${formData.type}
Data: ${dateStr}
Durata: ${formData.duration} minuti

Confermi di voler ${action} questa visita?`;

    if (window.confirm(confirmMessage)) {
      await onSubmit(e);
    }
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <option value={30}>30 minuti</option>
            <option value={60}>1 ora (60 minuti)</option>
            <option value={90}>1 ora e mezza (90 minuti)</option>
            <option value={120}>2 ore (120 minuti)</option>
            <option value={150}>2 ore e mezza (150 minuti)</option>
            <option value={180}>3 ore (180 minuti)</option>
            <option value={210}>3 ore e mezza (210 minuti)</option>
            <option value={240}>4 ore (240 minuti)</option>
            <option value={270}>4 ore e mezza (270 minuti)</option>
            <option value={300}>5 ore (300 minuti)</option>
            <option value={330}>5 ore e mezza (330 minuti)</option>
            <option value={360}>6 ore (360 minuti)</option>
          </select>
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