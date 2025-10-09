import React from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight, Users, Filter, Calendar, CreditCard, User as UserIcon, Eye, Edit, Trash2 } from 'lucide-react';
import { User, Patient } from '../../types';
import { useState, useMemo } from 'react';

interface Props {
  users: User[];
  type: 'operators' | 'patients';
  title: string;
  onDeleteUser: (userId: string) => Promise<void>;
  deletingUser: string | null;
  onEditUser?: (user: User) => void;
}

export default function UsersList({ users, type, title, onDeleteUser, deletingUser, onEditUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  
  const itemsPerPage = type === 'patients' ? 10 : 20; // Più pazienti per pagina

  // Filtra e ordina gli utenti
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => 
      type === 'operators' ? user.role === 'operator' : user.role === 'patient'
    );

    // Applica ricerca
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchLower);
        const matchesEmail = user.email && user.email.toLowerCase().includes(searchLower);
        
        // Per i pazienti, cerca anche nei dati del genitore e fatturazione
        if (user.role === 'patient') {
          const patient = user as Patient;
          const matchesParent = patient.parentName?.toLowerCase().includes(searchLower) ||
                               patient.parentSurname?.toLowerCase().includes(searchLower);
          const matchesBilling = patient.billingInfo?.fiscalCode?.toLowerCase().includes(searchLower) ||
                                patient.billingInfo?.city?.toLowerCase().includes(searchLower) ||
                                patient.billingInfo?.email?.toLowerCase().includes(searchLower);
          return matchesName || matchesEmail || matchesParent || matchesBilling;
        }
        
        return matchesName || matchesEmail;
      });
    }

    // Applica filtro data
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(user => user.createdAt >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(user => user.createdAt >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(user => user.createdAt >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(user => user.createdAt >= filterDate);
          break;
      }
    }

    // Ordina
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'name':
          aValue = (a.name || '').trim().toLowerCase();
          bValue = (b.name || '').trim().toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').trim().toLowerCase();
          bValue = (b.email || '').trim().toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, type, searchTerm, dateFilter, sortBy, sortOrder]);

  // Paginazione
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagina quando cambiano i filtri
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'email' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div 
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer md:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title} ({filteredAndSortedUsers.length})
          </h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      
      <div className={`border-t border-gray-200 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Barra di ricerca e filtri */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo di ricerca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Cerca ${type === 'patients' ? 'pazienti' : 'operatori'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            {/* Pulsante filtri */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                showFilters || dateFilter !== 'all'
                  ? 'border-teal-300 bg-teal-50 text-teal-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtri
            </button>
          </div>
          
          {/* Filtri avanzati */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-end gap-3">
                {/* Filtro data */}
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-700 mb-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Periodo registrazione
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="all">Tutti i periodi</option>
                    <option value="today">Oggi</option>
                    <option value="week">Ultima settimana</option>
                    <option value="month">Ultimo mese</option>
                    <option value="year">Ultimo anno</option>
                  </select>
                </div>
                
                {/* Reset filtri */}
                {dateFilter !== 'all' && (
                  <div className="flex items-end">
                    <button
                      onClick={() => setDateFilter('all')}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Header tabella con ordinamento */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 hidden sm:block">
          <div className={`grid gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider ${
            type === 'patients' ? 'grid-cols-4' : 'grid-cols-3'
          }`}>
            <button
              onClick={() => handleSort('name')}
              className="text-left hover:text-gray-700 flex items-center gap-1"
            >
              Nome
              {sortBy === 'name' && (
                <span className="text-teal-600">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button
              onClick={() => handleSort('email')}
              className="text-left hover:text-gray-700 flex items-center gap-1"
            >
              {sortBy === 'email' && (
                <span className="text-teal-600">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            {type === 'patients' && (
              <div className="text-left">
              </div>
            )}
            <button
              onClick={() => handleSort('createdAt')}
              className="text-left hover:text-gray-700 flex items-center gap-1"
            >
              {sortBy === 'createdAt' && (
                <span className="text-teal-600">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Lista utenti */}
        <ul className="divide-y divide-gray-200">
          {paginatedUsers.map((user: User) => {
            const patient = user.role === 'patient' ? user as Patient : null;
            
            return (
              <li key={user.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <div className="text-sm font-medium text-teal-600 truncate">
                        {user.name}
                      </div>
                    </div>
                    
                    {/* Dettagli espandibili solo per i pazienti */}
                    {patient && expandedPatient === user.id && (
                      <div className="space-y-1 mt-3 pl-6 border-l-2 border-teal-100">
                        <div className="text-sm text-gray-500">
                          Genitore: {patient.parentName} {patient.parentSurname}
                        </div>
                        
                        {patient.billingInfo && (
                          <div className="flex items-start gap-2 mt-2">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>CF: {patient.billingInfo.fiscalCode}</div>
                              <div>{patient.billingInfo.address}, {patient.billingInfo.city} ({patient.billingInfo.province}) {patient.billingInfo.postalCode}</div>
                              {patient.billingInfo.email && (
                                <div>Email fatturazione: {patient.billingInfo.email}</div>
                              )}
                              {patient.billingInfo.phone && (
                                <div>Tel: {patient.billingInfo.phone}</div>
                              )}
                              {patient.billingInfo.vatNumber && (
                                <div>P.IVA: {patient.billingInfo.vatNumber}</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {patient.medicalNotes && (
                          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded mt-2">
                            <strong>Note mediche:</strong> {patient.medicalNotes}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-2">
                          Registrato: {user.createdAt.toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-4 gap-2">
                    {/* Pulsante Visualizza solo per i pazienti */}
                    {patient && (
                      <button
                        onClick={() => setExpandedPatient(expandedPatient === user.id ? null : user.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm px-3 py-1 rounded border border-blue-200 hover:border-blue-300 flex items-center gap-1 sm:gap-1"
                        title={expandedPatient === user.id ? 'Nascondi dettagli' : 'Visualizza dettagli'}
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {expandedPatient === user.id ? 'Nascondi' : 'Visualizza'}
                        </span>
                      </button>
                    )}
                    {onEditUser && (
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-teal-600 hover:text-teal-800 transition-colors text-sm px-3 py-1 rounded border border-teal-200 hover:border-teal-300 flex items-center gap-1"
                        title="Modifica utente"
                      >
                        <Edit className="w-3 h-3" />
                        <span className="hidden sm:inline">Modifica</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      disabled={deletingUser === user.id}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 text-sm px-3 py-1 rounded border border-red-200 hover:border-red-300 flex items-center gap-1"
                      title="Elimina utente"
                    >
                      {deletingUser === user.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      <span className="hidden sm:inline">
                        {deletingUser === user.id ? 'Eliminazione...' : 'Elimina'}
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {paginatedUsers.length === 0 && (
            <li className="px-4 py-8 text-gray-500 text-center">
              {searchTerm ? (
                <>
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Nessun risultato per "{searchTerm}"</p>
                </>
              ) : (
                <>
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Nessun {type === 'operators' ? 'operatore' : 'paziente'} presente</p>
                </>
              )}
            </li>
          )}
        </ul>

        {/* Paginazione */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} di {filteredAndSortedUsers.length} risultati
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm">
                Pagina {currentPage} di {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}