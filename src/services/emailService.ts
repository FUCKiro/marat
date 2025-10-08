// Email backend via Netlify Function
import { Invoice } from '../types';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Endpoint Netlify Functions
const NETLIFY_EMAIL_ENDPOINT = '/.netlify/functions/send-invoice-email';

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
│ Descrizione                    │ ore/incontri │ Prezzo/Ora │      Totale      │
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
    const ivaLabel = invoice.tax === 0 ? 'IVA: Esente (0%)' : 'IVA (22%)';
    return `RIEPILOGO IMPORTI:
Subtotale: ${formatCurrency(invoice.subtotal)}
${ivaLabel}: ${formatCurrency(invoice.tax)}
─────────────────────────────
TOTALE: ${formatCurrency(invoice.total)}`;
  };

  const baseMessage = `Gentile ${recipientName},`;
  const taxNote = invoice.tax === 0 
    ? `
NOTA FISCALE:
Operazione esente IVA ai sensi dell’art. 10 DPR 633/72`
    : '';
  
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

${taxNote}

═══════════════════════════════════════════════════════════════════════════════
Nota sul conteggio delle ore
════════════════════════════════════════════════════════════════════════════════

Il conteggio delle ore è stato stabilito in base al foglio presenza dei terapisti. Ogni mese il terapista 
lascerà a casa il foglio presenze che verrà firmato di volta in volta dal genitore del bambino.

═══════════════════════════════════════════════════════════════════════════════
MODALITÀ DI PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

Bonifico Bancario:
Banca: Banca di credito cooperativo di Roma-BCC
IBAN: IT 29 D 08327 03200 000000046622
Intestato a: MARATONDA SOCIETA’ COOPERATIVA SOCIALE
Causale: Fattura Proforma n. ${invoice.invoiceNumber}

Una volta ricevuto il pagamento, Le invieremo automaticamente la fattura finale con valore fiscale.

La famiglia riceverà entro 30 giorni lavorativi la fatturazione tramite posta elettronica dell’intero importo.

Per qualsiasi chiarimento, non esiti a contattarci.

Cordiali saluti,
Associazione Maratonda
Tel: +39 351 479 0620
Email: associazionemaratonda@gmail.com
Codice fiscale: 16815601006 - Partita IVA: 16815601006`;
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

${taxNote}

═══════════════════════════════════════════════════════════════════════════════
Nota sul conteggio delle ore
════════════════════════════════════════════════════════════════════════════════

Il conteggio delle ore è stato stabilito in base al foglio presenza dei terapisti. Ogni mese il terapista 
lascerà a casa il foglio presenze che verrà firmato di volta in volta dal genitore del bambino.

═══════════════════════════════════════════════════════════════════════════════
MODALITÀ DI PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

${invoice.status !== 'paid' ? `Bonifico Bancario:
Banca: Banca di credito cooperativo di Roma-BCC
IBAN: IT 29 D 08327 03200 000000046622
Intestato a: MARATONDA SOCIETA’ COOPERATIVA SOCIALE
Causale: Fattura n. ${invoice.invoiceNumber}` : '✅ PAGAMENTO RICEVUTO - Grazie per aver effettuato il pagamento.'}

La famiglia riceverà entro 30 giorni lavorativi la fatturazione tramite posta elettronica dell’intero importo.

Per qualsiasi chiarimento, non esiti a contattarci.

Cordiali saluti,
Associazione Maratonda
Tel: +39 351 479 0620
Email: associazionemaratonda@gmail.com
Codice fiscale: 16815601006 - Partita IVA: 16815601006`;
  }
};

export const sendInvoiceEmail = async (
  invoice: Invoice,
  patientEmail: string,
  options?: { pdfBase64?: string }
): Promise<boolean> => {
  try {
    // Backend configuration check
    if (!validateEmailConfiguration()) {
      throw new Error('Configurazione email non completa. Contatta l\'amministratore.');
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

    const resultResponse = await fetch(NETLIFY_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...emailData, pdfBase64: options?.pdfBase64 || undefined })
    });

    if (resultResponse.ok) {
      const result = await resultResponse.json();
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
      const errorText = await resultResponse.text();
      console.error('Errore nell\'invio email - Status non 200:', resultResponse.status, errorText);
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
    
    // Enhanced error logging for production debugging
    console.error('Contesto errore:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      backendEndpoint: NETLIFY_EMAIL_ENDPOINT
    });
    
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
  // Con backend su Netlify Functions non richiediamo variabili client
  return true;
};