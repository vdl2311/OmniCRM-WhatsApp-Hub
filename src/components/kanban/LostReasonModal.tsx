import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertCircle } from 'lucide-react';

interface LostReasonModalProps {
  dealId: string;
  stageId: string;
  onClose: () => void;
}

export const LostReasonModal: React.FC<LostReasonModalProps> = ({ dealId, stageId, onClose }) => {
  const { moveDealStage } = useApp();
  const [reason, setReason] = useState('Preço / Orçamento fora da capacidade');
  const [details, setDetails] = useState('');

  const commonReasons = [
    'Preço / Orçamento fora da capacidade',
    'Escolheu Concorrente',
    'Sem retorno / Contato Frio',
    'Não tem interesse no momento',
    'Falta de recursos técnicos necessários',
    'Outro motivo',
  ];

  const handleConfirm = () => {
    const finalReason = details.trim() ? `${reason} (${details.trim()})` : reason;
    moveDealStage(dealId, stageId, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900">Registrar Motivo de Perda</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Selecione o motivo principal pelo qual o negócio não foi concretizado para alimentar as métricas de inteligência comercial:
          </p>

          <div className="space-y-2">
            {commonReasons.map(r => (
              <label
                key={r}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                  reason === r ? 'bg-rose-50 border-rose-200 text-rose-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="lost_reason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observações adicionais (opcional)</label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Ex: Concorrente ofereceu desconto de 40% no plano anual..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none resize-none"
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
              onClick={handleConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition"
            >
              Confirmar e Mover para Perdido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
