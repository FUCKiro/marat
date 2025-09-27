import emailjs from '@emailjs/browser';
import { Invoice } from '../types';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Configurazione EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Inizializza EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  to_email: string;
  to_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  patient_name: string;
  from_name: string;
  from_email: string;
  message: string;
  subject: string;
  invoice_type: string;
  [key: string]: unknown;
}

export const getEmailSubject = (invoice: Invoice): string => {
  const baseSubject = `Associazione Maratonda - `;
  switch (invoice.status) {
    case 'proforma':
      return `${baseSubject}Fattura Proforma n. ${invoice.invoiceNumber}`;
    case 'final':
    case 'sent':
    case 'paid':
    case 'overdue':
    case 'closed':
      return `${baseSubject}Fattura n. ${invoice.invoiceNumber}`;
    default:
      return `${baseSubject}Fattura n. ${invoice.invoiceNumber}`;
  }
};

const getEmailMessage = (invoice: Invoice): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT').format(date);
  };

  const recipientName = invoice.billingInfo?.parentName ? 
    `${invoice.billingInfo.parentName} ${invoice.billingInfo.parentSurname}` : 
    invoice.patientName;

  // Generate detailed billing information
  const getBillingDetails = () => {
    if (invoice.billingInfo) {
      let details = `FATTURATO A:
${invoice.billingInfo.parentName} ${invoice.billingInfo.parentSurname}
${invoice.billingInfo.address}
${invoice.billingInfo.postalCode} ${invoice.billingInfo.city} (${invoice.billingInfo.province})`;
      
      if (invoice.billingInfo.fiscalCode) {
        details += `\nC.F.: ${invoice.billingInfo.fiscalCode}`;
      }
      if (invoice.billingInfo.vatNumber) {
        details += `\nP.IVA: ${invoice.billingInfo.vatNumber}`;
      }
      if (invoice.billingInfo.email) {
        details += `\nEmail: ${invoice.billingInfo.email}`;
      }
      if (invoice.billingInfo.phone) {
        details += `\nTel: ${invoice.billingInfo.phone}`;
      }
      if (invoice.billingInfo.parentName && invoice.patientName !== `${invoice.billingInfo.parentName} ${invoice.billingInfo.parentSurname}`) {
        details += `\nPaziente: ${invoice.patientName}`;
      }
      return details;
    } else {
      return `FATTURATO A:
${invoice.patientName}`;
    }
  };

  // Generate detailed services table
  const getServicesDetails = () => {
    let servicesTable = `DETTAGLIO SERVIZI:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Descrizione                    │   Ore   │ Prezzo/Ora │      Totale      │
├─────────────────────────────────────────────────────────────────────────────┤`;

    invoice.items.forEach(item => {
      const description = item.therapyType.padEnd(30);
      const hours = item.hours.toFixed(1).padStart(7);
      const pricePerHour = formatCurrency(item.pricePerHour).padStart(11);
      const total = formatCurrency(item.total).padStart(16);
      servicesTable += `\n│ ${description} │ ${hours} │ ${pricePerHour} │ ${total} │`;
    });

    servicesTable += `\n└─────────────────────────────────────────────────────────────────────────────┘`;
    return servicesTable;
  };

  // Generate totals section
  const getTotalsSection = () => {
    return `RIEPILOGO IMPORTI:
Subtotale: ${formatCurrency(invoice.subtotal)}
IVA (22%): ${formatCurrency(invoice.tax)}
─────────────────────────────
TOTALE: ${formatCurrency(invoice.total)}`;
  };

  const baseMessage = `Gentile ${recipientName},`;
  
  if (invoice.status === 'proforma') {
    return `${baseMessage}

Le inviamo in allegato la fattura proforma n. ${invoice.invoiceNumber} per i servizi di terapia ricevuti${invoice.billingInfo?.parentName ? ` dal paziente ${invoice.patientName}` : ''}.

⚠️ IMPORTANTE: Questa è una fattura proforma e NON ha valore fiscale. Verrà convertita in fattura finale al momento del pagamento.

═══════════════════════════════════════════════════════════════════════════════
DETTAGLI FATTURA PROFORMA
═══════════════════════════════════════════════════════════════════════════════

Numero: ${invoice.invoiceNumber}
Data: ${formatDate(invoice.createdAt)}
Scadenza: ${formatDate(invoice.dueDate)}

${getBillingDetails()}

${getServicesDetails()}

${getTotalsSection()}

═══════════════════════════════════════════════════════════════════════════════
MODALITÀ DI PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

Bonifico Bancario:
IBAN: IT60 X054 2811 1010 0000 0123 456
Intestato a: Associazione Maratonda
Causale: Fattura Proforma n. ${invoice.invoiceNumber}

Una volta ricevuto il pagamento, Le invieremo automaticamente la fattura finale con valore fiscale.

Per qualsiasi chiarimento, non esiti a contattarci.

Cordiali saluti,
Associazione Maratonda
Tel: +39 351 479 0620
Email: associazionemaratonda@gmail.com`;
  } else {
    return `${baseMessage}

Le inviamo in allegato la fattura n. ${invoice.invoiceNumber} per i servizi di terapia ricevuti${invoice.billingInfo?.parentName ? ` dal paziente ${invoice.patientName}` : ''}.

✅ Questa fattura ha valore fiscale ed è valida per tutti gli effetti di legge.

═══════════════════════════════════════════════════════════════════════════════
DETTAGLI FATTURA
═══════════════════════════════════════════════════════════════════════════════

Numero: ${invoice.invoiceNumber}
Data: ${formatDate(invoice.createdAt)}
Scadenza: ${formatDate(invoice.dueDate)}
Stato: ${invoice.status === 'paid' ? 'PAGATA' : invoice.status === 'sent' ? 'INVIATA' : invoice.status === 'closed' ? 'CHIUSA' : 'FINALE'}

${getBillingDetails()}

${getServicesDetails()}

${getTotalsSection()}

═══════════════════════════════════════════════════════════════════════════════
MODALITÀ DI PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

${invoice.status !== 'paid' ? `Bonifico Bancario:
IBAN: IT60 X054 2811 1010 0000 0123 456
Intestato a: Associazione Maratonda
Causale: Fattura n. ${invoice.invoiceNumber}` : '✅ PAGAMENTO RICEVUTO - Grazie per aver effettuato il pagamento.'}

Per qualsiasi chiarimento, non esiti a contattarci.

Cordiali saluti,
Associazione Maratonda
Tel: +39 351 479 0620
Email: associazionemaratonda@gmail.com`;
  }
};

