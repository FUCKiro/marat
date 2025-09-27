import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
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
  const [showPDFGenerator, setShowPDFGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
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
      const success = await sendInvoiceEmail(invoice, invoice.billingInfo.email);
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
    fetchInvoices();
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
          </div>
        </div>

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
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numero Fattura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paziente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scadenza
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {invoice.patientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Euro className="w-4 h-4 text-gray-400" />
                          {formatCurrency(invoice.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {getEmailStatusText(invoice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
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
    </div>
  );
}