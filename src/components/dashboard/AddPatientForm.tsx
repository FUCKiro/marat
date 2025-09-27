import React, { useState } from 'react';

interface Props {
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddPatientForm({ error, success, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    parentSurname: '',
    fiscalCode: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    phone: '',
    billingEmail: '',
    vatNumber: '',
    medicalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <form onSubmit={handleSubmit} className="space-y-6">
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