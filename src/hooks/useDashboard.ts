import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, setDoc, doc, addDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { utils, writeFile } from 'xlsx';
import { User, Visit } from '../types';
import { useVisits } from './useVisits';

export function useDashboard() {
  const { currentUser } = useAuth();
  const { fetchVisits } = useVisits();
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
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    let unsubscribeUsers: (() => void) | undefined;
    let unsubscribePatients: (() => void) | undefined;

    if (currentUser?.role === 'admin') {
      // Listen to all users
      unsubscribeUsers = onSnapshot(
        collection(db!, 'users'),
        (snapshot) => {
          const usersData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: (doc.data().createdAt as Timestamp).toDate()
            }))
            .sort((a, b) => ((a as User).name || '').localeCompare(((b as User).name || '')));
          setUsers(usersData as User[]);
        },
        (error) => {
          console.error('Errore nel caricamento utenti (realtime):', error);
          setError('Errore nel caricamento utenti');
        }
      );

      // Listen to patients
      unsubscribePatients = onSnapshot(
        query(collection(db!, 'users'), where('role', '==', 'patient')),
        (snapshot) => {
          const patientsData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: (doc.data().createdAt as Timestamp).toDate()
            }))
            .sort((a, b) => ((a as User).name || '').localeCompare(((b as User).name || '')));
          setPatients(patientsData as User[]);
        },
        (error) => {
          console.error('Errore nel caricamento pazienti (realtime):', error);
          setError('Errore nel caricamento pazienti');
        }
      );
    } else if (currentUser?.role === 'operator') {
      // Operators only need patients
      unsubscribePatients = onSnapshot(
        query(collection(db!, 'users'), where('role', '==', 'patient')),
        (snapshot) => {
          const patientsData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: (doc.data().createdAt as Timestamp).toDate()
            }))
            .sort((a, b) => ((a as User).name || '').localeCompare(((b as User).name || '')));
          setPatients(patientsData as User[]);
        },
        (error) => {
          console.error('Errore nel caricamento pazienti (realtime):', error);
          setError('Errore nel caricamento pazienti');
        }
      );
    }

    setLoading(false);

    return () => {
      unsubscribeUsers?.();
      unsubscribePatients?.();
    };
  }, [currentUser]);

  async function fetchUsers() {
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    
    const usersRef = collection(db!, 'users');
    const querySnapshot = await getDocs(usersRef);
    const usersData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })).sort((a, b) => ((a as User).name || '').localeCompare(((b as User).name || ''))) as User[];
    setUsers(usersData);
  }

  async function fetchPatients() {
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    
    const usersRef = collection(db!, 'users');
    const q = query(usersRef, where('role', '==', 'patient'));
    const querySnapshot = await getDocs(q);
    const patientsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })).sort((a, b) => ((a as User).name || '').localeCompare(((b as User).name || ''))) as User[];
    setPatients(patientsData);
  }

  const handleDeleteUser = async (userId: string) => {
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    if (!window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingUser(userId);

    try {
      await deleteDoc(doc(db!, 'users', userId));
      
      // Delete related visits
      const visitsRef = collection(db!, 'visits');
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
    
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Create a secondary Firebase app instance for user creation
      const { initializeApp, deleteApp, getApps } = await import('firebase/app');
      const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createSecondaryUser } = await import('firebase/auth');
      
      // Generate unique app name to avoid conflicts
      const appName = `secondary-operator-${Date.now()}`;
      
      // Check if app already exists and delete it
      const existingApps = getApps();
      const existingApp = existingApps.find(app => app.name === appName);
      if (existingApp) {
        await deleteApp(existingApp);
      }
      
      const secondaryApp = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      }, appName);
      
      const secondaryAuth = getSecondaryAuth(secondaryApp);
      
      const { user } = await createSecondaryUser(
        secondaryAuth,
        formData.get('email') as string,
        formData.get('password') as string
      );

      await setDoc(doc(db!, 'users', user.uid), {
        email: formData.get('email'),
        name: formData.get('name'),
        role: 'operator',
        createdAt: Timestamp.now()
      });

      // Delete the secondary app to clean up
      await deleteApp(secondaryApp);

      setSuccess('Operatore aggiunto con successo');
      setShowAddOperator(false);
      fetchUsers();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const toTitleCase = (s: any) =>
        String(s || '')
          .trim()
          .split(' ')
          .filter(Boolean)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      
      // Generate a unique ID for the patient (since we're not using Firebase Auth)
      const patientId = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save patient data directly to Firestore (no Firebase Auth account needed)
      await setDoc(doc(db!, 'users', patientId), {
        id: patientId,
        name: toTitleCase(formData.get('name')),
        role: 'patient',
        parentName: toTitleCase(formData.get('parentName')),
        parentSurname: toTitleCase(formData.get('parentSurname')),
        medicalNotes: formData.get('medicalNotes') || '',
        billingInfo: {
          parentName: toTitleCase(formData.get('parentName')),
          parentSurname: toTitleCase(formData.get('parentSurname')),
          fiscalCode: String(formData.get('fiscalCode') || '').toUpperCase(),
          address: toTitleCase(formData.get('address')),
          city: toTitleCase(formData.get('city')),
          postalCode: formData.get('postalCode'),
          province: String(formData.get('province') || '').toUpperCase(),
          phone: formData.get('phone'),
          email: formData.get('billingEmail'),
          vatNumber: formData.get('vatNumber') || ''
        },
        createdAt: Timestamp.now(),
        // Flag to indicate this is a patient without Firebase Auth
        hasAuthAccount: false
      });

      setSuccess('Paziente aggiunto con successo');
      setShowAddPatient(false);
      fetchUsers();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const visitData = {
        patientId: formData.get('patientId'),
        operatorId: currentUser?.id, // Uso id invece di uid per User type
        type: formData.get('type'),
        duration: parseInt(formData.get('duration') as string),
        date: Timestamp.fromDate(new Date(formData.get('date') as string)),
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db!, 'visits'), visitData);
      setSuccess('Visita aggiunta con successo');
      setShowAddVisit(false);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError('Errore durante l\'aggiunta della visita');
      console.error(err);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const userId = formData.get('userId') as string;
      const name = formData.get('name') as string;
      const role = formData.get('role') as string;

      if (role === 'patient') {
        await updateDoc(doc(db!, 'users', userId), {
          name,
          parentName: formData.get('parentName'),
          parentSurname: formData.get('parentSurname'),
          medicalNotes: formData.get('medicalNotes') || '',
          billingInfo: {
            parentName: formData.get('parentName'),
            parentSurname: formData.get('parentSurname'),
            fiscalCode: formData.get('fiscalCode'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            province: formData.get('province'),
            phone: formData.get('phone'),
            email: formData.get('billingEmail'),
            vatNumber: formData.get('vatNumber') || ''
          }
        });
      } else {
        // For operators, only update basic fields
        const email = formData.get('email') as string;
        await updateDoc(doc(db!, 'users', userId), {
          name,
          email
        });
      }

      setSuccess('Utente modificato con successo');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError('Errore durante la modifica dell\'utente');
      console.error(err);
    }
  };

  const exportVisitsToExcel = async () => {
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const visitsRef = collection(db!, 'visits');
      const querySnapshot = await getDocs(visitsRef);
      
      const visits = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      })) as Visit[];

      // Group visits by patient
      const visitsByPatient: { [key: string]: Visit[] } = {};
      visits.forEach(visit => {
        if (!visitsByPatient[visit.patientId]) {
          visitsByPatient[visit.patientId] = [];
        }
        visitsByPatient[visit.patientId].push(visit);
      });

      // Create Excel data
      const excelData: any[] = [];
      
      for (const patientId in visitsByPatient) {
        const patientVisits = visitsByPatient[patientId];
        const patient = users.find(u => u.id === patientId) || patients.find(p => p.id === patientId);
        
        patientVisits.forEach(visit => {
          const operator = users.find(u => u.id === visit.operatorId);
          excelData.push({
            'Paziente': patient?.name || 'N/A',
            'Operatore': operator?.name || 'N/A',
            'Tipo': visit.type,
            'Data': visit.date.toLocaleDateString('it-IT'),
            'Durata (min)': visit.duration,
            'Note': visit.notes || ''
          });
        });
      }

      // Create workbook and worksheet
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(excelData);
      utils.book_append_sheet(wb, ws, 'Visite');

      // Save file
      writeFile(wb, `visite_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setSuccess('Export completato con successo');
    } catch (err: any) {
      setError('Errore durante l\'export');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleEditVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }
    
    setError('');
    setSuccess('');

    if (!editingVisit) return;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const visitData = {
        operatorId: formData.get('operatorId'),
        patientId: formData.get('patientId'),
        type: formData.get('type'),
        date: Timestamp.fromDate(new Date(formData.get('date') as string)),
        duration: Number(formData.get('duration')),
        updatedAt: Timestamp.fromDate(new Date())
      };

      await updateDoc(doc(db!, 'visits', editingVisit.id), visitData);
      setSuccess('Visita modificata con successo');
      setEditingVisit(null);
      await fetchVisits();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    if (!db) {
      console.error('Database not initialized');
      setError('Database non inizializzato');
      return;
    }

    setError('');
    setSuccess('');
    setDeletingVisit(visitId);

    try {
      await deleteDoc(doc(db!, 'visits', visitId));
      setSuccess('Visita eliminata con successo');
      await fetchVisits();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingVisit(null);
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
    exportVisitsToExcel,
    editingVisit,
    setEditingVisit,
    handleEditVisit,
    deletingVisit,
    handleDeleteVisit,
    editingUser,
    setEditingUser,
    handleEditUser
  };
}