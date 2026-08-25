import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, UserPermissions } from '../../types';
import { X, UserCheck, Shield, Check } from 'lucide-react';

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  const { addUser, updateUser } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'agent');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');

  // Granular Permissions
  const [canViewAllContacts, setCanViewAllContacts] = useState(user?.permissions.canViewAllContacts ?? (role === 'admin' || role === 'manager'));
  const [canViewAllChats, setCanViewAllChats] = useState(user?.permissions.canViewAllChats ?? (role === 'admin' || role === 'manager'));
  const [canExportData, setCanExportData] = useState(user?.permissions.canExportData ?? (role === 'admin'));
  const [canManageAutomations, setCanManageAutomations] = useState(user?.permissions.canManageAutomations ?? (role === 'admin'));
  const [canDeleteRecords, setCanDeleteRecords] = useState(user?.permissions.canDeleteRecords ?? (role === 'admin'));

  // Role preset change handler
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setCanViewAllContacts(true);
      setCanViewAllChats(true);
      setCanExportData(true);
      setCanManageAutomations(true);
      setCanDeleteRecords(true);
    } else if (newRole === 'manager') {
      setCanViewAllContacts(true);
      setCanViewAllChats(true);
      setCanExportData(true);
      setCanManageAutomations(false);
      setCanDeleteRecords(false);
    } else {
      setCanViewAllContacts(false);
      setCanViewAllChats(false);
      setCanExportData(false);
      setCanManageAutomations(false);
      setCanDeleteRecords(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Nome e E-mail são obrigatórios.');
      return;
    }

    const permissions: UserPermissions = {
      canViewAllContacts,
      canViewAllChats,
      canExportData,
      canManageAutomations,
      canDeleteRecords,
    };

    if (user) {
      updateUser(user.id, {
        name,
        email,
        role,
        avatarUrl,
        permissions,
      });
    } else {
      addUser({
        name,
        email,
        role,
        avatarUrl,
        status: 'online',
        permissions,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {user ? 'Editar Membro da Equipe' : 'Cadastrar Novo Usuário'}
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
                placeholder="Ex: Amanda Silva"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">E-mail de Acesso *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="amanda@empresa.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Perfil de Acesso (Cargo)</label>
            <select
              value={role}
              onChange={e => handleRoleChange(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
            >
              <option value="admin">Administrador Geral (Acesso total)</option>
              <option value="manager">Gerente Comercial (Vê todos os relatórios e contatos)</option>
              <option value="agent">Vendedor / Atendente (Vê apenas sua própria carteira)</option>
              <option value="support">Suporte Técnico</option>
            </select>
          </div>

          {/* Granular Permissions Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Permissões Granulares de Segurança</span>
            </div>

            <div className="space-y-2 pt-1 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canViewAllContacts}
                  onChange={e => setCanViewAllContacts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pode visualizar contatos e leads de outros atendentes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canViewAllChats}
                  onChange={e => setCanViewAllChats(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pode visualizar conversas de WhatsApp de toda a equipe</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canExportData}
                  onChange={e => setCanExportData(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pode exportar relatórios e planilhas em CSV</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageAutomations}
                  onChange={e => setCanManageAutomations(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pode criar e editar automações e funis</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canDeleteRecords}
                  onChange={e => setCanDeleteRecords(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pode excluir contatos e oportunidades permanentemente</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              {user ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
