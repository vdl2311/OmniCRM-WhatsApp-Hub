import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal } from '../../types';
import { X, Briefcase, DollarSign, Calendar, Tag, UserCheck } from 'lucide-react';

interface DealModalProps {
  deal?: Deal | null;
  pipelineId: string;
  onClose: () => void;
}

export const DealModal: React.FC<DealModalProps> = ({ deal, pipelineId, onClose }) => {
  const { addDeal, updateDeal, contacts, users, pipelines, currentUser } = useApp();

  const currentPipeline = pipelines.find(p => p.id === pipelineId) || pipelines[0];

  const [title, setTitle] = useState(deal?.title || '');
  const [contactId, setContactId] = useState(deal?.contactId || (contacts[0]?.id || ''));
  const [stageId, setStageId] = useState(deal?.stageId || currentPipeline.stages[0]?.id || '');
  const [value, setValue] = useState<number>(deal?.value || 5000);
  const [assignedToId, setAssignedToId] = useState(deal?.assignedToId || currentUser.id);
  const [expectedCloseDate, setExpectedCloseDate] = useState(deal?.expectedCloseDate || '');
  const [tagsInput, setTagsInput] = useState(deal?.tags.join(', ') || '');
  const [notes, setNotes] = useState(deal?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactId) {
      alert('Título e Contato são obrigatórios.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (deal) {
      updateDeal(deal.id, {
        title,
        contactId,
        stageId,
        value: Number(value),
        assignedToId,
        expectedCloseDate: expectedCloseDate || undefined,
        tags,
        notes,
      });
    } else {
      addDeal({
        title,
        contactId,
        pipelineId,
        stageId,
        value: Number(value),
        assignedToId,
        expectedCloseDate: expectedCloseDate || undefined,
        status: 'open',
        tags: tags.length ? tags : ['Oportunidade'],
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {deal ? 'Editar Oportunidade' : 'Nova Oportunidade Comercial'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Título do Negócio *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Implantação CRM Enterprise - 10 Licenças"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contato Vinculado *</label>
              <select
                required
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Etapa no Funil</label>
              <select
                value={stageId}
                onChange={e => setStageId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {currentPipeline.stages.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Valor Estimado (R$) *</label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Previsão de Fechamento</label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={e => setExpectedCloseDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="font-semibold text-slate-700 block mb-1">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Enterprise, Alta Prioridade"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observações do Negócio</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Detalhes negociados, formas de pagamento acordadas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none resize-none"
            />
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
              {deal ? 'Salvar Oportunidade' : 'Criar Oportunidade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
