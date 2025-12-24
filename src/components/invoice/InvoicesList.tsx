import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, Timestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Invoice } from '../../types';
import InvoicePDFGenerator from './InvoicePDFGenerator';
import { useInvoicing } from '../../hooks/useInvoicing';
import { sendInvoiceEmail, getEmailStatusText, canSendProformaEmail, canSendFinalEmail } from '../../services/emailService';
import { FileText, Eye, Calendar, Euro, User, CheckCircle, Clock, AlertCircle, CreditCard, Send, Search, Filter, Trash2, Edit2, TrendingUp, ChevronUp, ChevronDown, Banknote } from 'lucide-react';

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
  const [adjustType, setAdjustType] = useState<'discount' | 'surcharge'>('discount');
  const [invoiceNotes, setInvoiceNotes] = useState<string>('');
  const [updatingPrice, setUpdatingPrice] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string | 'all'>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'status' | 'patient'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [markingAsPaid, setMarkingAsPaid] = useState<string | null>(null);
  const [showEditProformaModal, setShowEditProformaModal] = useState(false);
  const [editProforma, setEditProforma] = useState<Invoice | null>(null);
  const [editPatientName, setEditPatientName] = useState<string>('');
  const [editPatientEmail, setEditPatientEmail] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editMonth, setEditMonth] = useState<number>(1);
  const [editYear, setEditYear] = useState<number>(2025);
  const [editInvoiceNumber, setEditInvoiceNumber] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const { convertToFinalInvoice } = useInvoicing();

  // Mesi in italiano
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

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
          createdAt: (data.createdAt as Timestamp).toDate()
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
    if (!window.confirm('Sei sicuro di voler modificare il prezzo di questa fattura?')) return;

    setAdjustInvoice(invoice);
    setAdjustReason(invoice.adjustmentReason ?? '');
    setInvoiceNotes(invoice.notes ?? '');
    
    // Converti l'adjustmentAmount da euro a percentuale
    const adjustmentEuro = invoice.adjustmentAmount ?? 0;
    if (adjustmentEuro !== 0) {
      // Calcola la percentuale dal valore in euro
      const percentage = (Math.abs(adjustmentEuro) / invoice.subtotal) * 100;
      setAdjustAmount(String(Math.round(percentage * 10) / 10)); // Arrotonda a 1 decimale
      // Se è negativo, è sconto; se positivo, è sovraprezzo
      setAdjustType(adjustmentEuro < 0 ? 'discount' : 'surcharge');
    } else {
      setAdjustAmount('0');
      setAdjustType('discount');
    }
    
    setShowAdjustModal(true);
  };

  const computedNewTotal = () => {
    if (!adjustInvoice) return 0;
    const percentage = parseFloat(adjustAmount || '0');
    // Calcola l'adeguamento in euro dalla percentuale sul subtotale
    const adjustmentAmount = isNaN(percentage) ? 0 : (adjustInvoice.subtotal * percentage / 100);
    // Se è sconto, sottrai; se è sovraprezzo, somma
    const finalAdjustment = adjustType === 'discount' ? -adjustmentAmount : adjustmentAmount;
    const newTotal = adjustInvoice.subtotal + adjustInvoice.tax + finalAdjustment;
    return Math.round(newTotal * 100) / 100;
  };

  const updateInvoicePrice = async () => {
    if (!db || !adjustInvoice) return;
    setUpdatingPrice(true);
    try {
      const percentage = parseFloat(adjustAmount || '0');
      const adjustmentAmount = isNaN(percentage) ? 0 : (adjustInvoice.subtotal * percentage / 100);
      // Salva come negativo se sconto, positivo se sovraprezzo
      const finalAdjustment = adjustType === 'discount' ? -adjustmentAmount : adjustmentAmount;
      const newTotal = computedNewTotal();
      const invoiceRef = doc(db, 'invoices', adjustInvoice.id);
      await updateDoc(invoiceRef, {
        adjustmentAmount: finalAdjustment,
        adjustmentReason: adjustReason || '',
        notes: invoiceNotes || '',
        total: newTotal
      });

      setInvoices(prev => prev.map(inv =>
        inv.id === adjustInvoice.id
          ? { ...inv, adjustmentAmount: finalAdjustment, adjustmentReason: adjustReason || '', notes: invoiceNotes || '', total: newTotal }
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
    const isProforma = invoice.status === 'proforma';
    const isResend = isProforma ? invoice.proformaEmailSentAt : invoice.finalEmailSentAt;
    
    const confirmMessage = isResend 
      ? `Questa ${isProforma ? 'proforma' : 'fattura'} è già stata inviata. Vuoi reinviarla a ${invoice.billingInfo.email}?`
      : `Sei sicuro di voler inviare questa ${isProforma ? 'proforma' : 'fattura'} a ${invoice.billingInfo.email}?`;
    
    if (!window.confirm(confirmMessage)) return;

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
            
            <!-- Notes Section -->
            ${invoice.notes ? `
            <div style="margin-bottom: 20px; padding: 12px; background: #f9fafb; border: 2px solid #d1d5db; border-radius: 6px; min-height: 60px;">
              <h3 style="font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 6px;">Note:</h3>
              <p style="font-size: 10px; color: #6b7280; line-height: 1.4; white-space: pre-wrap; margin: 0;">${invoice.notes}</p>
            </div>
            ` : ''}
            
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
            createdAt: (data.createdAt as Timestamp).toDate()
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

  // Funzione per aprire il modale di conferma eliminazione
  const openDeleteConfirmModal = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteConfirmText('');
    setShowDeleteConfirmModal(true);
  };

  // Funzione per eliminare una fattura proforma con conferma forte
  const handleDeleteProforma = async () => {
    if (!invoiceToDelete || !db) return;
    
    setDeletingId(invoiceToDelete.id);
    
    try {
      const invoiceRef = doc(db, 'invoices', invoiceToDelete.id);
      await deleteDoc(invoiceRef);
      
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
      setSuccess('Fattura proforma eliminata con successo');
      setShowDeleteConfirmModal(false);
      setInvoiceToDelete(null);
      setDeleteConfirmText('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Errore nell\'eliminazione della fattura:', err);
      setError('Errore nell\'eliminazione della fattura');
    } finally {
      setDeletingId(null);
    }
  };

  // Funzione per segnare una fattura come pagata
  const handleMarkAsPaid = async (invoice: Invoice) => {
    if (!db) return;
    
    setMarkingAsPaid(invoice.id);
    try {
      const invoiceRef = doc(db, 'invoices', invoice.id);
      await updateDoc(invoiceRef, { status: 'paid' });
      
      setInvoices(prev => prev.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'paid' as const } : inv
      ));
      setSuccess(`Fattura ${invoice.invoiceNumber} segnata come pagata`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Errore nel segnare come pagata:', err);
      setError('Errore nell\'aggiornamento dello stato');
    } finally {
      setMarkingAsPaid(null);
    }
  };

  // Funzione per aprire il modale di modifica proforma
  const handleOpenEditProformaModal = (invoice: Invoice) => {
    setEditProforma(invoice);
    setEditPatientName(invoice.patientName);
    setEditPatientEmail(invoice.billingInfo.email || '');
    setEditDescription(invoice.description || '');
    setEditMonth(invoice.month);
    setEditYear(invoice.year);
    setEditInvoiceNumber(invoice.invoiceNumber);
    setShowEditProformaModal(true);
  };

  // Funzione per salvare le modifiche della proforma
  const handleSaveProformaEdit = async () => {
    if (!db || !editProforma) return;
    if (!editPatientName.trim()) {
      setError('Nome del paziente è obbligatorio');
      return;
    }
    if (!editInvoiceNumber.trim()) {
      setError('Numero fattura è obbligatorio');
      return;
    }

    setSavingEdit(true);
    try {
      const invoiceRef = doc(db, 'invoices', editProforma.id);
      
      // Update billing info with new email and patient name
      const updatedBillingInfo = {
        ...editProforma.billingInfo,
        email: editPatientEmail
      };

      await updateDoc(invoiceRef, {
        patientName: editPatientName,
        billingInfo: updatedBillingInfo,
        description: editDescription || '',
        month: editMonth,
        year: editYear,
        invoiceNumber: editInvoiceNumber
      });

      // Update local state
      setInvoices(prev => prev.map(inv => 
        inv.id === editProforma.id 
          ? {
              ...inv,
              patientName: editPatientName,
              billingInfo: updatedBillingInfo,
              description: editDescription || '',
              month: editMonth,
              year: editYear,
              invoiceNumber: editInvoiceNumber
            }
          : inv
      ));

      setSuccess('Fattura proforma modificata con successo');
      setShowEditProformaModal(false);
      setEditProforma(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Errore nell\'aggiornamento della fattura:', err);
      setError('Errore nell\'aggiornamento della fattura');
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter invoices based on search term, status, year, and month
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    const matchesYear = selectedYear === 'all' || invoice.year.toString() === selectedYear;
    
    const matchesMonth = selectedMonth === 'all' || invoice.month.toString() === selectedMonth;
    
    return matchesSearch && matchesStatus && matchesYear && matchesMonth;
  });

  // Sort filtered invoices based on sortField and sortDirection
  const sortedFilteredInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'date':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'amount':
        comparison = a.total - b.total;
        break;
      case 'status':
        const statusOrder = { proforma: 0, final: 1, sent: 2, paid: 3, closed: 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'patient':
        comparison = a.patientName.localeCompare(b.patientName);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle column sort
  const handleSort = (field: 'date' | 'amount' | 'status' | 'patient') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get available years from invoices (based on period, not creation date)
  const availableYears = Array.from(new Set(invoices.map(inv => inv.year)))
    .sort((a, b) => b - a);

  // Get available months based on selected year
  const availableMonths = selectedYear !== 'all'
    ? Array.from(new Set(invoices.filter(inv => inv.year.toString() === selectedYear).map(inv => inv.month)))
        .sort((a, b) => b - a)
    : [];

  // Calculate statistics
  const stats = {
    totalInvoices: filteredInvoices.length,
    totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pendingAmount: filteredInvoices.filter(inv => ['proforma', 'final', 'sent'].includes(inv.status)).reduce((sum, inv) => sum + inv.total, 0),
    paidCount: filteredInvoices.filter(inv => inv.status === 'paid').length,
    proformaCount: filteredInvoices.filter(inv => inv.status === 'proforma').length
  };

  // Group invoices by month for display
  const groupedInvoices = sortedFilteredInvoices.reduce((acc, invoice) => {
    const monthYear = `${monthNames[invoice.month - 1]} ${invoice.year}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(invoice);
    return acc;
  }, {} as Record<string, Invoice[]>);

  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedInvoices).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(parseInt(yearA), monthNames.indexOf(monthA));
    const dateB = new Date(parseInt(yearB), monthNames.indexOf(monthB));
    return dateB.getTime() - dateA.getTime();
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Totale Fatture</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Importo Totale</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Incassato</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Da Incassare</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.pendingAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
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
                <option value="closed">Chiusa</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth('all'); }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="all">Tutti gli anni</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {selectedYear !== 'all' && availableMonths.length > 0 && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="all">Tutti i mesi</option>
                {availableMonths.map(month => (
                  <option key={month} value={month.toString()}>
                    {monthNames[month - 1]}
                  </option>
                ))}
              </select>
            )}
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
              {sortedMonths.map((monthYear) => (
                <div key={monthYear} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border-l-4 border-teal-600">
                    {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
                  </h3>
                  <table className="w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Numero Fattura
                        </th>
                        <th 
                          onClick={() => handleSort('patient')}
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                        >
                          <div className="flex items-center gap-1">
                            Paziente
                            {sortField === 'patient' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Periodo
                        </th>
                        <th 
                          onClick={() => handleSort('date')}
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                        >
                          <div className="flex items-center gap-1">
                            Emessa il
                            {sortField === 'date' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('amount')}
                          className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                        >
                          <div className="flex items-center justify-end gap-1">
                            Importo
                            {sortField === 'amount' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('status')}
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                        >
                          <div className="flex items-center gap-1">
                            Stato
                            {sortField === 'status' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Email
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupedInvoices[monthYear].map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[140px]">{invoice.patientName}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            <span className="font-medium">
                              {new Date(invoice.year, invoice.month - 1).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(invoice.createdAt)}
                          </td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-900 text-right whitespace-nowrap">
                            {formatCurrency(invoice.total)}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(invoice.status)}`}> 
                              {getStatusText(invoice.status)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-500 max-w-[180px]">
                            <span className="line-clamp-2">{getEmailStatusText(invoice)}</span>
                          </td>
                          <td className="px-3 py-3 text-sm">
                            <div className="flex flex-wrap items-center gap-1.5">
                               {/* Visualizza PDF */}
                               <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowPDFGenerator(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-50 text-teal-700 rounded hover:bg-teal-100 transition-colors"
                                  title="Visualizza fattura"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>PDF</span>
                                </button>

                                {/* Modifica Prezzo */}
                                <button
                                  onClick={() => openAdjustModal(invoice)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors"
                                  title="Modifica prezzo"
                                >
                                  <Euro className="w-3.5 h-3.5" />
                                  <span>Prezzo</span>
                                </button>
                               
                               {/* Invia Email Proforma */}
                               {canSendProformaEmail(invoice) && (
                                  <button
                                    onClick={() => handleSendEmail(invoice)}
                                    disabled={sendingEmail === invoice.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                                    title={invoice.proformaEmailSentAt ? "Reinvia email proforma" : "Invia email proforma"}
                                  >
                                    {sendingEmail === invoice.id ? (
                                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-600"></div>
                                    ) : (
                                      <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span>{invoice.proformaEmailSentAt ? 'Reinvia' : 'Email'}</span>
                                  </button>
                                )}
                                
                                {/* Invia Email Finale */}
                                {canSendFinalEmail(invoice) && (
                                  <button
                                    onClick={() => handleSendEmail(invoice)}
                                    disabled={sendingEmail === invoice.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-50 text-teal-700 rounded hover:bg-teal-100 transition-colors disabled:opacity-50"
                                    title={invoice.finalEmailSentAt ? "Reinvia email fattura finale" : "Invia email fattura finale"}
                                  >
                                    {sendingEmail === invoice.id ? (
                                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-teal-600"></div>
                                    ) : (
                                      <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span>{invoice.finalEmailSentAt ? 'Reinvia' : 'Email'}</span>
                                  </button>
                                )}
                               
                               {/* Azioni Proforma */}
                               {invoice.status === 'proforma' && (
                                 <>
                                   <button
                                     onClick={() => handleOpenEditProformaModal(invoice)}
                                     className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                                     title="Modifica proforma"
                                   >
                                     <Edit2 className="w-3.5 h-3.5" />
                                     <span>Modifica</span>
                                   </button>
                                   <button
                                     onClick={() => openDeleteConfirmModal(invoice)}
                                     disabled={deletingId === invoice.id}
                                     className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                                     title="Elimina proforma"
                                   >
                                     {deletingId === invoice.id ? (
                                       <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600"></div>
                                     ) : (
                                       <Trash2 className="w-3.5 h-3.5" />
                                     )}
                                     <span>Elimina</span>
                                   </button>
                                   <button
                                     onClick={async () => {
                                       if (!window.confirm('Sei sicuro di voler convertire questa proforma in fattura finale? L\'operazione è irreversibile.')) return;
                                       const success = await convertToFinalInvoice(invoice.id);
                                       if (success) {
                                         fetchInvoices();
                                       }
                                     }}
                                     className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                                     title="Converti in fattura finale (pagamento ricevuto)"
                                   >
                                     <CreditCard className="w-3.5 h-3.5" />
                                     <span>Converti</span>
                                   </button>
                                 </>
                               )}
                               
                               {/* Segna come pagata - per fatture finali o inviate */}
                               {(invoice.status === 'final' || invoice.status === 'sent') && (
                                 <button
                                   onClick={() => handleMarkAsPaid(invoice)}
                                   disabled={markingAsPaid === invoice.id}
                                   className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
                                   title="Segna come pagata"
                                 >
                                   {markingAsPaid === invoice.id ? (
                                     <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-green-600"></div>
                                   ) : (
                                     <Banknote className="w-3.5 h-3.5" />
                                   )}
                                   <span>Pagata</span>
                                 </button>
                               )}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-8">
              {sortedMonths.map((monthYear) => (
                <div key={monthYear}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border-l-4 border-teal-600">
                    {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
                  </h3>
                  <div className="space-y-4">
                    {groupedInvoices[monthYear].map((invoice) => (
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
                              <span className="font-medium">Periodo:</span>
                            </div>
                            <div className="text-gray-900 font-semibold">
                              {new Date(invoice.year, invoice.month - 1).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                            </div>
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
                            <span className="font-medium">Emessa il:</span> {formatDate(invoice.createdAt)}
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
                                {invoice.proformaEmailSentAt ? 'Reinvia Proforma' : 'Email Proforma'}
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
                                {invoice.finalEmailSentAt ? 'Reinvia Finale' : 'Email Finale'}
                              </button>
                            )}
                           
                           {invoice.status === 'proforma' && (
                             <>
                               <button
                                 onClick={() => handleOpenEditProformaModal(invoice)}
                                 className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                               >
                                 <Edit2 className="w-4 h-4" />
                                 Modifica
                               </button>
                               <button
                                 onClick={() => openDeleteConfirmModal(invoice)}
                                 disabled={deletingId === invoice.id}
                                 className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                               >
                                 {deletingId === invoice.id ? (
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                 ) : (
                                   <Trash2 className="w-4 h-4" />
                                 )}
                                 Elimina
                               </button>
                               <button
                                 onClick={async () => {
                                   if (!window.confirm('Sei sicuro di voler convertire questa proforma in fattura finale? L\'operazione è irreversibile.')) return;
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
                             </>
                           )}
                           
                           {(invoice.status === 'final' || invoice.status === 'sent') && (
                             <button
                               onClick={() => handleMarkAsPaid(invoice)}
                               disabled={markingAsPaid === invoice.id}
                               className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                             >
                               {markingAsPaid === invoice.id ? (
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                               ) : (
                                 <Banknote className="w-4 h-4" />
                               )}
                               Pagata
                             </button>
                           )}
                        </div>
                      </div>
                    ))}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di adeguamento</label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="discount"
                      name="adjustType"
                      value="discount"
                      checked={adjustType === 'discount'}
                      onChange={() => setAdjustType('discount')}
                      className="h-4 w-4 text-teal-600"
                    />
                    <label htmlFor="discount" className="ml-2 text-sm text-gray-700">Sconto</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="surcharge"
                      name="adjustType"
                      value="surcharge"
                      checked={adjustType === 'surcharge'}
                      onChange={() => setAdjustType('surcharge')}
                      className="h-4 w-4 text-teal-600"
                    />
                    <label htmlFor="surcharge" className="ml-2 text-sm text-gray-700">Sovraprezzo</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {adjustType === 'discount' ? 'Sconto percentuale (%)' : 'Sovraprezzo percentuale (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder={adjustType === 'discount' ? 'Es. 10 per uno sconto del 10%' : 'Es. 5 per un sovraprezzo del 5%'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Note sulla fattura (opzionale)</label>
                <textarea
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="Aggiungi note che appariranno nella fattura..."
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
                  <span className="text-gray-600">
                    {adjustType === 'discount' ? `Sconto (${adjustAmount}%):` : `Sovraprezzo (${adjustAmount}%):`}
                  </span>
                  <span className={adjustType === 'discount' ? 'font-medium text-red-600' : 'font-medium text-green-600'}>
                    {adjustType === 'discount' 
                      ? `-${formatCurrency(adjustInvoice.subtotal * parseFloat(adjustAmount || '0') / 100)}`
                      : `+${formatCurrency(adjustInvoice.subtotal * parseFloat(adjustAmount || '0') / 100)}`
                    }
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

      {/* Edit Proforma Modal */}
      {showEditProformaModal && editProforma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Modifica Fattura Proforma</h3>
              <button
                onClick={() => {
                  setShowEditProformaModal(false);
                  setEditProforma(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Numero Fattura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numero Fattura *
                </label>
                <input
                  type="text"
                  value={editInvoiceNumber}
                  onChange={(e) => setEditInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="INV-202512-XXXXX"
                />
              </div>

              {/* Mese e Anno */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mese *
                  </label>
                  <select
                    value={editMonth}
                    onChange={(e) => setEditMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value={1}>Gennaio</option>
                    <option value={2}>Febbraio</option>
                    <option value={3}>Marzo</option>
                    <option value={4}>Aprile</option>
                    <option value={5}>Maggio</option>
                    <option value={6}>Giugno</option>
                    <option value={7}>Luglio</option>
                    <option value={8}>Agosto</option>
                    <option value={9}>Settembre</option>
                    <option value={10}>Ottobre</option>
                    <option value={11}>Novembre</option>
                    <option value={12}>Dicembre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anno *
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>

              {/* Nome Paziente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Paziente *
                </label>
                <input
                  type="text"
                  value={editPatientName}
                  onChange={(e) => setEditPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Nome del paziente"
                />
              </div>

              {/* Email Paziente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email del Paziente
                </label>
                <input
                  type="email"
                  value={editPatientEmail}
                  onChange={(e) => setEditPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="email@example.com"
                />
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione (opzionale)
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Aggiungi una descrizione..."
                />
              </div>

              {/* Info Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Data Creazione:</span>
                  <span className="font-medium">{formatDate(editProforma.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Importo Totale:</span>
                  <span className="font-medium text-teal-600">{formatCurrency(editProforma.total)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditProformaModal(false);
                    setEditProforma(null);
                  }}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveProformaEdit}
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {savingEdit ? 'Salvataggio…' : 'Salva Modifiche'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && invoiceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Conferma Eliminazione</h3>
                  <p className="text-sm text-gray-500">Questa azione è irreversibile</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Stai per eliminare la fattura proforma:
                </p>
                <p className="font-semibold text-gray-900">{invoiceToDelete.invoiceNumber}</p>
                <p className="text-sm text-gray-600">{invoiceToDelete.patientName}</p>
                <p className="text-sm text-gray-600">{formatCurrency(invoiceToDelete.total)}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per confermare, digita <span className="font-bold text-red-600">ELIMINA</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Digita ELIMINA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setInvoiceToDelete(null);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Annulla
                </button>
                <button
                  onClick={handleDeleteProforma}
                  disabled={deleteConfirmText !== 'ELIMINA' || deletingId === invoiceToDelete.id}
                  className="flex-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === invoiceToDelete.id ? 'Eliminazione...' : 'Elimina Fattura'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}