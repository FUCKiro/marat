import React, { useState } from 'react';
import UsersList from './UsersList';
import AddOperatorForm from './AddOperatorForm';
import AddPatientForm from './AddPatientForm';
import AdminVisitForm from './AdminVisitForm';
import VisitsList from './VisitsList';
import TherapyPricesManager from './TherapyPricesManager';
import MonthlyInvoicing from './MonthlyInvoicing';
import InvoicesList from '../invoice/InvoicesList';
import EditUserForm from './EditUserForm';
import { User, Visit } from '../../types';
import { Euro, Users, Calendar, FileText, History } from 'lucide-react';

interface Props {
  users: User[];
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
  showAddOperator: boolean;
  setShowAddOperator: (show: boolean) => void;
  showAddPatient: boolean;
  setShowAddPatient: (show: boolean) => void;
  showAddVisit: boolean;
  setShowAddVisit: (show: boolean) => void;
  error: string;
  success: string;
  onAddOperator: (e: React.FormEvent) => Promise<void>;
  onAddPatient: (e: React.FormEvent) => Promise<void>;
  onAddVisit: (e: React.FormEvent) => Promise<void>;
  exporting: boolean;
  onExport: () => Promise<void>;
  editingVisit: Visit | null;
  setEditingVisit: (visit: Visit | null) => void;
  onEditVisit: (e: React.FormEvent) => Promise<void>;
  deletingVisit: string | null;
  onDeleteVisit: (visitId: string) => Promise<void>;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  onEditUser: (e: React.FormEvent) => Promise<void>;
}

export default function AdminDashboard({
  users,
  onDeleteUser,
  deletingUser,
  showAddOperator,
  setShowAddOperator,
  showAddPatient,
  setShowAddPatient,
  showAddVisit,
  setShowAddVisit,
  error,
  success,
  onAddOperator,
  onAddPatient,
  onAddVisit,
  exporting,
  onExport,
  editingVisit,
  setEditingVisit,
  onEditVisit,
  deletingVisit,
  onDeleteVisit,
  editingUser,
  setEditingUser,
  onEditUser
}: Props) {
  const operators = users.filter(user => user.role === 'operator');
  const patients = users.filter(user => user.role === 'patient');
  const [activeTab, setActiveTab] = useState<'users' | 'visits' | 'prices' | 'invoicing' | 'history'>('users');

  const tabs = [
      { id: 'users' as const, label: 'Gestione Utenti', icon: Users },
      { id: 'visits' as const, label: 'Gestione Visite', icon: Calendar },
      { id: 'prices' as const, label: 'Prezzi Terapie', icon: Euro },
      { id: 'invoicing' as const, label: 'Fatturazione', icon: FileText },
      { id: 'history' as const, label: 'Storico Fatture', icon: History }
    ];

  return (
    <>
      {/* Tab Navigation - Responsive Design */}
      <div className="mb-8">
        {/* Desktop Layout */}
        <div className="hidden md:block border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Layout - Compact Grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } border-2 rounded-lg p-3 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-b border-gray-200"></div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
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
              <button
                onClick={() => {
                  setShowAddVisit(!showAddVisit);
                  setShowAddOperator(false);
                  setShowAddPatient(false);
                }}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm"
              >
                {showAddVisit ? 'Annulla' : 'Aggiungi Visita'}
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

          {showAddVisit && (
            <AdminVisitForm
              error={error}
              success={success}
              onSubmit={onAddVisit}
              operators={operators}
              patients={patients}
              isEditing={false}
            />
          )}

          {editingVisit && !showAddVisit && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-2xl">
                <AdminVisitForm
                  error={error}
                  success={success}
                  onSubmit={onEditVisit}
                  operators={operators}
                  patients={patients}
                  initialData={editingVisit}
                  isEditing={true}
                  onCancel={() => setEditingVisit(null)}
                />
              </div>
            </div>
          )}

          {editingUser && (
            <EditUserForm
              user={editingUser}
              error={error}
              success={success}
              onSubmit={onEditUser}
              onCancel={() => setEditingUser(null)}
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
                onEditUser={setEditingUser}
              />
            </div>
            <div>
              <UsersList
                users={users}
                type="patients"
                title="Lista Pazienti"
                onDeleteUser={onDeleteUser}
                deletingUser={deletingUser}
                onEditUser={setEditingUser}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visits' && (
        <VisitsList
          isAdmin={true}
          exporting={exporting}
          onExport={onExport}
          onEdit={setEditingVisit}
          onDelete={onDeleteVisit}
          deletingVisit={deletingVisit}
        />
      )}

      {activeTab === 'prices' && (
        <TherapyPricesManager />
      )}

      {activeTab === 'invoicing' && (
        <MonthlyInvoicing />
      )}

      {activeTab === 'history' && (
        <InvoicesList />
      )}
    </>
  );
}