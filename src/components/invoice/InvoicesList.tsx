import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Invoice } from '../../types';
import InvoicePDFGenerator from './InvoicePDFGenerator';
import { useInvoicing } from '../../hooks/useInvoicing';
import { sendInvoiceEmail, getEmailStatusText, canSendProformaEmail, canSendFinalEmail } from '../../services/emailService';
import { FileText, Eye, Calendar, Euro, User, CheckCircle, Clock, AlertCircle, CreditCard, Send, Search, Filter } from 'lucide-react';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPDFGenerator, setShowPDFGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustInvoice, setAdjustInvoice] = useState<Invoice | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('0');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [updatingPrice, setUpdatingPrice] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { convertToFinalInvoice } = useInvoicing();

  const fetchInvoices = async () => {
    if (!db) {
      setError('Database non configurato');
      setLoading(false);
      return;
    }

    try {
      const invoicesRef = collection(db, 'invoices');
      const q = query(invoicesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const invoicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          dueDate: (data.dueDate as Timestamp).toDate()
        } as Invoice;
      });
      
      setInvoices(invoicesData);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError('Errore nel caricamento delle fatture');
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    if (!db) return;

    try {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, { status });
      
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      ));
    } catch (err: any) {
      console.error('Error updating invoice status:', err);
      setError('Errore nell\'aggiornamento dello stato della fattura');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const openAdjustModal = (invoice: Invoice) => {
    setAdjustInvoice(invoice);
    setAdjustAmount(String(invoice.adjustmentAmount ?? 0));
    setAdjustReason(invoice.adjustmentReason ?? '');
    setShowAdjustModal(true);
  };

  const computedNewTotal = () => {
    if (!adjustInvoice) return 0;
    const amt = parseFloat(adjustAmount || '0');
    const newTotal = adjustInvoice.subtotal + adjustInvoice.tax + (isNaN(amt) ? 0 : amt);
    return Math.round(newTotal * 100) / 100;
  };

  const updateInvoicePrice = async () => {
    if (!db || !adjustInvoice) return;
    setUpdatingPrice(true);
    try {
      const amt = parseFloat(adjustAmount || '0');
      const newTotal = computedNewTotal();
      const invoiceRef = doc(db, 'invoices', adjustInvoice.id);
      await updateDoc(invoiceRef, {
        adjustmentAmount: isNaN(amt) ? 0 : amt,
        adjustmentReason: adjustReason || '',
        total: newTotal
      });

      setInvoices(prev => prev.map(inv =>
        inv.id === adjustInvoice.id
          ? { ...inv, adjustmentAmount: isNaN(amt) ? 0 : amt, adjustmentReason: adjustReason || '', total: newTotal }
          : inv
      ));
      setSuccess('Prezzo della fattura aggiornato con successo');
      setShowAdjustModal(false);
      setAdjustInvoice(null);
    } catch (err: any) {
      console.error('Error updating invoice price:', err);
      setError('Errore nell\'aggiornamento del prezzo della fattura');
    } finally {
      setUpdatingPrice(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT').format(date);
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'proforma':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'final':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'proforma':
        return 'Proforma';
      case 'final':
        return 'Finale';
      case 'sent':
        return 'Inviata';
      case 'paid':
        return 'Pagata';
      case 'overdue':
        return 'Scaduta';
      case 'closed':
        return 'Chiusa';
      default:
        return 'Sconosciuto';
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'proforma':
        return 'bg-orange-100 text-orange-800';
      case 'final':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePDFGenerated = (pdfBlob: Blob) => {
    // Qui potresti implementare l'invio automatico via email
    console.log('PDF generato:', pdfBlob);
  };

  const handleSendEmail = async (invoice: Invoice) => {
    if (!invoice.billingInfo.email) {
      setError('Email del paziente non configurata');
      return;
    }

    setSendingEmail(invoice.id);
    try {
      // Generate PDF for email attachment using html2canvas (same as InvoicePDFGenerator)
      let pdfBase64 = '';
      try {
        // Create a temporary div to render the invoice
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '210mm';
        tempDiv.style.minHeight = '297mm';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20mm';
        tempDiv.style.boxSizing = 'border-box';
        
        // Import html2canvas and jsPDF dynamically
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf')
        ]);
        
        // Create invoice HTML content (optimized for A4)
        tempDiv.innerHTML = `
          <div style="font-family: Arial, sans-serif; color: #333; font-size: 12px; line-height: 1.3;">
            ${invoice.status === 'proforma' ? `
              <div style="margin-bottom: 12px; padding: 8px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px;">
                <p style="margin: 0; font-size: 11px; color: #92400e; font-weight: 500;">
                  Documento non valido ai fini fiscali - Convertire in fattura finale per la validità fiscale
                </p>
              </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div style="flex: 1;">
                <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 6px;">
                  ${invoice.status === 'proforma' ? 'FATTURA PROFORMA' : 'FATTURA'}
                </h1>
                <div style="color: #666; font-size: 10px;">
                  <p style="margin: 2px 0; font-weight: 600;">Associazione Maratonda</p>
                  <p style="margin: 2px 0;">Largo Bacone 16</p>
                  <p style="margin: 2px 0;">00137 Roma</p>
                  <p style="margin: 2px 0;">Codice Fiscale: 16815601006</p>
                  <p style="margin: 2px 0;">Partita IVA: 16815601006</p>
                  <p style="margin: 2px 0;">Tel: +39 351 479 0620</p>
                  <p style="margin: 2px 0;">Email: associazionemaratonda@gmail.com</p>
                </div>
              </div>
              <div style="text-align: right; flex-shrink: 0; margin-left: 20px;">
                <div style="border: 2px solid ${invoice.status === 'proforma' ? '#f59e0b' : '#14b8a6'}; border-radius: 6px; padding: 12px; background: ${invoice.status === 'proforma' ? '#fef3c7' : '#f0fdfa'};">
                  <p style="margin: 0; font-size: 10px; color: #666;">
                    ${invoice.status === 'proforma' ? 'Numero Proforma' : 'Numero Fattura'}
                  </p>
                  <p style="margin: 4px 0; font-size: 16px; font-weight: bold; color: ${invoice.status === 'proforma' ? '#d97706' : '#0f766e'};">
                    ${invoice.invoiceNumber}
                  </p>
                  <p style="margin: 2px 0; font-size: 10px; color: #666;">
                    Data: ${new Intl.DateTimeFormat('it-IT').format(invoice.createdAt)}
                  </p>
                  <p style="margin: 2px 0; font-size: 10px; color: #666;">
                    Scadenza: ${new Intl.DateTimeFormat('it-IT').format(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Fatturato a:</h2>
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px;">
                <p style="margin: 2px 0; font-weight: 600; font-size: 11px;">${invoice.billingInfo.parentName} ${invoice.billingInfo.parentSurname}</p>
                <p style="margin: 2px 0; font-size: 10px;">${invoice.billingInfo.address}</p>
                <p style="margin: 2px 0; font-size: 10px;">${invoice.billingInfo.postalCode} ${invoice.billingInfo.city} (${invoice.billingInfo.province})</p>
                ${invoice.billingInfo.fiscalCode ? `<p style="margin: 2px 0; font-size: 10px;">C.F.: ${invoice.billingInfo.fiscalCode}</p>` : ''}
                ${invoice.billingInfo.vatNumber ? `<p style="margin: 2px 0; font-size: 10px;">P.IVA: ${invoice.billingInfo.vatNumber}</p>` : ''}
                <p style="margin: 2px 0; font-size: 10px;">${invoice.billingInfo.email}</p>
                ${invoice.billingInfo.phone ? `<p style="margin: 2px 0; font-size: 10px;">Tel: ${invoice.billingInfo.phone}</p>` : ''}
                <p style="margin: 4px 0 2px 0; font-size: 9px; color: #666;">Paziente: ${invoice.patientName}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 13px; font-weight: 600; margin-bottom: 10px;">Dettaglio Servizi</h2>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 9px; font-weight: 500; color: #6b7280; text-transform: uppercase;">Descrizione</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb; font-size: 9px; font-weight: 500; color: #6b7280; text-transform: uppercase;">ore/incontri</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb; font-size: 9px; font-weight: 500; color: #6b7280; text-transform: uppercase;">Sessione</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb; font-size: 9px; font-weight: 500; color: #6b7280; text-transform: uppercase;">Totale</th>
                  </tr>
                </thead>
                <tbody style="background: white;">
                  ${invoice.items.map((item, index) => `
                    <tr ${index < invoice.items.length - 1 ? 'style="border-bottom: 1px solid #e5e7eb;"' : ''}>
                      <td style="padding: 8px; font-size: 11px; color: #111827;">${item.therapyType}</td>
                      <td style="padding: 8px; text-align: center; font-size: 11px; color: #111827;">${item.hours.toFixed(1)}</td>
                      <td style="padding: 8px; text-align: right; font-size: 11px; color: #111827;">
                        ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.pricePerHour)}
                      </td>
                      <td style="padding: 8px; text-align: right; font-size: 11px; font-weight: 500; color: #111827;">
                        ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.total)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Totals -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
              <div style="width: 250px;">
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px;">
                    <span style="color: #6b7280;">Subtotale:</span>
                    <span style="font-weight: 500;">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(invoice.subtotal)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px;">
                    <span style="color: #6b7280;">${invoice.tax === 0 ? 'IVA: Esente (0%)' : 'IVA (22%):'}</span>
                    <span style="font-weight: 500;">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(invoice.tax)}</span>
                  </div>
                  ${invoice.adjustmentAmount && invoice.adjustmentAmount !== 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px;">
                    <span style="color: #6b7280;">${invoice.adjustmentAmount < 0 ? 'Sconto:' : 'Adeguamento:'}</span>
                    <span style="font-weight: 500; color: ${invoice.adjustmentAmount < 0 ? '#dc2626' : '#0f766e'};">
                      ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(invoice.adjustmentAmount)}
                    </span>
                  </div>
                  ` : ''}
                  <div style="border-top: 1px solid #d1d5db; padding-top: 6px; margin-top: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                      <span style="color: #374151;">Totale:</span>
                      <span style="color: #0f766e;">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(invoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Info -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
              <div style="margin-bottom: 12px;">
                <p style="font-size: 10px; color: #374151; line-height: 1.4; margin: 0;">
                  Il conteggio delle ore è stato stabilito in base al foglio presenza dei terapisti. Ogni mese il terapista
                  lascerà a casa il foglio presenze che verrà firmato di volta in volta dal genitore del bambino.
                </p>
              </div>
              <h3 style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Modalità di Pagamento</h3>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px;">
                <p style="font-size: 10px; color: #374151; margin-bottom: 6px;">
                  <strong>Bonifico Bancario:</strong>
                </p>
                <p style="font-size: 9px; color: #6b7280; margin: 2px 0;">Banca: Banca di credito cooperativo di Roma-BCC</p>
                <p style="font-size: 9px; color: #6b7280; margin: 2px 0;">IBAN: IT 29 D 08327 03200 000000046622</p>
                <p style="font-size: 9px; color: #6b7280; margin: 2px 0;">Intestato a: MARATONDA SOCIETA' COOPERATIVA SOCIALE</p>
                <p style="font-size: 9px; color: #6b7280; margin: 4px 0 2px 0;">
                  <strong>Causale:</strong> Fattura n. ${invoice.invoiceNumber}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 8px; color: #6b7280;">
              <p style="margin: 2px 0;">
                ${invoice.status === 'proforma' 
                  ? 'Questa fattura proforma è stata generata automaticamente dal sistema di gestione dell\'Associazione Maratonda'
                  : 'Questa fattura è stata generata automaticamente dal sistema di gestione dell\'Associazione Maratonda'
                }
              </p>
              <p style="margin: 2px 0;">Per informazioni: associazionemaratonda@gmail.com | Tel: +39 351 479 0620</p>
              <p style="margin: 2px 0;">La famiglia riceverà entro 30 giorni lavorativi la fatturazione tramite posta elettronica dell'intero importo.</p>
              ${invoice.tax === 0 ? `
                <p style="margin: 4px 0; color: #6b7280;">
                  Operazione esente IVA ai sensi dell'art. 10 DPR 633/72
                </p>
              ` : ''}
              ${invoice.status === 'proforma' ? `
                <p style="margin: 4px 0; color: #d97706; font-weight: 500;">
                  ATTENZIONE: Questo documento non ha valore fiscale fino alla conversione in fattura finale
                </p>
              ` : ''}
            </div>
          </div>
        `;
        
        document.body.appendChild(tempDiv);
        
        // Generate canvas from HTML with optimized settings to reduce size
        const canvas = await html2canvas(tempDiv, {
          scale: 1.5, // Reduced from 2 to 1.5 to decrease file size
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        // Remove temporary div
        document.body.removeChild(tempDiv);
        
        // Create PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality instead of PNG
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Get PDF as base64
        pdfBase64 = pdf.output('datauristring').split(',')[1]; // Remove data:application/pdf;base64, prefix
        
      } catch (pdfError) {
        console.error('Errore nella generazione del PDF:', pdfError);
        // If PDF generation fails, send email without attachment
        console.log('Invio email senza allegato PDF a causa dell\'errore');
      }
      
      const success = await sendInvoiceEmail(invoice, invoice.billingInfo.email, pdfBase64);
      if (success) {
        // Update the invoice in the local state with the new email timestamp
        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { ...invoice } : inv
        ));
        
        // Also update in Firebase
        if (db) {
          const invoiceRef = doc(db, 'invoices', invoice.id);
          const updateData: any = {};
          
          if (invoice.status === 'proforma') {
            updateData.proformaEmailSentAt = invoice.proformaEmailSentAt;
          } else if (invoice.status === 'final' || invoice.status === 'sent') {
            updateData.finalEmailSentAt = invoice.finalEmailSentAt;
          }
          
          await updateDoc(invoiceRef, updateData);
        }
        
        setSuccess(pdfBase64 ? 'Email con PDF inviata con successo' : 'Email inviata con successo (PDF non disponibile)');
        console.log('Email inviata con successo');
      } else {
        setError('Errore nell\'invio dell\'email');
      }
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError('Errore nell\'invio dell\'email');
    } finally {
      setSendingEmail(null);
    }
  };

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const invoicesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
            dueDate: (data.dueDate as Timestamp).toDate()
          } as Invoice;
        });
        setInvoices(invoicesData);
        setLoading(false);
      },
      (err) => {
        console.error('Errore nel caricamento delle fatture (realtime):', err);
        setError('Errore nel caricamento delle fatture');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-2 text-gray-600">Caricamento fatture...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Storico Fatture</h2>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cerca fattura o paziente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm w-full sm:w-64"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="all">Tutti gli stati</option>
                <option value="proforma">Proforma</option>
                <option value="final">Finale</option>
                <option value="sent">Inviata</option>
                <option value="paid">Pagata</option>
                <option value="overdue">Scaduta</option>
                <option value="closed">Chiusa</option>
              </select>
            </div>

            {/* Pulsante “Normalizza IVA 0” rimosso: tutte le fatture sono IVA 0% */}
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            {invoices.length === 0 ? (
              <>
                <p className="text-lg">Nessuna fattura trovata</p>
                <p className="text-sm">Le fatture generate appariranno qui</p>
              </>
            ) : (
              <>
                <p className="text-lg">Nessun risultato trovato</p>
                <p className="text-sm">Prova a modificare i filtri di ricerca</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <table className="w-full table-fixed bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                      Numero Fattura
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Paziente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Scadenza
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Importo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Stato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 break-words">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 break-words">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {invoice.patientName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Euro className="w-4 h-4 text-gray-400" />
                          {formatCurrency(invoice.total)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}> 
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 break-words max-w-xs">
                        {getEmailStatusText(invoice)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap items-center gap-2">
                           <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowPDFGenerator(true);
                              }}
                              className="text-teal-600 hover:text-teal-800 transition-colors"
                              title="Visualizza fattura"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Price (Desktop icon action) */}
                            <button
                              onClick={() => openAdjustModal(invoice)}
                              className="text-yellow-600 hover:text-yellow-800 transition-colors"
                              title="Modifica prezzo"
                            >
                              <Euro className="w-4 h-4" />
                            </button>
                           
                           {canSendProformaEmail(invoice) && (
                              <button
                                onClick={() => handleSendEmail(invoice)}
                                disabled={sendingEmail === invoice.id}
                                className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                title="Invia email proforma"
                              >
                                {sendingEmail === invoice.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            
                            {canSendFinalEmail(invoice) && (
                              <button
                                onClick={() => handleSendEmail(invoice)}
                                disabled={sendingEmail === invoice.id}
                                className="text-teal-600 hover:text-teal-800 transition-colors disabled:opacity-50"
                                title="Invia email fattura finale"
                              >
                                {sendingEmail === invoice.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </button>
                            )}
                           
                           {invoice.status === 'proforma' && (
                             <button
                               onClick={async () => {
                                 const success = await convertToFinalInvoice(invoice.id);
                                 if (success) {
                                   fetchInvoices(); // Refresh the list
                                 }
                               }}
                               className="text-green-600 hover:text-green-800 transition-colors"
                               title="Converti in fattura finale (pagamento ricevuto)"
                             >
                               <CreditCard className="w-4 h-4" />
                             </button>
                           )}
                           
                           {invoice.status === 'sent' && (
                             <button
                               onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                               className="text-green-600 hover:text-green-800 transition-colors"
                               title="Marca come pagata"
                             >
                               <CheckCircle className="w-4 h-4" />
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {invoice.invoiceNumber}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4" />
                        {invoice.patientName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Data:</span>
                      </div>
                      <div className="text-gray-900">{formatDate(invoice.createdAt)}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Euro className="w-4 h-4" />
                        <span className="font-medium">Importo:</span>
                      </div>
                      <div className="text-gray-900 font-semibold">{formatCurrency(invoice.total)}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="mb-1">
                      <span className="font-medium">Scadenza:</span> {formatDate(invoice.dueDate)}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {getEmailStatusText(invoice)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    <button
                       onClick={() => {
                         setSelectedInvoice(invoice);
                         setShowPDFGenerator(true);
                       }}
                       className="flex items-center gap-2 px-3 py-2 text-sm bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors"
                     >
                      <Eye className="w-4 h-4" />
                       Visualizza
                     </button>

                     <button
                       onClick={() => openAdjustModal(invoice)}
                       className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
                     >
                       <Euro className="w-4 h-4" />
                       Modifica Prezzo
                     </button>
                     
                     {canSendProformaEmail(invoice) && (
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          disabled={sendingEmail === invoice.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          {sendingEmail === invoice.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Email Proforma
                        </button>
                      )}
                      
                      {canSendFinalEmail(invoice) && (
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          disabled={sendingEmail === invoice.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors disabled:opacity-50"
                        >
                          {sendingEmail === invoice.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Email Finale
                        </button>
                      )}
                     
                     {invoice.status === 'proforma' && (
                       <button
                         onClick={async () => {
                           const success = await convertToFinalInvoice(invoice.id);
                           if (success) {
                             fetchInvoices();
                           }
                         }}
                         className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                       >
                         <CreditCard className="w-4 h-4" />
                         Converti
                       </button>
                     )}
                     
                     {invoice.status === 'sent' && (
                       <button
                         onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                         className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                       >
                         <CheckCircle className="w-4 h-4" />
                         Pagata
                       </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* PDF Generator Modal */}
      {showPDFGenerator && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fattura {selectedInvoice.invoiceNumber}</h3>
              <button
                onClick={() => {
                  setShowPDFGenerator(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <InvoicePDFGenerator 
                invoice={selectedInvoice}
                onPDFGenerated={handlePDFGenerated}
              />
            </div>
          </div>
        </div>
      )}

      {/* Adjust Price Modal */}
      {showAdjustModal && adjustInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Modifica Prezzo Fattura {adjustInvoice.invoiceNumber}</h3>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustInvoice(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adeguamento (può essere negativo)</label>
                <input
                  type="number"
                  step="0.01"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="Es. -10.00 sconto, 15.00 adeguamento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Motivazione (opzionale)</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="Es. Sconto familiare / Distanza chilometrica"
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotale:</span>
                  <span className="font-medium">{formatCurrency(adjustInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{adjustInvoice.tax === 0 ? 'IVA: Esente (0%)' : 'IVA (22%):'}</span>
                  <span className="font-medium">{formatCurrency(adjustInvoice.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{(parseFloat(adjustAmount || '0')) < 0 ? 'Sconto:' : 'Maggiorazione:'}</span>
                  <span className={(parseFloat(adjustAmount || '0')) < 0 ? 'font-medium text-red-600' : 'font-medium text-teal-700'}>
                    {formatCurrency(parseFloat(adjustAmount || '0'))}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Nuovo Totale:</span>
                    <span className="text-teal-700">{formatCurrency(computedNewTotal())}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustInvoice(null);
                  }}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Annulla
                </button>
                <button
                  onClick={updateInvoicePrice}
                  disabled={updatingPrice}
                  className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {updatingPrice ? 'Salvataggio…' : 'Salva'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}