import React, { useState } from 'react';
import { User, Patient } from '../../types';

interface Props {
  user: User;
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export default function EditUserForm({ user, error, success, onSubmit, onCancel }: Props) {
  // Cast user to Patient if it's a patient to access additional fields
  const patient = user.role === 'patient' ? user as Patient : null;
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    // Patient-specific fields
    parentName: patient?.parentName || '',
    parentSurname: patient?.parentSurname || '',
    fiscalCode: patient?.billingInfo?.fiscalCode || '',
    address: patient?.billingInfo?.address || '',
    city: patient?.billingInfo?.city || '',
    postalCode: patient?.billingInfo?.postalCode || '',
    province: patient?.billingInfo?.province || '',
    phone: patient?.billingInfo?.phone || '',
    billingEmail: patient?.billingInfo?.email || '',
    vatNumber: patient?.billingInfo?.vatNumber || '',
    medicalNotes: patient?.medicalNotes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Se l'utente è un operatore, assicuriamoci che l'email finisca con @maratonda.it
    if (user.role === 'operator') {
      if (value === '@maratonda.it') {
        setFormData(prev => ({ ...prev, email: '@maratonda.it' }));
        return;
      }
      
      // Rimuovi @maratonda.it se presente nell'input
      const username = value.replace('@maratonda.it', '');
      setFormData(prev => ({
        ...prev,
        email: username + '@maratonda.it'
      }));
    } else {
      // Per i pazienti, permetti qualsiasi email
      setFormData(prev => ({
        ...prev,
        email: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Modifica {user.role === 'operator' ? 'Operatore' : 'Paziente'}
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
        <form onSubmit={onSubmit} className={user.role === 'patient' ? 'space-y-6' : 'space-y-4'}>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="role" value={user.role} />
          
          {user.role === 'operator' ? (
            // Form semplificato per operatori
            <>
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
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="nome.cognome"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  L'email degli operatori deve terminare con @maratonda.it
                </p>
              </div>
            </>
          ) : (
            // Form completo per pazienti
            <>
              {/* Dati del Paziente */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dati del Paziente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome e Cognome del Paziente *
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
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Note Mediche (opzionale)
                  </label>
                  <textarea
                    name="medicalNotes"
                    rows={3}
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Eventuali note mediche o informazioni importanti..."
                  />
                </div>
              </div>

              {/* Dati del Genitore/Tutore */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dati del Genitore/Tutore</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome del Genitore *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cognome del Genitore *
                    </label>
                    <input
                      type="text"
                      name="parentSurname"
                      required
                      value={formData.parentSurname}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dati per la Fatturazione */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dati per la Fatturazione</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Codice Fiscale *
                    </label>
                    <input
                      type="text"
                      name="fiscalCode"
                      required
                      value={formData.fiscalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="RSSMRA80A01H501Z"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Partita IVA (opzionale)
                    </label>
                    <input
                      type="text"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="12345678901"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Indirizzo *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="Via Roma, 123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Città *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CAP *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="00100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="RM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefono (opzionale)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email per Fatturazione (opzionale)
                    </label>
                    <input
                      type="email"
                      name="billingEmail"
                      value={formData.billingEmail}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="genitore@email.com"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Salva Modifiche
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}