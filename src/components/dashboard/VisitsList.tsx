import React from 'react';
import { useVisits } from '../../hooks/useVisits';
import { Visit } from '../../types';

interface Props {
  isAdmin: boolean;
  exporting?: boolean;
  onExport?: () => Promise<void>;
  onEdit?: (visit: Visit) => void;
  onDelete?: (visitId: string) => void;
  deletingVisit?: string | null;
}

export default function VisitsList({ isAdmin, exporting, onExport, onEdit, onDelete, deletingVisit }: Props) {
  const { visits, usersMap, patientsMap } = useVisits();
  const handleEdit = (visit: Visit) => {
    if (onEdit) {
      onEdit(visit);
    }
  };

  const handleDelete = (visitId: string) => {
    if (onDelete) {
      onDelete(visitId);
    }
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Separate current month visits from older ones
  const { currentMonthVisits, olderVisits } = visits.reduce(
    (acc, visit) => {
      const visitDate = visit.date;
      if (
        visitDate.getMonth() === currentMonth &&
        visitDate.getFullYear() === currentYear
      ) {
        acc.currentMonthVisits.push(visit);
      } else {
        acc.olderVisits.push(visit);
      }
      return acc;
    },
    { currentMonthVisits: [] as Visit[], olderVisits: [] as Visit[] }
  );

  // Group older visits by month
  const groupedOlderVisits = olderVisits.reduce((acc, visit) => {
    const monthYear = visit.date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long'
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(visit);
    return acc;
  }, {} as Record<string, Visit[]>);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Visite {isAdmin ? 'del mese corrente' : ''}
        </h2>
        {isAdmin && onExport && (
          <button
            onClick={onExport}
            disabled={exporting}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {exporting ? 'Esportazione in corso...' : 'Esporta in Excel'}
          </button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {currentMonthVisits.map((visit) => (
            <li key={visit.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-teal-600">
                    {visit.date.toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    Paziente: {patientsMap[visit.patientId]?.name || 'Paziente non trovato'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tipologia: {visit.type}
                  </div>
                  {isAdmin && (
                    <div className="text-sm text-gray-500">
                      Operatore: {usersMap[visit.operatorId]?.name || 'Operatore non trovato'}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Durata: {visit.duration} minuti
                </div>
                {isAdmin && (
                  <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <button
                      onClick={() => handleEdit(visit)}
                      className="text-teal-600 hover:text-teal-800 transition-colors font-medium"
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
          ))}
        </ul>
        
        {isAdmin && Object.entries(groupedOlderVisits).length > 0 && (
          <div className="mt-8">
            {Object.entries(groupedOlderVisits)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([monthYear, monthVisits]) => (
                <div key={monthYear} className="mb-8">
                  <h3 className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">
                    {monthYear}
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {monthVisits.map((visit) => (
                      <li key={visit.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-teal-600">
                              {visit.date.toLocaleDateString('it-IT', {
                                weekday: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              Paziente: {patientsMap[visit.patientId]?.name || 'Paziente non trovato'}
                            </div>
                            {isAdmin && (
                              <div className="text-sm text-gray-500">
                                Operatore: {usersMap[visit.operatorId]?.name || 'Operatore non trovato'}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Durata: {visit.duration} minuti
                          </div>
                          {isAdmin && (
                            <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                              <button
                                onClick={() => handleEdit(visit)}
                               className="text-teal-600 hover:text-teal-800 transition-colors font-medium"
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
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}