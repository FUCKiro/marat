import React from 'react';
import UsersList from './UsersList';
import AddOperatorForm from './AddOperatorForm';
import AddPatientForm from './AddPatientForm';
import VisitsList from './VisitsList';
import { User } from '../../types';

interface Props {
  users: User[];
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
  showAddOperator: boolean;
  setShowAddOperator: (show: boolean) => void;
  showAddPatient: boolean;
  setShowAddPatient: (show: boolean) => void;
  error: string;
  success: string;
  onAddOperator: (e: React.FormEvent) => Promise<void>;
  onAddPatient: (e: React.FormEvent) => Promise<void>;
  exporting: boolean;
  onExport: () => Promise<void>;
}

export default function AdminDashboard({
  users,
  onDeleteUser,
  deletingUser,
  showAddOperator,
  setShowAddOperator,
  showAddPatient,
  setShowAddPatient,
  error,
  success,
  onAddOperator,
  onAddPatient,
  exporting,
  onExport
}: Props) {
  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Gestione Utenti</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                setShowAddOperator(!showAddOperator);
                setShowAddPatient(false);
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm"
            >
              {showAddOperator ? 'Annulla' : 'Aggiungi Operatore'}
            </button>
            <button
              onClick={() => {
                setShowAddPatient(!showAddPatient);
                setShowAddOperator(false);
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm"
            >
              {showAddPatient ? 'Annulla' : 'Aggiungi Paziente'}
            </button>
          </div>
        </div>

        {showAddOperator && (
          <AddOperatorForm
            error={error}
            success={success}
            onSubmit={onAddOperator}
          />
        )}

        {showAddPatient && (
          <AddPatientForm
            error={error}
            success={success}
            onSubmit={onAddPatient}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <UsersList
              users={users}
              type="operators"
              title="Lista Operatori"
              onDeleteUser={onDeleteUser}
              deletingUser={deletingUser}
            />
          </div>
          <div>
            <UsersList
              users={users}
              type="patients"
              title="Lista Pazienti"
              onDeleteUser={onDeleteUser}
              deletingUser={deletingUser}
            />
          </div>
        </div>
      </div>

      <VisitsList
        isAdmin={true}
        exporting={exporting}
        onExport={onExport}
      />
    </>
  );
}