import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, ContactType, ContactStatus, LeadSource } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  UserCheck,
  Building2,
  Phone,
  Mail,
  Tag,
  MoreVertical,
  Edit2,
  Trash2,
  MessageCircle,
  Copy,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { ContactDrawer } from './ContactDrawer';
import { ContactModal } from './ContactModal';
import { ImportModal } from './ImportModal';
import { DuplicatesModal } from './DuplicatesModal';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    users,
    selectedContactId,
    setSelectedContactId,
    deleteContact,
    setIsContactModalOpen,
    isContactModalOpen,
    setCurrentView,
    setActiveChatId,
    simulateIncomingMessage,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  // Filter logic
  const filteredContacts = contacts.filter(c => {
    // RBAC: If agent cannot view all contacts, filter by assignedTo
    if (!currentUser.permissions.canViewAllContacts && currentUser.role !== 'admin' && c.assignedToId !== currentUser.id) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        c.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
    if (agentFilter !== 'all' && c.assignedToId !== agentFilter) return false;
    if (tagFilter !== 'all' && !c.tags.includes(tagFilter)) return false;

    return true;
  });

  // Check potential duplicates count
  const duplicatesCount = contacts.filter((c, index) => {
    return contacts.findIndex(other => 
      other.id !== c.id && 
      (other.phone.replace(/\D/g, '') === c.phone.replace(/\D/g, '') || 
       (c.email && other.email && other.email.toLowerCase() === c.email.toLowerCase()))
    ) !== -1;
  }).length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Tipo', 'Telefone', 'WhatsApp', 'Email', 'Empresa', 'Cargo', 'Origem', 'Status', 'Tags', 'Data Cadastro'];
    const rows = filteredContacts.map(c => [
      c.id,
      `"${c.name}"`,
      c.type,
      c.phone,
      c.whatsapp,
      c.email,
      `"${c.companyName || ''}"`,
      `"${c.role || ''}"`,
      `"${c.source}"`,
      c.status,
      `"${c.tags.join(', ')}"`,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contatos_omnicrm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartWhatsApp = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setCurrentView('whatsapp');
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>Gestão de Contatos & Leads</span>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-semibold">
              {filteredContacts.length} de {contacts.length} registros
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Base centralizada de clientes, empresas, decisores e histórico de atendimentos.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {duplicatesCount > 0 && (
            <button
              onClick={() => setIsDuplicatesModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-100 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{duplicatesCount} Duplicados Detectados</span>
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 transition shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Planilha</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingContact(null);
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Contato</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, e-mail, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Tipo: Todos</option>
            <option value="lead">Lead</option>
            <option value="client">Cliente</option>
            <option value="company">Empresa</option>
            <option value="vendor">Fornecedor</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Status: Todos</option>
            <option value="ativo">Ativo</option>
            <option value="aguardando">Aguardando</option>
            <option value="ganho">Ganho / Fechado</option>
            <option value="perdido">Perdido</option>
            <option value="inativo">Inativo</option>
          </select>

          {/* Origin filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Origem: Todas</option>
            <option value="WhatsApp Direto">WhatsApp Direto</option>
            <option value="Instagram">Instagram</option>
            <option value="Site Orgânico">Site Orgânico</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Indicação">Indicação</option>
          </select>

          {/* Responsible filter */}
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Responsável: Todos</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nome & Contato</th>
                <th className="py-3 px-4">Empresa & Cargo</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhum contato encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => {
                  const assignedUser = users.find(u => u.id === contact.assignedToId);

                  return (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={contact.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={contact.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 hover:text-emerald-700 transition">
                              {contact.name}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                              <span>{contact.phone}</span>
                              {contact.email && <span>• {contact.email}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-3.5 px-4 text-slate-700">
                        {contact.companyName ? (
                          <div>
                            <div className="font-medium text-slate-900">{contact.companyName}</div>
                            <div className="text-[11px] text-slate-400">{contact.role || 'Colaborador'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pessoa Física</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                          {contact.source}
                        </span>
                      </td>

                      {/* Assigned User */}
                      <td className="py-3.5 px-4">
                        {assignedUser ? (
                          <div className="flex items-center gap-1.5">
                            <img src={assignedUser.avatarUrl} alt={assignedUser.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-slate-700">{assignedUser.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Não atribuído</span>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded text-[10px] font-semibold">
                              {t}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{contact.tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          contact.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' :
                          contact.status === 'aguardando' ? 'bg-amber-100 text-amber-800' :
                          contact.status === 'ganho' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {contact.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartWhatsApp(contact)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingContact(contact);
                              setIsContactModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                            title="Editar Contato"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir ${contact.name}?`)) {
                                deleteContact(contact.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Excluir Contato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals and Drawers */}
      <ContactDrawer
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
      />

      {isContactModalOpen && (
        <ContactModal
          contact={editingContact}
          onClose={() => {
            setIsContactModalOpen(false);
            setEditingContact(null);
          }}
        />
      )}

      {isImportModalOpen && (
        <ImportModal onClose={() => setIsImportModalOpen(false)} />
      )}

      {isDuplicatesModalOpen && (
        <DuplicatesModal onClose={() => setIsDuplicatesModalOpen(false)} />
      )}
    </div>
  );
};
