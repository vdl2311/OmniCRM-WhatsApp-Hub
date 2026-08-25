import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRightLeft, UserCheck } from 'lucide-react';

interface TransferModalProps {
  chatId: string;
  currentAssignedId?: string;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ chatId, currentAssignedId, onClose }) => {
  const { users, transferChat, currentUser } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users.find(u => u.id !== currentAssignedId)?.id || users[0]?.id || ''
  );
  const [transferNote, setTransferNote] = useState('');

  const handleTransfer = () => {
    if (!selectedUserId) return;
    transferChat(chatId, selectedUserId, transferNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Transferir Atendimento</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Selecione o membro da equipe ou departamento que dará continuidade ao atendimento deste cliente:
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Novo Atendente Responsável</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map(u => (
                <label
                  key={u.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedUserId === u.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[11px] text-slate-400 uppercase font-bold">{u.role}</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="target_user"
                    checked={selectedUserId === u.id}
                    onChange={() => setSelectedUserId(u.id)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nota de passagem de bastão (opcional)</label>
            <textarea
              value={transferNote}
              onChange={e => setTransferNote(e.target.value)}
              placeholder="Ex: Cliente tem interesse no plano Pro Anual, já alinhamos escopo..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleTransfer}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              Confirmar Transferência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
