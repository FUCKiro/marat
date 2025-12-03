import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { TherapyPrice, Invoice, InvoiceItem, User, Visit, BillingInfo } from '../types';

interface MonthlyTotal {
  patientId: string;
  patientName: string;
  billingInfo?: BillingInfo;
  totalAmount: number;
  items: InvoiceItem[];
  totalHours: number;
}

export function useInvoicing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [therapyPrices, setTherapyPrices] = useState<TherapyPrice[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  // Track which month/year the totals were calculated for (to prevent mismatch)
  const [calculatedPeriod, setCalculatedPeriod] = useState<{ year: number; month: number } | null>(null);

  // Clear monthly totals (used when changing month/year)
  const clearMonthlyTotals = () => {
    setMonthlyTotals([]);
    setCalculatedPeriod(null);
    setError('');
    setSuccess('');
  };

  // Fetch therapy prices
  const fetchTherapyPrices = async () => {
    if (!db) return;

    try {
      const pricesRef = collection(db, 'therapyPrices');
      const querySnapshot = await getDocs(pricesRef);
      const prices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: doc.data().updatedAt ? (doc.data().updatedAt as Timestamp).toDate() : undefined
      })) as TherapyPrice[];
      
      setTherapyPrices(prices);
    } catch (err: any) {
      console.error('Error fetching therapy prices:', err);
      setError('Errore nel caricamento dei prezzi delle terapie');
    }
  };

  // Calculate monthly totals for all patients
  const calculateMonthlyTotals = async (year: number, month: number) => {
    if (!db) {
      setError('Database non configurato');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch therapy prices first
      await fetchTherapyPrices();

      // Get date range for the month
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      // Fetch visits for the month
      const visitsRef = collection(db, 'visits');
      const visitsQuery = query(
        visitsRef,
        where('date', '>=', Timestamp.fromDate(firstDay)),
        where('date', '<=', Timestamp.fromDate(lastDay))
      );
      const visitsSnapshot = await getDocs(visitsQuery);
      
      const visits = visitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      })) as Visit[];

      // Fetch all users (patients)
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, where('role', '==', 'patient'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const patients = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Group visits by patient and calculate totals
      const patientTotals: { [patientId: string]: MonthlyTotal } = {};

      visits.forEach(visit => {
        const patient = patients.find(p => p.id === visit.patientId);
        if (!patient) return;

        if (!patientTotals[visit.patientId]) {
          // Cast patient to Patient type to access billingInfo
          const patientData = patient as any;
          patientTotals[visit.patientId] = {
            patientId: visit.patientId,
            patientName: patient.name,
            billingInfo: patientData.billingInfo,
            totalAmount: 0,
            items: [],
            totalHours: 0
          };
        }

        // Find therapy price for this visit type
        const therapyPrice = therapyPrices.find(p => p.type === visit.type);
        const pricePerHour = therapyPrice?.pricePerHour || 0;
        const hours = visit.duration / 60;
        const amount = hours * pricePerHour;

        // Check if we already have an item for this therapy type
        const existingItem = patientTotals[visit.patientId].items.find(
          item => item.therapyType === visit.type
        );

        if (existingItem) {
          existingItem.hours += hours;
          existingItem.total += amount;
        } else {
          patientTotals[visit.patientId].items.push({
            therapyType: visit.type,
            hours: hours,
            pricePerHour: pricePerHour,
            total: amount
          });
        }

        patientTotals[visit.patientId].totalAmount += amount;
        patientTotals[visit.patientId].totalHours += hours;
      });

      const totals = Object.values(patientTotals).filter(total => total.totalAmount > 0);
      setMonthlyTotals(totals);
      // Save the period for which totals were calculated
      setCalculatedPeriod({ year, month });
      setSuccess(`Calcolati i totali per ${totals.length} pazienti`);

    } catch (err: any) {
      console.error('Error calculating monthly totals:', err);
      setError('Errore nel calcolo dei totali mensili');
    } finally {
      setLoading(false);
    }
  };

  // Generate invoice for a specific patient
  const generateInvoice = async (patientTotal: MonthlyTotal, year: number, month: number) => {
    if (!db) {
      setError('Database non configurato');
      return null;
    }

    // SAFETY CHECK: Verify that totals were calculated for the same period
    if (!calculatedPeriod || calculatedPeriod.year !== year || calculatedPeriod.month !== month) {
      setError(`Errore: i totali sono stati calcolati per un periodo diverso. Ricalcola i totali per ${month}/${year}.`);
      return null;
    }

    try {
      console.log('Generating invoice for patient:', patientTotal.patientName);
      console.log('Patient total:', patientTotal);
      
      const invoiceNumber = `INV-${year}${month.toString().padStart(2, '0')}-${patientTotal.patientId.slice(-6).toUpperCase()}`;
      
      // Check if invoice already exists for this patient, month, and year
      const existingInvoiceQuery = query(
        collection(db, 'invoices'),
        where('patientId', '==', patientTotal.patientId),
        where('month', '==', month),
        where('year', '==', year)
      );
      
      const existingInvoiceSnapshot = await getDocs(existingInvoiceQuery);
      
      if (!existingInvoiceSnapshot.empty) {
        console.log(`Invoice already exists for patient ${patientTotal.patientName} for ${month}/${year}`);
        setError(`Proforma già esistente per ${patientTotal.patientName} per il periodo ${month}/${year}`);
        return null;
      }
      
      const invoice: Omit<Invoice, 'id'> = {
        invoiceNumber,
        patientId: patientTotal.patientId,
        patientName: patientTotal.patientName,
        billingInfo: patientTotal.billingInfo || {
          parentName: patientTotal.patientName,
          parentSurname: '',
          fiscalCode: 'N/A',
          address: 'N/A',
          city: 'N/A',
          postalCode: 'N/A',
          province: 'N/A'
        } as BillingInfo,
        items: patientTotal.items,
        subtotal: patientTotal.totalAmount, // Esente IVA: il subtotale coincide con il totale
        tax: 0, // Esente IVA: nessuna imposta
        total: patientTotal.totalAmount,
        month: month,
        year: year,
        status: 'proforma',
        createdAt: new Date(),
        dueDate: new Date(year, month, 15) // Due date: 15th of next month
      };

      console.log('Invoice data to save:', invoice);
      
      const docRef = await addDoc(collection(db, 'invoices'), invoice);
      
      console.log('Invoice saved successfully with ID:', docRef.id);
      
      return {
        id: docRef.id,
        ...invoice
      } as Invoice;

    } catch (err: any) {
      console.error('Error generating invoice:', err);
      console.error('Error details:', err.message, err.code);
      setError(`Errore nella generazione della proforma: ${err.message}`);
      return null;
    }
  };

  // Generate invoices for all patients with totals > 0
  const generateAllInvoices = async (year: number, month: number) => {
    setLoading(true);
    setError('');

    try {
      const invoices: Invoice[] = [];
      const skippedPatients: string[] = [];
      
      for (const patientTotal of monthlyTotals) {
        if (patientTotal.totalAmount > 0) {
          const invoice = await generateInvoice(patientTotal, year, month);
          if (invoice) {
            invoices.push(invoice);
          } else {
            // If invoice generation failed due to duplicate, add to skipped list
            skippedPatients.push(patientTotal.patientName);
          }
        }
      }

      if (invoices.length > 0) {
        setSuccess(`Generate ${invoices.length} proforma con successo`);
      }
      
      if (skippedPatients.length > 0) {
        const skippedMessage = `Proforma già esistenti saltate per: ${skippedPatients.join(', ')}`;
        if (invoices.length > 0) {
          setSuccess(`Generate ${invoices.length} proforma con successo. ${skippedMessage}`);
        } else {
          setError(skippedMessage);
        }
      }
      
      return invoices;

    } catch (err: any) {
      console.error('Error generating all invoices:', err);
      setError('Errore nella generazione delle proforma');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Convert proforma invoice to final invoice upon payment
  const convertToFinalInvoice = async (invoiceId: string) => {
    if (!db) {
      setError('Database non configurato');
      return false;
    }

    try {
      setLoading(true);
      
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        status: 'paid',
        paidAt: new Date()
      });

      setSuccess('Proforma convertita in fattura finale e marcata come pagata');
      return true;

    } catch (err: any) {
      console.error('Error converting invoice to final:', err);
      setError('Errore nella conversione della proforma');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapyPrices();
  }, []);

  return {
    loading,
    error,
    success,
    therapyPrices,
    monthlyTotals,
    calculateMonthlyTotals,
    generateInvoice,
    generateAllInvoices,
    convertToFinalInvoice,
    fetchTherapyPrices,
    clearMonthlyTotals
  };
}