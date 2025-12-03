import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { config } from 'dotenv';

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

async function checkInvoices() {
  console.log('\n📊 Analisi fatture 2025\n');
  
  const invoicesRef = collection(db, 'invoices');
  
  // Query fatture di Novembre 2025
  const q11 = query(invoicesRef, where('year', '==', 2025), where('month', '==', 11));
  const snap11 = await getDocs(q11);
  
  // Query fatture di Dicembre 2025
  const q12 = query(invoicesRef, where('year', '==', 2025), where('month', '==', 12));
  const snap12 = await getDocs(q12);
  
  console.log('📋 NOVEMBRE 2025:');
  console.log(`   Totale fatture: ${snap11.size}`);
  if (snap11.size > 0) {
    snap11.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.invoiceNumber} | ${data.patientName} | ${data.total}€`);
    });
  }
  
  console.log('\n📋 DICEMBRE 2025:');
  console.log(`   Totale fatture: ${snap12.size}`);
  if (snap12.size > 0) {
    snap12.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.invoiceNumber} | ${data.patientName} | ${data.total}€`);
    });
  }
  
  console.log(`\n📊 RIEPILOGO:`);
  console.log(`   Novembre: ${snap11.size} fatture`);
  console.log(`   Dicembre: ${snap12.size} fatture`);
  console.log(`   Totale 2025: ${snap11.size + snap12.size} fatture\n`);
}

checkInvoices()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Errore:', err);
    process.exit(1);
  });
