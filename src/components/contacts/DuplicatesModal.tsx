import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, GitMerge, Check } from 'lucide-react';
import { Contact } from '../../types';

interface DuplicatesModalProps {
  onClose: () => void;
}

export const DuplicatesModal: React.FC<DuplicatesModalProps> = ({ onClose }) => {
  const { contacts, mergeContacts } = useApp();

  // Find duplicates pairs
  const duplicatePairs: Array<{ primary: Contact; duplicate: Contact; reason: string }> = [];

  for (let i = 0; i < contacts.length; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      const c1 = contacts[i];
      const c2 = contacts[j];

      const samePhone = c1.phone.replace(/\D/g, '') === c2.phone.replace(/\D/g, '');
      const sameEmail = c1.email && c2.email && c1.email.toLowerCase() === c2.email.toLowerCase();

      if (samePhone || sameEmail) {
        duplicatePairs.push({
          primary: c1,
          duplicate: c2,
          reason: samePhone ? 'Mesmo Telefone/WhatsApp' : 'Mesmo E-mail',
        });
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Detector & Limpeza de Contatos Duplicados
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Encontramos registros com telefones ou e-mails coincidentes na base. Você pode mesclar os históricos e tags em um único registro consolidado.
          </p>

          {duplicatePairs.length === 0 ? (
            <div className="text-center py-8 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <Check className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
              <p className="font-semibold">Nenhuma duplicidade encontrada na base!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {duplicatePairs.map((pair, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-amber-800 font-semibold text-[11px]">
                    <span>Motivo: {pair.reason}</span>
                    <button
                      onClick={() => {
                        mergeContacts(pair.primary.id, pair.duplicate.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-bold"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Mesclar Registros</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registro Principal</span>
                      <div className="font-bold text-slate-900">{pair.primary.name}</div>
                      <div className="text-slate-500 text-[11px]">{pair.primary.phone}</div>
                      <div className="text-slate-400 text-[11px]">{pair.primary.companyName || 'Sem empresa'}</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registro Duplicado</span>
                      <div className="font-bold text-slate-900">{pair.duplicate.name}</div>
                      <div className="text-slate-500 text-[11px]">{pair.duplicate.phone}</div>
                      <div className="text-slate-400 text-[11px]">{pair.duplicate.companyName || 'Sem empresa'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
