import { useState, useMemo } from 'react';
import { useVisits } from '../../hooks/useVisits';
import { Visit } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  isAdmin: boolean;
  exporting?: boolean;
  onExport?: (month: number, year: number) => Promise<void>;
  onEdit?: (visit: Visit) => void;
  onDelete?: (visitId: string) => void;
  deletingVisit?: string | null;
}

export default function VisitsList({ isAdmin, exporting, onExport, onEdit, onDelete, deletingVisit }: Props) {
  const { visits, usersMap, patientsMap } = useVisits();
  const { currentUser } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const handleEdit = (visit: Visit) => {
    if (onEdit) {
      onEdit(visit);
    }
  };

  const handleDelete = (visitId: string) => {
    setConfirmDeleteId(visitId);
  };

  const confirmDelete = () => {
    if (confirmDeleteId && onDelete) {
      onDelete(confirmDeleteId);
    }
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Get available months from visits for admin selector
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    visits.forEach(visit => {
      const key = `${visit.date.getFullYear()}-${visit.date.getMonth()}`;
      monthsSet.add(key);
    });
    return Array.from(monthsSet)
      .map(key => {
        const [year, month] = key.split('-').map(Number);
        return { year, month };
      })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }, [visits]);

  // For operators: show current and previous month visits
  // For admin: filter by selected month/year
  const filteredVisits = useMemo(() => {
    if (isAdmin) {
      return visits.filter(visit => 
        visit.date.getMonth() === selectedMonth && 
        visit.date.getFullYear() === selectedYear
      );
    } else {
      // Operator: current month + previous month
      return visits.filter(visit => {
        const visitMonth = visit.date.getMonth();
        const visitYear = visit.date.getFullYear();
        const isCurrentMonth = visitMonth === currentMonth && visitYear === currentYear;
        const isPreviousMonth = visitMonth === previousMonth && visitYear === previousMonthYear;
        return isCurrentMonth || isPreviousMonth;
      });
    }
  }, [visits, isAdmin, selectedMonth, selectedYear, currentMonth, currentYear, previousMonth, previousMonthYear]);

  // Separate current month visits from previous month for operator view
  const { currentMonthVisits, previousMonthVisits } = useMemo(() => {
    if (isAdmin) {
      return { currentMonthVisits: filteredVisits, previousMonthVisits: [] as Visit[] };
    }
    return filteredVisits.reduce(
      (acc, visit) => {
        const visitDate = visit.date;
        if (
          visitDate.getMonth() === currentMonth &&
          visitDate.getFullYear() === currentYear
        ) {
          acc.currentMonthVisits.push(visit);
        } else {
          acc.previousMonthVisits.push(visit);
        }
        return acc;
      },
      { currentMonthVisits: [] as Visit[], previousMonthVisits: [] as Visit[] }
    );
  }, [filteredVisits, isAdmin, currentMonth, currentYear]);

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const renderVisitItem = (visit: Visit) => (
    <li key={visit.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-teal-600 mb-2">
            {visit.date.toLocaleDateString('it-IT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-gray-500">Paziente:</span>
              <span className="ml-2 font-medium text-gray-800">
                {patientsMap[visit.patientId]?.name || 'Paziente non trovato'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Tipologia:</span>
              <span className="ml-2 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-xs">
                {visit.type}
              </span>
            </div>
            {isAdmin && (
              <div className="text-sm">
                <span className="text-gray-500">Operatore:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {usersMap[visit.operatorId]?.name || 'Operatore non trovato'}
                </span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-500">Durata:</span>
              <span className="ml-2 font-medium text-gray-800">
                {visit.duration} minuti
              </span>
            </div>
          </div>
        </div>
        {(isAdmin || (currentUser?.role === 'operator' && visit.operatorId === currentUser?.id)) && (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 whitespace-nowrap">
            <button
              onClick={() => handleEdit(visit)}
              className="text-teal-600 hover:text-teal-800 transition-colors font-medium text-sm"
            >
              Modifica
            </button>
            <button
              onClick={() => handleDelete(visit.id)}
              disabled={deletingVisit === visit.id}
              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 font-medium"
            >
              {deletingVisit === visit.id ? 'Eliminazione...' : 'Elimina'}
            </button>
          </div>
        )}
      </div>
      {visit.notes && (
        <div className="mt-2 text-sm text-gray-500">
          {visit.notes}
        </div>
      )}
    </li>
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        {isAdmin ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Visite di {monthNames[selectedMonth]} {selectedYear}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={`${selectedYear}-${selectedMonth}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-').map(Number);
                    setSelectedMonth(month);
                    setSelectedYear(year);
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                >
                  {availableMonths.map(({ year, month }) => (
                    <option key={`${year}-${month}`} value={`${year}-${month}`}>
                      {monthNames[month]} {year}
                    </option>
                  ))}
                </select>
                {onExport && (
                  <button
                    onClick={() => onExport(selectedMonth, selectedYear)}
                    disabled={exporting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {exporting ? 'Esportazione in corso...' : 'Esporta in Excel'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {filteredVisits.length} visite trovate
            </p>
          </>
        ) : (
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Le tue visite
          </h2>
        )}
      </div>
      <div className="border-t border-gray-200">
        {isAdmin ? (
          <ul className="divide-y divide-gray-200">
            {filteredVisits.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-500">
                Nessuna visita trovata per questo mese
              </li>
            ) : (
              filteredVisits.map(renderVisitItem)
            )}
          </ul>
        ) : (
          <>
            {/* Current month for operator */}
            {currentMonthVisits.length > 0 && (
              <>
                <h3 className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <ul className="divide-y divide-gray-200">
                  {currentMonthVisits.map(renderVisitItem)}
                </ul>
              </>
            )}
            
            {/* Previous month for operator */}
            {previousMonthVisits.length > 0 && (
              <>
                <h3 className="px-4 py-2 bg-gray-50 text-gray-700 font-medium mt-4">
                  {monthNames[previousMonth]} {previousMonthYear}
                </h3>
                <ul className="divide-y divide-gray-200">
                  {previousMonthVisits.map(renderVisitItem)}
                </ul>
              </>
            )}

            {currentMonthVisits.length === 0 && previousMonthVisits.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                Nessuna visita trovata
              </div>
            )}
          </>
        )}
      </div>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Conferma eliminazione</h3>
            <p className="text-sm text-gray-600 mb-4">Sei sicuro di voler eliminare questa visita?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingVisit === confirmDeleteId}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}