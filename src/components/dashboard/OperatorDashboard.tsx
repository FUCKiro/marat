import React from 'react';
import AddVisitForm from './AddVisitForm';
import VisitsList from './VisitsList';
import { User } from '../../types';

interface Props {
  showAddVisit: boolean;
  setShowAddVisit: (show: boolean) => void;
  error: string;
  success: string;
  onAddVisit: (e: React.FormEvent) => Promise<void>;
  patients: User[];
}

export default function OperatorDashboard({
  showAddVisit,
  setShowAddVisit,
  error,
  success,
  onAddVisit,
  patients
}: Props) {
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Gestione Visite</h2>
          <button
            onClick={() => setShowAddVisit(!showAddVisit)}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            {showAddVisit ? 'Annulla' : 'Aggiungi Visita'}
          </button>
        </div>

        {showAddVisit && (
          <AddVisitForm
            error={error}
            success={success}
            onSubmit={onAddVisit}
            patients={patients}
          />
        )}
      </div>

      <VisitsList isAdmin={false} />
    </>
  );
}