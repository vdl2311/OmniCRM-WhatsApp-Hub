import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, ContactType, ContactStatus, LeadSource } from '../../types';
import { X, UserCheck, Phone, Mail, Building2, Tag, Shield } from 'lucide-react';

interface ContactModalProps {
  contact?: Contact | null;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ contact, onClose }) => {
  const { addContact, updateContact, users, currentUser } = useApp();

  const [name, setName] = useState(contact?.name || '');
  const [type, setType] = useState<ContactType>(contact?.type || 'lead');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [whatsapp, setWhatsapp] = useState(contact?.whatsapp || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [companyName, setCompanyName] = useState(contact?.companyName || '');
  const [role, setRole] = useState(contact?.role || '');
  const [source, setSource] = useState<LeadSource>(contact?.source || 'WhatsApp Direto');
  const [assignedToId, setAssignedToId] = useState(contact?.assignedToId || currentUser.id);
  const [status, setStatus] = useState<ContactStatus>(contact?.status || 'ativo');
  const [tagsInput, setTagsInput] = useState(contact?.tags.join(', ') || '');
  const [notes, setNotes] = useState(contact?.notes || '');

  // Auto-sync whatsapp from phone
  useEffect(() => {
    if (!contact && phone) {
      setWhatsapp(phone.replace(/\D/g, ''));
    }
  }, [phone, contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Nome e Telefone são obrigatórios.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (contact) {
      updateContact(contact.id, {
        name,
        type,
        phone,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        companyName,
        role,
        source,
        assignedToId,
        status,
        tags,
        notes,
      });
    } else {
      addContact({
        name,
        type,
        phone,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        companyName,
        role,
        source,
        assignedToId,
        status,
        tags: tags.length ? tags : ['Novo Lead'],
        notes,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {contact ? 'Editar Contato' : 'Novo Contato / Lead'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tipo de Registro</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContactType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="lead">Lead</option>
                <option value="client">Cliente</option>
                <option value="company">Empresa</option>
                <option value="vendor">Fornecedor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Telefone / Celular *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="carlos@empresa.com.br"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Ex: SolarTech Brasil"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cargo / Função</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Ex: Diretor Comercial"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Origem do Lead</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="WhatsApp Direto">WhatsApp Direto</option>
                <option value="Instagram">Instagram</option>
                <option value="Site Orgânico">Site Orgânico</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Indicação">Indicação</option>
                <option value="Evento">Evento</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Responsável</label>
              <select
                value={assignedToId}
                onChange={e => setAssignedToId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ContactStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="ativo">Ativo</option>
                <option value="aguardando">Aguardando</option>
                <option value="ganho">Ganho / Fechado</option>
                <option value="perdido">Perdido</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="VIP, Decisor, Urgente, Software"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observações Iniciais</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Histórico prévio, necessidades levantadas, expectativas do cliente..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition shadow-xs"
            >
              {contact ? 'Salvar Alterações' : 'Cadastrar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
