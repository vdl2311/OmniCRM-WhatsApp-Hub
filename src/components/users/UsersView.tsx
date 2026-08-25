import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  Users,
  Plus,
  Shield,
  Check,
  X,
  Edit2,
  Trash2,
  Lock,
  ArrowRightLeft,
  Mail,
  UserCheck,
} from 'lucide-react';
import { UserModal } from './UserModal';

export const UsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, contacts, deals, chats } = useApp();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold text-[10px] uppercase">Administrador</span>;
      case 'manager':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px] uppercase">Gerente</span>;
      case 'agent':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase">Vendedor / Agente</span>;
      case 'support':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] uppercase">Suporte Técnico</span>;
    }
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>Usuários & Controle de Acesso (RBAC)</span>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-semibold">
              {users.length} membros na equipe
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie operadores, gerentes, permissões de visualização e regras de distribuição.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Usuário</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Membro da Equipe</th>
                <th className="py-3 px-4">Função / Papel</th>
                <th className="py-3 px-4">Carteira Ativa</th>
                <th className="py-3 px-4">Ver Todos Contatos</th>
                <th className="py-3 px-4">Ver Todas Conversas</th>
                <th className="py-3 px-4">Exportar CSV</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map(u => {
                const userContactsCount = contacts.filter(c => c.assignedToId === u.id).length;
                const userDealsCount = deals.filter(d => d.assignedToId === u.id).length;
                const userChatsCount = chats.filter(c => c.assignedToId === u.id).length;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.id === currentUser.id && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Portfolio */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="text-[11px]">
                        <strong>{userContactsCount}</strong> contatos • <strong>{userDealsCount}</strong> negócios
                      </div>
                    </td>

                    {/* Permissions checks */}
                    <td className="py-3.5 px-4">
                      {u.permissions.canViewAllContacts ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.permissions.canViewAllChats ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.permissions.canExportData ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        u.status === 'online' ? 'text-emerald-600' :
                        u.status === 'busy' ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          u.status === 'online' ? 'bg-emerald-500' :
                          u.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                        }`}></span>
                        <span className="capitalize">{u.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                          title="Editar Permissões"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {users.length > 1 && u.id !== currentUser.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Remover usuário ${u.name}? Os leads serão transferidos.`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};