export const sendInvoiceEmail = async (
  invoice: Invoice,
  patientEmail: string
): Promise<boolean> => {
  try {
    // Validate configuration first
    if (!validateEmailConfiguration()) {
      console.error('Configurazione EmailJS non valida:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? 'configurato' : 'mancante'
      });
      throw new Error('Configurazione EmailJS non completa. Verifica le variabili d\'ambiente.');
    }

    // Se non c'è email di fatturazione, non inviare
    if (!patientEmail) {
      throw new Error('Email di fatturazione non disponibile');
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('it-IT').format(date);
    };

    const emailData: EmailData = {
      to_email: patientEmail,
      to_name: invoice.billingInfo?.parentName ? 
        `${invoice.billingInfo.parentName} ${invoice.billingInfo.parentSurname}` : 
        invoice.patientName,
      invoice_number: invoice.invoiceNumber,
      invoice_date: formatDate(invoice.createdAt),
      due_date: formatDate(invoice.dueDate),
      total_amount: formatCurrency(invoice.total),
      patient_name: invoice.patientName,
      from_name: 'Associazione Maratonda',
      from_email: 'associazionemaratonda@gmail.com',
      subject: getEmailSubject(invoice),
      invoice_type: invoice.status === 'proforma' ? 'Proforma' : 'Finale',
      message: getEmailMessage(invoice)
    };

    console.log('Invio email con dati:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      toEmail: patientEmail,
      subject: emailData.subject
    });

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData
    );

    if (result.status === 200) {
      console.log('Email inviata con successo:', result);
      
      // Update the invoice with email sent timestamp
      const now = new Date();
      if (invoice.status === 'proforma') {
        invoice.proformaEmailSentAt = now;
      } else if (invoice.status === 'final' || invoice.status === 'sent' || invoice.status === 'paid' || invoice.status === 'closed') {
        invoice.finalEmailSentAt = now;
        
        // If this is a final invoice email for a paid invoice, update status to closed
        if (invoice.status === 'paid' && db) {
          try {
            const invoiceRef = doc(db, 'invoices', invoice.id);
            await updateDoc(invoiceRef, {
              status: 'closed',
              finalEmailSentAt: now
            });
            invoice.status = 'closed';
            console.log('Invoice status updated to closed after sending final email');
          } catch (err) {
            console.error('Error updating invoice status to closed:', err);
          }
        }
      }
      
      return true;
    } else {
      console.error('Errore nell\'invio email - Status non 200:', result);
      return false;
    }

  } catch (error) {
    console.error('Errore nell\'invio email:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Dettagli errore:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    // Log EmailJS specific errors
    if (error && typeof error === 'object' && 'text' in error) {
      console.error('Errore EmailJS:', error);
    }
    
    // Show user-friendly error message
    alert(`Errore nell'invio email: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    
    return false;
  }
};

export const sendBulkInvoiceEmails = async (invoices: Invoice[]): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (const invoice of invoices) {
    try {
      const billingEmail = invoice.billingInfo?.email;
      if (!billingEmail) {
        console.error(`Email di fatturazione non disponibile per fattura ${invoice.invoiceNumber}`);
        failed++;
        continue;
      }
      
      const sent = await sendInvoiceEmail(invoice, billingEmail);
      if (sent) {
        success++;
        // Pausa di 1 secondo tra gli invii per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Errore invio email per fattura ${invoice.invoiceNumber}:`, error);
      failed++;
    }
  }

  return { success, failed };
};

