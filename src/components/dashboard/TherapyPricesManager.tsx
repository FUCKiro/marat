import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { TherapyPrice } from '../../types';
import { Euro, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function TherapyPricesManager() {
  const { currentUser } = useAuth();
  const [prices, setPrices] = useState<TherapyPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPrice, setEditingPrice] = useState<TherapyPrice | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const therapyTypes = [
    'Psicoterapia',
    'Psicoeducazione', 
    'ABA',
    'Logopedia',
    'Neuropsicomotricità',
    'Gruppo',
    'GLO'
  ];

  const fetchTherapyPrices = async () => {
    if (!db) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'therapyPrices'));
      const pricesData: TherapyPrice[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pricesData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
          updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined
        } as TherapyPrice);
      });
      setPrices(pricesData);
    } catch (error) {
      console.error('Errore nel caricamento dei prezzi:', error);
      setError('Errore nel caricamento dei prezzi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapyPrices();
  }, []);

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      setError('Database non configurato');
      return;
    }

    setError('');
    setSuccess('');

    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get('type') as string;
    const pricePerHour = parseFloat(formData.get('pricePerHour') as string);
    const notes = formData.get('notes') as string;

    // Check if price already exists for this therapy type
    if (prices.some(p => p.type === type)) {
      setError('Prezzo già esistente per questa tipologia di terapia');
      return;
    }

    try {
      const priceData = {
        type,
        pricePerHour,
        notes: notes || '',
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, 'therapyPrices'), priceData);
      setSuccess('Prezzo aggiunto con successo');
      setShowAddForm(false);
      await fetchTherapyPrices();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice || !db) return;

    setError('');
    setSuccess('');

    const formData = new FormData(e.target as HTMLFormElement);
    const pricePerHour = parseFloat(formData.get('pricePerHour') as string);
    const notes = formData.get('notes') as string;

    try {
      const updateData = {
        pricePerHour,
        notes: notes || '',
        updatedAt: Timestamp.fromDate(new Date())
      };

      await updateDoc(doc(db, 'therapyPrices', editingPrice.id), updateData);
      setSuccess('Prezzo aggiornato con successo');
      setEditingPrice(null);
      await fetchTherapyPrices();
    } catch (err: any) {
      console.error('Errore nel salvataggio del prezzo:', err);
      console.log('Utente corrente:', currentUser);
      console.log('Ruolo utente:', currentUser?.role);
      console.log('Database configurato:', !!db);
      setError(`Errore nel salvataggio: ${err.message || err.code || 'Errore sconosciuto'}`);
    }
  };

  const handleDeletePrice = async (priceId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prezzo?') || !db) return;

    try {
      await deleteDoc(doc(db, 'therapyPrices', priceId));
      setSuccess('Prezzo eliminato con successo');
      await fetchTherapyPrices();
    } catch (err: any) {
      setError('Errore nell\'eliminazione del prezzo');
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Euro className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Gestione Prezzi Terapie
            </h2>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Annulla' : 'Aggiungi Prezzo'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form onSubmit={handleAddPrice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipologia Terapia
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Seleziona tipologia</option>
                  {therapyTypes
                    .filter(type => !prices.some(p => p.type === type))
                    .map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
                  Prezzo per Ora (€ IVA inclusa)
                </label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  step="0.01"
                  min="0"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Note (opzionale)
                </label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Annulla
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salva Prezzo
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border-t border-gray-200">
        {prices.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <Euro className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>Nessun prezzo configurato</p>
            <p className="text-sm">Aggiungi i prezzi per le diverse tipologie di terapia</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {prices.map((price) => (
              <li key={price.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                {editingPrice?.id === price.id ? (
                  <form onSubmit={handleUpdatePrice} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Prezzo per Ora (€)
                        </label>
                        <input
                          type="number"
                          name="pricePerHour"
                          step="0.01"
                          min="0"
                          defaultValue={price.pricePerHour}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Note
                        </label>
                        <input
                          type="text"
                          name="notes"
                          defaultValue={price.notes || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingPrice(null)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Salva
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-teal-600">
                        {price.type}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        €{price.pricePerHour.toFixed(2)}/ora
                      </div>
                      {price.notes && (
                        <div className="text-sm text-gray-500 mt-1">
                          {price.notes}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Creato: {price.createdAt.toLocaleDateString('it-IT')}
                        {price.updatedAt && (
                          <span> • Aggiornato: {price.updatedAt.toLocaleDateString('it-IT')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingPrice(price)}
                        className="text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrice(price.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}