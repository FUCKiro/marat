import React from 'react';
import AddVisitForm from './AddVisitForm';
import AdminVisitForm from './AdminVisitForm';
import VisitsList from './VisitsList';
import { User, Visit } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  showAddVisit: boolean;
  setShowAddVisit: (show: boolean) => void;
  error: string;
  success: string;
  onAddVisit: (e: React.FormEvent) => Promise<void>;
  patients: User[];
  editingVisit: Visit | null;
  setEditingVisit: (visit: Visit | null) => void;
  onEditVisit: (e: React.FormEvent) => Promise<void>;
  deletingVisit: string | null;
  onDeleteVisit: (visitId: string) => Promise<void>;
}

export default function OperatorDashboard({
  showAddVisit,
  setShowAddVisit,
  error,
  success,
  onAddVisit,
  patients,
  editingVisit,
  setEditingVisit,
  onEditVisit,
  deletingVisit,
  onDeleteVisit
}: Props) {
  const { currentUser } = useAuth();

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

      <VisitsList 
        isAdmin={false} 
        onEdit={setEditingVisit}
        onDelete={onDeleteVisit}
        deletingVisit={deletingVisit}
      />

      {editingVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <AdminVisitForm
              error={error}
              success={success}
              onSubmit={onEditVisit}
              operators={currentUser ? [currentUser] : []}
              patients={patients}
              initialData={editingVisit}
              isEditing={true}
              onCancel={() => setEditingVisit(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}