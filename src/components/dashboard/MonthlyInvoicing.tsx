import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useInvoicing } from '../../hooks/useInvoicing';
import { Calendar, FileText, Users, Euro, Calculator, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Invoice } from '../../types';

export default function MonthlyInvoicing() {
  const {
    loading,
    error,
    success,
    monthlyTotals,
    calculateMonthlyTotals,
    generateAllInvoices,
    clearMonthlyTotals
  } = useInvoicing();

  // Default: mese PRECEDENTE (di solito si fattura il mese appena concluso)
  const getDefaultMonth = () => {
    const now = new Date();
    const prevMonth = now.getMonth(); // getMonth() è 0-indexed, quindi restituisce il mese precedente
    return prevMonth === 0 ? 12 : prevMonth; // Se gennaio, torna dicembre
  };

  const getDefaultYear = () => {
    const now = new Date();
    const prevMonth = now.getMonth();
    return prevMonth === 0 ? now.getFullYear() - 1 : now.getFullYear(); // Se gennaio, anno precedente
  };

  const [selectedYear, setSelectedYear] = useState(getDefaultYear());
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [calculationDone, setCalculationDone] = useState(false);
  const [existingInvoices, setExistingInvoices] = useState<Invoice[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [missingPrices, setMissingPrices] = useState<string[]>([]);

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Verifica se il periodo selezionato è nel futuro
  const isFutureMonth = selectedYear > currentYear || 
    (selectedYear === currentYear && selectedMonth > currentMonth);

  // Carica le fatture esistenti per il periodo selezionato
  const fetchExistingInvoices = async () => {
    if (!db) return;
    setLoadingExisting(true);
    try {
      const invoicesRef = collection(db, 'invoices');
      const q = query(
        invoicesRef,
        where('month', '==', selectedMonth),
        where('year', '==', selectedYear)
      );
      const snapshot = await getDocs(q);
      const invoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
      setExistingInvoices(invoices);
    } catch (err) {
      console.error('Error fetching existing invoices:', err);
    } finally {
      setLoadingExisting(false);
    }
  };

  // Carica fatture esistenti quando cambia il periodo
  useEffect(() => {
    fetchExistingInvoices();
  }, [selectedMonth, selectedYear]);

  // Reset calculation when month or year changes
  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    setCalculationDone(false);
    clearMonthlyTotals();
    setMissingPrices([]);
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    setCalculationDone(false);
    clearMonthlyTotals();
    setMissingPrices([]);
  };

  const handleCalculateTotals = async () => {
    await calculateMonthlyTotals(selectedYear, selectedMonth);
    setCalculationDone(true);
  };

  // Verifica terapie senza prezzo dopo il calcolo
  useEffect(() => {
    if (calculationDone && monthlyTotals.length > 0) {
      const allTherapyTypes = new Set<string>();
      monthlyTotals.forEach(total => {
        total.items.forEach(item => {
          if (item.pricePerHour === 0) {
            allTherapyTypes.add(item.therapyType);
          }
        });
      });
      setMissingPrices(Array.from(allTherapyTypes));
    }
  }, [calculationDone, monthlyTotals]);

  const handleGenerateClick = () => {
    // Mostra modale di conferma
    setShowConfirmModal(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirmModal(false);
    const invoices = await generateAllInvoices(selectedYear, selectedMonth);
    if (invoices && invoices.length > 0) {
      setCalculationDone(false);
      fetchExistingInvoices(); // Ricarica le fatture esistenti
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalRevenue = monthlyTotals.reduce((sum, total) => sum + total.totalAmount, 0);

  // Conta quanti pazienti NON hanno già una fattura
  const patientsWithoutInvoice = monthlyTotals.filter(
    total => !existingInvoices.some(inv => inv.patientId === total.patientId)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Fatturazione Mensile Automatica</h2>
        </div>

        {/* BANNER PERIODO SELEZIONATO - Sempre visibile */}
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          isFutureMonth 
            ? 'bg-red-50 border-red-300' 
            : 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-300'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar className={`w-8 h-8 ${isFutureMonth ? 'text-red-500' : 'text-teal-600'}`} />
              <div>
                <p className={`text-sm font-medium ${isFutureMonth ? 'text-red-600' : 'text-teal-600'}`}>
                  Periodo di fatturazione selezionato:
                </p>
                <p className={`text-2xl font-bold ${isFutureMonth ? 'text-red-700' : 'text-teal-800'}`}>
                  {months[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
            </div>
            {isFutureMonth && (
              <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-md">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">Mese futuro - non puoi generare fatture!</span>
              </div>
            )}
          </div>
        </div>

        {/* Month/Year Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mese delle prestazioni
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isFutureMonth 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anno
            </label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isFutureMonth 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info box - Fatture già esistenti */}
        {!loadingExisting && existingInvoices.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">
                  {existingInvoices.length} fatture già esistenti per {months[selectedMonth - 1]} {selectedYear}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Pazienti: {existingInvoices.map(inv => inv.patientName).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning - Terapie senza prezzo */}
        {missingPrices.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">
                  Attenzione: alcune terapie non hanno un prezzo configurato!
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Terapie senza prezzo: <strong>{missingPrices.join(', ')}</strong>
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Vai in "Gestione Prezzi Terapie" per configurare i prezzi prima di generare le fatture.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleCalculateTotals}
            disabled={loading || isFutureMonth}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {loading ? 'Calcolando...' : 'Calcola Totali'}
          </button>

          {calculationDone && monthlyTotals.length > 0 && patientsWithoutInvoice.length > 0 && (
            <button
              onClick={handleGenerateClick}
              disabled={loading || missingPrices.length > 0}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Generando...' : `Genera ${patientsWithoutInvoice.length} Proforma`}
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
            {success}
          </div>
        )}

        {/* Summary Cards */}
        {calculationDone && monthlyTotals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">Pazienti Totali</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">
                  {monthlyTotals.length}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-800">Da Generare</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-900">
                  {patientsWithoutInvoice.length}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  <span className="text-xs sm:text-sm font-medium text-amber-800">Già Generate</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-900">
                  {existingInvoices.length}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Euro className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-purple-800">Fatturato Totale</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-purple-900">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Totals Table */}
        {calculationDone && monthlyTotals.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dettaglio per Paziente</h3>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stato</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Paziente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ore Totali</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Importo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Terapie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyTotals.map((total) => {
                    const hasExisting = existingInvoices.some(inv => inv.patientId === total.patientId);
                    const hasMissingPrice = total.items.some(item => item.pricePerHour === 0);
                    return (
                      <tr key={total.patientId} className={`hover:bg-gray-50 ${hasExisting ? 'bg-amber-50' : ''}`}>
                        <td className="px-4 py-3">
                          {hasExisting ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Esistente
                            </span>
                          ) : hasMissingPrice ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              Prezzo mancante
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              <FileText className="w-3 h-3" />
                              Da generare
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{total.patientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{total.billingInfo?.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {total.totalHours.toFixed(1)}h
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(total.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {total.items.map((item, idx) => (
                            <span key={idx} className={item.pricePerHour === 0 ? 'text-red-600 font-medium' : ''}>
                              {item.therapyType}{idx < total.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {monthlyTotals.map((total) => {
                const hasExisting = existingInvoices.some(inv => inv.patientId === total.patientId);
                const hasMissingPrice = total.items.some(item => item.pricePerHour === 0);
                return (
                  <div key={total.patientId} className={`bg-white rounded-lg border p-5 shadow-sm ${
                    hasExisting ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          {hasExisting ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Esistente
                            </span>
                          ) : hasMissingPrice ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              Prezzo mancante
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              <FileText className="w-3 h-3" />
                              Da generare
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-base">{total.patientName}</h4>
                        {total.billingInfo?.email && (
                          <p className="text-xs text-gray-500 mt-1 break-all">{total.billingInfo.email}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(total.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {total.totalHours.toFixed(1)}h
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Terapie:</span>
                        <div className="flex flex-wrap gap-2">
                          {total.items.map((item, index) => (
                            <span 
                              key={index}
                              className={`inline-block text-xs px-3 py-1 rounded-full ${
                                item.pricePerHour === 0 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {item.therapyType}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {calculationDone && monthlyTotals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Nessuna visita trovata per {months[selectedMonth - 1]} {selectedYear}</p>
            <p className="text-sm">Verifica che le visite siano state caricate per il periodo selezionato</p>
          </div>
        )}
      </div>

      {/* MODALE DI CONFERMA */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Conferma Generazione Proforma</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Riepilogo */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-teal-600">Periodo di fatturazione:</p>
                    <p className="text-xl font-bold text-teal-800">
                      {months[selectedMonth - 1]} {selectedYear}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-teal-200">
                  <div>
                    <p className="text-sm text-teal-600">Fatture da generare:</p>
                    <p className="text-2xl font-bold text-teal-800">{patientsWithoutInvoice.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-teal-600">Importo totale:</p>
                    <p className="text-2xl font-bold text-teal-800">
                      {formatCurrency(patientsWithoutInvoice.reduce((sum, p) => sum + p.totalAmount, 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista pazienti */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Pazienti:</p>
                <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  {patientsWithoutInvoice.map((p) => (
                    <div key={p.patientId} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{p.patientName}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(p.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Le fatture proforma verranno generate con numero <strong>INV-{selectedYear}{selectedMonth.toString().padStart(2, '0')}-XXXXX</strong>.
                    Verifica che il periodo sia corretto prima di procedere.
                  </p>
                </div>
              </div>

              {/* Bottoni */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleConfirmGenerate}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Conferma e Genera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
