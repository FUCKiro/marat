import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Visit, User } from '../types';
import SEO from '../components/SEO';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    async function fetchVisits() {
      try {
        const visitsRef = collection(db, 'visits');
        let q;
        
        if (currentUser.role === 'admin') {
          // Admin sees all visits
          q = query(visitsRef);
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

        setVisits(visitsData);
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

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Visite {currentUser?.role === 'admin' ? 'del mese' : ''}
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {visits.map((visit) => (
                  <li key={visit.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-teal-600">
                        {visit.date.toLocaleDateString()}
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
    </Layout>
  );
}