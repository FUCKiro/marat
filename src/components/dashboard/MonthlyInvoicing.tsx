import { useState } from 'react';
import { useInvoicing } from '../../hooks/useInvoicing';
import { Calendar, FileText, Users, Euro, Calculator } from 'lucide-react';

export default function MonthlyInvoicing() {
  const {
    loading,
    error,
    success,
    monthlyTotals,
    calculateMonthlyTotals,
    generateAllInvoices
  } = useInvoicing();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [calculationDone, setCalculationDone] = useState(false);

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleCalculateTotals = async () => {
    await calculateMonthlyTotals(selectedYear, selectedMonth);
    setCalculationDone(true);
  };

  const handleGenerateInvoices = async () => {
    const invoices = await generateAllInvoices(selectedYear, selectedMonth);
    if (invoices && invoices.length > 0) {
      setCalculationDone(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalRevenue = monthlyTotals.reduce((sum, total) => sum + total.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Fatturazione Mensile Automatica</h2>
        </div>

        {/* Month/Year Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mese
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleCalculateTotals}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {loading ? 'Calcolando...' : 'Calcola Totali'}
          </button>

          {calculationDone && monthlyTotals.length > 0 && (
            <button
              onClick={handleGenerateInvoices}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Generando...' : 'Genera Fatture'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">Pazienti</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">
                  {monthlyTotals.length}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Euro className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-800">Fatturato</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-green-900">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-purple-800">Periodo</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-purple-900">
                  {months[selectedMonth - 1]} {selectedYear}
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Paziente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ore Totali</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Importo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Terapie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyTotals.map((total) => (
                    <tr key={total.patientId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{total.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{total.billingInfo?.email || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {total.totalHours.toFixed(1)}h
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(total.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {total.items.map(item => item.therapyType).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {monthlyTotals.map((total) => (
                <div key={total.patientId} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
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
                            className="inline-block bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full"
                          >
                            {item.therapyType}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {calculationDone && monthlyTotals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Nessuna visita trovata per il periodo selezionato</p>
            <p className="text-sm">Seleziona un altro mese/anno e riprova</p>
          </div>
        )}
      </div>
    </div>
  );
}