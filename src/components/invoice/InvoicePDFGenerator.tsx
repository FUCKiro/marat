import { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '../../types';
import { sendInvoiceEmail, validateEmailConfiguration } from '../../services/emailService';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  invoice: Invoice;
  onPDFGenerated?: (pdfBlob: Blob) => void;
  onEmailSent?: () => void;
}

export default function InvoicePDFGenerator({ invoice, onPDFGenerated, onEmailSent }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getDocumentTitle = () => {
    switch (invoice.status) {
      case 'proforma':
        return 'FATTURA PROFORMA';
      case 'final':
      case 'sent':
      case 'paid':
      case 'overdue':
      case 'closed':
        return 'FATTURA';
      default:
        return 'FATTURA';
    }
  };

  const getDocumentDescription = () => {
    switch (invoice.status) {
      case 'proforma':
        return 'Documento non valido ai fini fiscali - Convertire in fattura finale per la validità fiscale';
      case 'final':
        return 'Documento valido ai fini fiscali';
      case 'sent':
        return 'Documento valido ai fini fiscali - Inviato';
      case 'paid':
        return 'Documento valido ai fini fiscali - Pagato';
      case 'overdue':
        return 'Documento valido ai fini fiscali - Scaduto';
      case 'closed':
        return 'Documento valido ai fini fiscali - Chiuso';
      default:
        return 'Documento valido ai fini fiscali';
    }
  };

  const sendEmailWithInvoice = async () => {
    setEmailSending(true);
    setEmailError('');

    try {
      const billingEmail = invoice.billingInfo?.email;
      if (!billingEmail) {
        setEmailError('Email di fatturazione non disponibile.');
        return;
      }
      
      const success = await sendInvoiceEmail(invoice, billingEmail);
      if (success) {
        setEmailSent(true);
        if (onEmailSent) {
          onEmailSent();
        }
      } else {
        setEmailError('Errore nell\'invio dell\'email. Riprova.');
      }
    } catch (error) {
      console.error('Errore invio email:', error);
      setEmailError('Errore nell\'invio dell\'email. Verifica la configurazione.');
    } finally {
      setEmailSending(false);
    }
  };

  const isEmailConfigured = validateEmailConfiguration();
  const canSendEmail = isEmailConfigured && invoice.billingInfo?.email && !emailSent;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT').format(date);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      // Capture the invoice as canvas
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate blob and trigger download
      const pdfBlob = pdf.output('blob');
      
      if (onPDFGenerated) {
        onPDFGenerated(pdfBlob);
      }

      // Download PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fattura_${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Errore nella generazione del PDF:', error);
      alert('Errore nella generazione del PDF. Riprova.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Scarica PDF
        </button>

        {canSendEmail && (
          <button
            onClick={sendEmailWithInvoice}
            disabled={emailSending}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            {emailSending ? 'Invio...' : 'Invia Email'}
          </button>
        )}

        {emailSent && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md">
            <CheckCircle className="w-4 h-4" />
            Email inviata
          </div>
        )}
      </div>

      {/* Messages */}
      {emailError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <AlertCircle className="w-4 h-4" />
          {emailError}
        </div>
      )}

      {!isEmailConfigured && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <AlertCircle className="w-4 h-4" />
          Configurazione email non completata. Contatta l'amministratore.
        </div>
      )}

      {!invoice.billingInfo?.email && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <AlertCircle className="w-4 h-4" />
          Email di fatturazione non disponibile.
        </div>
      )}

      {/* Invoice Preview */}
      <div 
        ref={invoiceRef}
        className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm max-w-4xl mx-auto"
        style={{ minHeight: '297mm' }} // A4 height
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{getDocumentTitle()}</h1>
            <div className="text-gray-600">
              <p className="font-semibold">Associazione Maratonda</p>
              <p>Largo Bacone 16</p>
              <p>00137 Roma</p>
              <p>P.IVA: 12345678901</p>
              <p>Tel: +39 351 479 0620</p>
              <p>Email: associazionemaratonda@gmail.com</p>
            </div>
            {invoice.status === 'proforma' && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">
                  {getDocumentDescription()}
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`border rounded-lg p-4 ${
              invoice.status === 'proforma' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-teal-50 border-teal-200'
            }`}>
              <p className="text-sm text-gray-600">
                {invoice.status === 'proforma' ? 'Numero Proforma' : 'Numero Fattura'}
              </p>
              <p className={`text-2xl font-bold ${
                invoice.status === 'proforma' ? 'text-orange-700' : 'text-teal-700'
              }`}>
                {invoice.invoiceNumber}
              </p>
              <p className="text-sm text-gray-600 mt-2">Data: {formatDate(invoice.createdAt)}</p>
              <p className="text-sm text-gray-600">Scadenza: {formatDate(invoice.dueDate)}</p>
              {invoice.status !== 'proforma' && (
                <p className="text-xs text-gray-500 mt-2">{getDocumentDescription()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Fatturato a:</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {invoice.billingInfo ? (
              <>
                <p className="font-semibold text-gray-800">
                  {invoice.billingInfo.parentName} {invoice.billingInfo.parentSurname}
                </p>
                <p className="text-gray-600">{invoice.billingInfo.address}</p>
                <p className="text-gray-600">{invoice.billingInfo.postalCode} {invoice.billingInfo.city} ({invoice.billingInfo.province})</p>
                {invoice.billingInfo.fiscalCode && (
                  <p className="text-gray-600">C.F.: {invoice.billingInfo.fiscalCode}</p>
                )}
                {invoice.billingInfo.vatNumber && (
                  <p className="text-gray-600">P.IVA: {invoice.billingInfo.vatNumber}</p>
                )}
                {invoice.billingInfo.email && (
                  <p className="text-gray-600">{invoice.billingInfo.email}</p>
                )}
                {invoice.billingInfo.phone && (
                  <p className="text-gray-600">Tel: {invoice.billingInfo.phone}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">Paziente: {invoice.patientName}</p>
              </>
            ) : (
              <p className="font-semibold text-gray-800">{invoice.patientName}</p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dettaglio Servizi</h2>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ore
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prezzo/Ora (IVA inclusa)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Totale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.therapyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {item.hours.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(item.pricePerHour)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotale:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (22%):</span>
                <span className="font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Totale:</span>
                  <span className="text-teal-700">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Modalità di Pagamento</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Bonifico Bancario:</strong>
            </p>
            <p className="text-sm text-gray-600">IBAN: IT60 X054 2811 1010 0000 0123 456</p>
                  <p className="text-sm text-gray-600">Intestato a: Associazione Maratonda</p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Causale:</strong> Fattura n. {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            {invoice.status === 'proforma' 
              ? 'Questa fattura proforma è stata generata automaticamente dal sistema di gestione dell\'Associazione Maratonda'
              : 'Questa fattura è stata generata automaticamente dal sistema di gestione dell\'Associazione Maratonda'
            }
          </p>
          <p className="mt-1">Per informazioni: associazionemaratonda@gmail.com | Tel: +39 351 479 0620</p>
          {invoice.status === 'proforma' && (
            <p className="mt-2 text-orange-600 font-medium">
              ATTENZIONE: Questo documento non ha valore fiscale fino alla conversione in fattura finale
            </p>
          )}
        </div>
      </div>
    </div>
  );
}