import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { hasFirebaseConfig } from '../config/firebase';
import SEO from '../components/SEO';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import OperatorDashboard from '../components/dashboard/OperatorDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser && !hasFirebaseConfig) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!hasFirebaseConfig) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Firebase non configurato
            </h2>
            <p className="text-gray-600 mb-6">
              Per utilizzare questa funzionalità, è necessario configurare Firebase.
              Contatta l'amministratore del sistema per assistenza.
            </p>
            <a
              href="/"
              className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Torna alla Home
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    loading,
    error,
    success,
    users,
    patients,
    showAddOperator,
    setShowAddOperator,
    showAddPatient,
    setShowAddPatient,
    showAddVisit,
    setShowAddVisit,
    deletingUser,
    exporting,
    handleDeleteUser,
    handleAddOperator,
    handleAddPatient,
    handleAddVisit,
    exportVisitsToExcel
  } = useDashboard();

  if (!currentUser || loading) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Layout>
      <SEO title="Dashboard" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard {currentUser?.role === 'admin' ? 'Amministratore' : 
                        currentUser?.role === 'operator' ? 'Operatore' : 'Paziente'}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {currentUser?.role === 'admin' && (
            <AdminDashboard
              users={users}
              onDeleteUser={handleDeleteUser}
              deletingUser={deletingUser}
              showAddOperator={showAddOperator}
              setShowAddOperator={setShowAddOperator}
              showAddPatient={showAddPatient}
              setShowAddPatient={setShowAddPatient}
              error={error}
              success={success}
              onAddOperator={handleAddOperator}
              onAddPatient={handleAddPatient}
              onAddVisit={handleAddVisit}
              showAddVisit={showAddVisit}
              setShowAddVisit={setShowAddVisit}
              exporting={exporting}
              onExport={exportVisitsToExcel}
            />
          )}
          
          {currentUser?.role === 'operator' && (
            <OperatorDashboard
              showAddVisit={showAddVisit}
              setShowAddVisit={setShowAddVisit}
              error={error}
              success={success}
              onAddVisit={handleAddVisit}
              patients={patients}
            />
          )}

          {currentUser?.role === 'patient' && (
            <PatientDashboard />
          )}
        </div>
      </div>
    </Layout>
  );
}