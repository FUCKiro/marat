// Script per correggere le fatture con mese sbagliato
// Eseguire con: node scripts/fix-invoices.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { config } from 'dotenv';

// Load .env file
config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findAndFixInvoices() {
  console.log('🔍 Cercando fatture con mese=11 (Novembre) e anno=2025...\n');
  
  const invoicesRef = collection(db, 'invoices');
  const q = query(invoicesRef, where('month', '==', 11), where('year', '==', 2025));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('✅ Nessuna fattura trovata con mese=11 e anno=2025');
    return;
  }
  
  console.log(`⚠️  Trovate ${snapshot.size} fatture da correggere:\n`);
  
  const invoicesToFix = [];
  
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    console.log('─────────────────────────────────────────');
    console.log('📄 ID documento:', docSnap.id);
    console.log('   Numero fattura:', data.invoiceNumber);
    console.log('   Paziente:', data.patientName);
    console.log('   Mese attuale:', data.month, '(Novembre) ❌');
    console.log('   Anno:', data.year);
    console.log('   Totale:', data.total, '€');
    console.log('   Status:', data.status);
    
    invoicesToFix.push({
      id: docSnap.id,
      data: data
    });
  });
  
  console.log('─────────────────────────────────────────\n');
  
  // Correzione automatica: cambia mese da 11 a 12 e aggiorna numero fattura
  console.log('🔧 Correggendo le fatture...\n');
  
  for (const invoice of invoicesToFix) {
    const docRef = doc(db, 'invoices', invoice.id);
    
    // Aggiorna il numero fattura da 202511 a 202512
    const newInvoiceNumber = invoice.data.invoiceNumber.replace('202511', '202512');
    
    // Aggiorna la scadenza (dueDate) se necessario - dovrebbe essere 15 del mese successivo
    // Per Dicembre 2025, la scadenza è 15 Gennaio 2026
    const newDueDate = new Date(2026, 0, 15); // 15 Gennaio 2026
    
    await updateDoc(docRef, {
      month: 12,
      invoiceNumber: newInvoiceNumber,
      dueDate: newDueDate
    });
    
    console.log(`✅ Corretto: ${invoice.data.invoiceNumber} → ${newInvoiceNumber}`);
    console.log(`   Mese: 11 → 12`);
    console.log(`   Paziente: ${invoice.data.patientName}\n`);
  }
  
  console.log('🎉 Tutte le fatture sono state corrette!');
}

findAndFixInvoices()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Errore:', err);
    process.exit(1);
  });
