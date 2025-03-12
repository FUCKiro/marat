import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { hasFirebaseConfig } from '../config/firebase';
import { utils, writeFile } from 'xlsx';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, setDoc, doc, addDoc, deleteDoc, startOfMonth, endOfMonth } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Visit, User } from '../types';
import SEO from '../components/SEO';

export default function Dashboard() {
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

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [patientsMap, setPatientsMap] = useState<Record<string, User>>({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [patients, setPatients] = useState<User[]>([]);
  const [newVisit, setNewVisit] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60
  });
  const [newOperatorData, setNewOperatorData] = useState({
    email: '',
    password: '',
    name: ''
  });
  
  const [newPatientData, setNewPatientData] = useState({
    name: ''
  });
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exporting, setExporting] = useState(false);

  const exportVisitsToExcel = async () => {
    if (!currentUser?.role === 'admin') return;
    setExporting(true);

    try {
      // Get current month's start and end dates
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Query visits for current month
      const visitsRef = collection(db, 'visits');
      const q = query(visitsRef,
        where('date', '>=', Timestamp.fromDate(firstDay)),
        where('date', '<=', Timestamp.fromDate(lastDay))
      );
      const querySnapshot = await getDocs(q);
      
      // Process visits data
      const visitsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      }));

      // Create patient summary first
      const patientSummary = {};
      visitsData.forEach(visit => {
        if (!patientSummary[visit.patientId]) {
          patientSummary[visit.patientId] = {
            name: patientsMap[visit.patientId]?.name || 'Paziente non trovato',
            totalMinutes: 0,
            visits: [],
            operators: new Set()
          };
        }
        patientSummary[visit.patientId].totalMinutes += visit.duration;
        patientSummary[visit.patientId].operators.add(visit.operatorId);
        patientSummary[visit.patientId].visits.push({
          date: visit.date.toLocaleDateString(),
          operator: usersMap[visit.operatorId]?.name || 'Operatore non trovato',
          duration: visit.duration
        });
      });

      // Prepare Excel data
      const worksheets = [];

      // Patient summary worksheet
      const patientSummaryData = Object.entries(patientSummary).map(([_, data]: [string, any]) => ({
        'Paziente': data.name,
        'Ore Totali': (data.totalMinutes / 60).toFixed(2),
        'Numero Visite': data.visits.length,
        'Operatori': Array.from(data.operators).map(id => usersMap[id]?.name || 'Operatore non trovato').join(', ')
      }));
      
      const patientSummaryWs = utils.json_to_sheet(patientSummaryData);
      worksheets.push(['Riepilogo', patientSummaryWs]);

      // Detail worksheet
      const detailData = visitsData.map(visit => ({
        'Data': visit.date.toLocaleDateString(),
        'Paziente': patientsMap[visit.patientId]?.name || 'Paziente sconosciuto',
        'Operatore': usersMap[visit.operatorId]?.name || 'Operatore sconosciuto',
        'Durata (minuti)': visit.duration,
        'Durata (ore)': (visit.duration / 60).toFixed(2)
      }));

      const detailWs = utils.json_to_sheet(detailData);
      worksheets.push(['Dettaglio Visite', detailWs]);

      // Create workbook
      const wb = utils.book_new();
      worksheets.forEach(([name, ws]) => {
        utils.book_append_sheet(wb, ws, name);
      });

      // Generate filename with current month and year
      const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
      const fileName = `Visite_${monthNames[now.getMonth()]}_${now.getFullYear()}.xlsx`;

      // Save file
      writeFile(wb, fileName);
      setSuccess('Report esportato con successo');
    } catch (error) {
      console.error('Error exporting visits:', error);
      setError('Errore durante l\'esportazione del report');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingUser(userId);

    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete related visits
      const visitsRef = collection(db, 'visits');
      const q = query(visitsRef, 
        where('patientId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      setSuccess('Utente eliminato con successo');
      fetchUsers(); // Refresh users list
    } catch (err: any) {
      setError('Errore durante l\'eliminazione dell\'utente');
      console.error(err);
    } finally {
      setDeletingUser(null);
    }
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newOperatorData.email,
        newOperatorData.password
      );

      await setDoc(doc(db, 'users', user.uid), {
        email: newOperatorData.email,
        name: newOperatorData.name,
        role: 'operator',
        createdAt: new Date()
      });

      setSuccess('Operatore aggiunto con successo');
      setNewOperatorData({ email: '', password: '', name: '' });
      setShowAddOperator(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Generate a unique ID for the patient
      const patientRef = doc(collection(db, 'users'));
      
      await setDoc(patientRef, {
        name: newPatientData.name,
        role: 'patient',
        createdAt: new Date()
      });

      setSuccess('Paziente aggiunto con successo');
      setNewPatientData({ name: '' });
      setShowAddPatient(false);
      fetchUsers(); // Refresh users list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    if (currentUser?.role === 'admin') {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      })) as User[];
      setUsers(usersData);
    }
  };

  const fetchPatients = async () => {
    try {
      const patientsRef = collection(db, 'users');
      const q = query(patientsRef, where('role', '==', 'patient'));
      const querySnapshot = await getDocs(q);
      const patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      })) as User[];
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Errore nel caricamento dei pazienti');
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const visitData = {
        operatorId: currentUser!.id,
        patientId: newVisit.patientId,
        date: Timestamp.fromDate(new Date(newVisit.date)),
        duration: Number(newVisit.duration),
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, 'visits'), visitData);
      setSuccess('Visita aggiunta con successo');
      setNewVisit({
        patientId: '',
        date: new Date().toISOString().split('T')[0],
        duration: 60
      });
      setShowAddVisit(false);
      
      // Refresh visits list
      const visitsRef = collection(db, 'visits');
      const q = query(visitsRef, where('operatorId', '==', currentUser!.id));
      const querySnapshot = await getDocs(q);
      const visitsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      })) as Visit[];
      setVisits(visitsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Fetch patients for operators
    if (currentUser.role === 'operator') {
      fetchPatients();
    }

    if (currentUser.role === 'admin') {
      fetchUsers();
    }

    async function fetchVisits() {
      try {
        const visitsRef = collection(db, 'visits');
        const usersRef = collection(db, 'users');
        const patientsRef = collection(db, 'users');
        let q = query(visitsRef);
        
        if (currentUser.role === 'admin') {
          // Admin sees all visits
          // Keep default query
        } else if (currentUser.role === 'operator') {
          // Operators see their own visits
          q = query(visitsRef, where('operatorId', '==', currentUser.id));
        } else {
          // Patients see visits they're involved in
          q = query(visitsRef, where('patientId', '==', currentUser.id));
        }

        const querySnapshot = await getDocs(q);
        const visitsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: (doc.data().date as Timestamp).toDate(),
          createdAt: (doc.data().createdAt as Timestamp).toDate()
        })) as Visit[];
        
        // Fetch all users data and create a map
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.reduce((acc, doc) => ({
          ...acc,
          [doc.id]: { id: doc.id, ...doc.data() } as User
        }), {} as Record<string, User>);
        setUsersMap(usersData);
        
        // Fetch all patients data and create a map
        const patientsQuery = query(patientsRef, where('role', '==', 'patient'));
        const patientsSnapshot = await getDocs(patientsQuery);
        const patientsData = patientsSnapshot.docs.reduce((acc, doc) => ({
          ...acc,
          [doc.id]: { id: doc.id, ...doc.data() } as User
        }), {} as Record<string, User>);
        setPatientsMap(patientsData);

        // Sort visits by date in descending order (most recent first)
        const sortedVisits = visitsData.sort((a, b) => b.date.getTime() - a.date.getTime());
        setVisits(sortedVisits);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setLoading(false);
      }
    }

    fetchVisits();
  }, [currentUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <SEO title="Dashboard" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Dashboard {currentUser?.role === 'admin' ? 'Amministratore' : 
                      currentUser?.role === 'operator' ? 'Operatore' : 'Paziente'}
          </h1>
          
          {currentUser?.role === 'admin' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestione</h2>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setShowAddOperator(!showAddOperator);
                      setShowAddPatient(false);
                    }}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    {showAddOperator ? 'Annulla' : 'Aggiungi Operatore'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddPatient(!showAddPatient);
                      setShowAddOperator(false);
                    }}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    {showAddPatient ? 'Annulla' : 'Aggiungi Paziente'}
                  </button>
                </div>
              </div>

              {showAddOperator && (
                <div className="mt-4 bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Aggiungi Nuovo Operatore</h2>
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
                  <form onSubmit={handleAddOperator} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome e Cognome
                      </label>
                      <input
                        type="text"
                        required
                        value={newOperatorData.name}
                        onChange={(e) => setNewOperatorData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={newOperatorData.email}
                        onChange={(e) => setNewOperatorData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newOperatorData.password}
                        onChange={(e) => setNewOperatorData(prev => ({ ...prev, password: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Aggiungi Operatore
                    </button>
                  </form>
                </div>
              )}

              {showAddPatient && (
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
                  <form onSubmit={handleAddPatient} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome e Cognome
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatientData.name}
                        onChange={(e) => setNewPatientData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Aggiungi Paziente
                    </button>
                  </form>
                </div>
              )}

              {/* Users List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Lista Utenti
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <li key={user.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-teal-600">
                              {user.name}
                            </div>
                            {user.email && (
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'operator' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Amministratore' :
                               user.role === 'operator' ? 'Operatore' : 'Paziente'}
                            </span>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deletingUser === user.id}
                                className="ml-4 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              >
                                {deletingUser === user.id ? 'Eliminazione...' : 'Elimina'}
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {currentUser?.role === 'operator' && (
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
                  <form onSubmit={handleAddVisit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Paziente
                      </label>
                      <select
                        required
                        value={newVisit.patientId}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, patientId: e.target.value }))}
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
                        Data
                      </label>
                      <input
                        type="date"
                        required
                        value={newVisit.date}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Durata (minuti)
                      </label>
                      <input
                        type="number"
                        required
                        min="15"
                        step="15"
                        value={newVisit.duration}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Aggiungi Visita
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Visite {currentUser?.role === 'admin' && 'del mese'}
                </h2>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={exportVisitsToExcel}
                    disabled={exporting}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {exporting ? 'Esportazione in corso...' : 'Esporta in Excel'}
                  </button>
                )}
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {visits.map((visit) => (
                    <li key={visit.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-teal-600">
                            {visit.date.toLocaleDateString('it-IT', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            Paziente: {patientsMap[visit.patientId]?.name || 'Paziente non trovato'}
                          </div>
                          {currentUser?.role === 'admin' && (
                            <div className="text-sm text-gray-500">
                              Operatore: {usersMap[visit.operatorId]?.name || 'Operatore non trovato'}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Durata: {visit.duration} minuti
                        </div>
                      </div>
                      {visit.notes && (
                        <div className="mt-2 text-sm text-gray-500">
                          {visit.notes}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}