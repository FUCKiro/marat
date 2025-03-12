import React from 'react';
import { useVisits } from '../../hooks/useVisits';

interface Props {
  isAdmin: boolean;
  exporting?: boolean;
  onExport?: () => Promise<void>;
}

export default function VisitsList({ isAdmin, exporting, onExport }: Props) {
  const { visits, usersMap, patientsMap } = useVisits();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Visite {isAdmin && 'del mese'}
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
          {visits.map((visit) => (
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
                  {isAdmin && (
                    <div className="text-sm text-gray-500">
                      Operatore: {usersMap[visit.operatorId]?.name || 'Operatore non trovato'}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Durata: {visit.duration} minuti
                </div>
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
    </div>
  );
}