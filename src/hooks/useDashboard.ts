import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, setDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { utils, writeFile } from 'xlsx';
import { User } from '../types';

export function useDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (currentUser?.role === 'admin') {
        await fetchUsers();
      } else if (currentUser?.role === 'operator') {
        await fetchPatients();
      }
      setLoading(false);
    }
    
    loadData();
  }, [currentUser]);

  async function fetchUsers() {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const usersData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })).sort((a, b) => (a.name || '').localeCompare(b.name || '')) as User[];
    setUsers(usersData);
  }

  async function fetchPatients() {
    try {
      const patientsRef = collection(db, 'users');
      const q = query(patientsRef, where('role', '==', 'patient'));
      const querySnapshot = await getDocs(q);
      const patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      })).sort((a, b) => (a.name || '').localeCompare(b.name || '')) as User[];
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Errore nel caricamento dei pazienti');
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingUser(userId);

    try {
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
      fetchUsers();
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
    const auth = getAuth();
    const currentAdmin = auth.currentUser; // Store current admin user

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.get('email') as string,
        formData.get('password') as string
      );
      
      // Sign back in as admin
      if (currentAdmin) {
        await auth.updateCurrentUser(currentAdmin);
      }

      await setDoc(doc(db, 'users', user.uid), {
        email: formData.get('email'),
        name: formData.get('name'),
        role: 'operator',
        createdAt: new Date()
      });

      setSuccess('Operatore aggiunto con successo');
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
      const formData = new FormData(e.target as HTMLFormElement);
      const patientRef = doc(collection(db, 'users'));
      
      await setDoc(patientRef, {
        name: formData.get('name'),
        role: 'patient',
        createdAt: new Date()
      });

      setSuccess('Paziente aggiunto con successo');
      setShowAddPatient(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData(e.target as HTMLFormElement);
    const operatorId = currentUser?.role === 'admin' ? formData.get('operatorId') : currentUser?.id;

    try {
      const visitData = {
        operatorId,
        patientId: formData.get('patientId'),
        date: Timestamp.fromDate(new Date(formData.get('date') as string)),
        duration: Number(formData.get('duration')),
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, 'visits'), visitData);
      setSuccess('Visita aggiunta con successo');
      setShowAddVisit(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const exportVisitsToExcel = async () => {
    if (!currentUser?.role === 'admin') return;
    setExporting(true);
    setError('');
    setSuccess('');

    try {
      // First, ensure we have fresh data
      await fetchUsers();
      await fetchPatients();

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const visitsRef = collection(db, 'visits');
      const q = query(visitsRef,
        where('date', '>=', Timestamp.fromDate(firstDay)),
        where('date', '<=', Timestamp.fromDate(lastDay))
      );
      const querySnapshot = await getDocs(q);
      
      const visitsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      }));

      const patientSummary = {};
      visitsData.forEach(visit => {
        if (!patientSummary[visit.patientId]) {
          const patient = users.find(p => p.id === visit.patientId && p.role === 'patient');
          patientSummary[visit.patientId] = {
            name: patient?.name || 'Paziente non trovato',
            totalMinutes: 0,
            visits: [],
            operators: new Set()
          };
        }
        patientSummary[visit.patientId].totalMinutes += visit.duration;
        patientSummary[visit.patientId].operators.add(visit.operatorId);
        patientSummary[visit.patientId].visits.push({
          date: visit.date.toLocaleDateString(),
          operator: users.find(u => u.id === visit.operatorId)?.name || 'Operatore non trovato',
          duration: visit.duration
        });
      });

      const worksheets = [];

      const patientSummaryData = Object.entries(patientSummary).map(([_, data]: [string, any]) => ({
        'Paziente': data.name,
        'Ore Totali': (data.totalMinutes / 60).toFixed(2),
        'Numero Visite': data.visits.length,
        'Operatori': Array.from(data.operators)
          .map(id => users.find(u => u.id === id)?.name || 'Operatore non trovato')
          .join(', ')
      }));
      
      const patientSummaryWs = utils.json_to_sheet(patientSummaryData);
      worksheets.push(['Riepilogo', patientSummaryWs]);

      const detailData = visitsData.map(visit => ({
        'Data': visit.date.toLocaleDateString(),
        'Paziente': users.find(p => p.id === visit.patientId && p.role === 'patient')?.name || 'Paziente sconosciuto',
        'Operatore': users.find(u => u.id === visit.operatorId)?.name || 'Operatore sconosciuto',
        'Durata (minuti)': visit.duration,
        'Durata (ore)': (visit.duration / 60).toFixed(2)
      }));

      const detailWs = utils.json_to_sheet(detailData);
      worksheets.push(['Dettaglio Visite', detailWs]);

      const wb = utils.book_new();
      worksheets.forEach(([name, ws]) => {
        utils.book_append_sheet(wb, ws, name);
      });

      const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
      const fileName = `Visite_${monthNames[now.getMonth()]}_${now.getFullYear()}.xlsx`;

      writeFile(wb, fileName);
      setSuccess('Report esportato con successo');
    } catch (error) {
      console.error('Error exporting visits:', error);
      setError('Errore durante l\'esportazione del report');
    } finally {
      setExporting(false);
    }
  };

  return {
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
  };
}