import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Visit, User } from '../types';

export function useVisits() {
  const { currentUser } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [patientsMap, setPatientsMap] = useState<Record<string, User>>({});

  useEffect(() => {
    async function fetchVisits() {
      if (!currentUser) return;

      try {
        const visitsRef = collection(db, 'visits');
        const usersRef = collection(db, 'users');
        const patientsRef = collection(db, 'users');
        let q = query(visitsRef);
        
        if (currentUser.role === 'operator') {
          q = query(visitsRef, where('operatorId', '==', currentUser.id));
        } else if (currentUser.role === 'patient') {
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
          [doc.id]: { id: doc.id, ...doc.data() } as User,
        }), {} as Record<string, User>);
        setUsersMap(usersData);
        
        // Fetch all patients data and create a map
        const patientsQuery = query(patientsRef, where('role', '==', 'patient'));
        const patientsSnapshot = await getDocs(patientsQuery);
        const patientsData = patientsSnapshot.docs.reduce((acc, doc) => ({
          ...acc,
          [doc.id]: { id: doc.id, ...doc.data() } as User,
        }), {} as Record<string, User>);
        setPatientsMap(patientsData);

        // Sort visits by date in descending order and then by patient name
        const sortedVisits = visitsData.sort((a, b) => {
          // First sort by date
          const dateCompare = b.date.getTime() - a.date.getTime();
          if (dateCompare !== 0) return dateCompare;
          
          // Then by patient name if dates are equal
          const patientA = (patientsData[a.patientId]?.name || '').toLowerCase();
          const patientB = (patientsData[b.patientId]?.name || '').toLowerCase();
          return patientA.localeCompare(patientB);
        });
        setVisits(sortedVisits);
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    }

    fetchVisits();
  }, [currentUser]);

  return { visits, usersMap, patientsMap };
}