// Helper functions for email status tracking
export const getEmailStatus = (invoice: Invoice) => {
  const status = {
    proformaEmailSent: !!invoice.proformaEmailSentAt,
    finalEmailSent: !!invoice.finalEmailSentAt,
    proformaEmailSentAt: invoice.proformaEmailSentAt,
    finalEmailSentAt: invoice.finalEmailSentAt,
  };
  
  return status;
};

export const canSendProformaEmail = (invoice: Invoice): boolean => {
  return invoice.status === 'proforma' && !invoice.proformaEmailSentAt;
};

export const canSendFinalEmail = (invoice: Invoice): boolean => {
  return (invoice.status === 'final' || invoice.status === 'sent' || invoice.status === 'paid' || invoice.status === 'closed') && !invoice.finalEmailSentAt;
};

export const getEmailStatusText = (invoice: Invoice): string => {
  const status = getEmailStatus(invoice);
  const formatDate = (dateValue: any) => {
    let date: Date;
    
    // Handle different date formats from Firebase
    if (dateValue && typeof dateValue === 'object') {
      // Firebase Timestamp object
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      }
      // Firebase Timestamp with seconds/nanoseconds
      else if (dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      }
      // Already a Date object
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Fallback: try to create Date from the value
      else {
        date = new Date(dateValue);
      }
    } else {
      // String or number timestamp
      date = new Date(dateValue);
    }
    
    // Validate the date
    if (isNaN(date.getTime())) {
      return 'Data non valida';
    }
    
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (invoice.status === 'proforma') {
    return status.proformaEmailSent 
      ? `Proforma inviata il ${formatDate(status.proformaEmailSentAt!)}`
      : 'Proforma non ancora inviata';
  }
  
  if (invoice.status === 'final' || invoice.status === 'sent' || invoice.status === 'paid' || invoice.status === 'closed') {
    return status.finalEmailSent 
      ? `Fattura finale inviata il ${formatDate(status.finalEmailSentAt!)}`
      : 'Fattura finale non ancora inviata';
  }
  
  return 'Email non applicabile per questo stato';
};

export const validateEmailConfiguration = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && 
           EMAILJS_TEMPLATE_ID && 
           EMAILJS_PUBLIC_KEY &&
           EMAILJS_SERVICE_ID !== 'your_service_id' &&
           EMAILJS_TEMPLATE_ID !== 'your_template_id' &&
           EMAILJS_PUBLIC_KEY !== 'your_public_key');
};