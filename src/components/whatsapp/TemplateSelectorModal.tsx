import React from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, WhatsAppTemplate } from '../../types';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface TemplateSelectorModalProps {
  contact?: Contact;
  onSelect: (content: string) => void;
  onClose: () => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({ contact, onSelect, onClose }) => {
  const { templates, currentUser } = useApp();

  const handlePickTemplate = (template: WhatsAppTemplate) => {
    let replaced = template.content
      .replace(/{{nome}}/g, contact?.name || 'Cliente')
      .replace(/{{empresa}}/g, contact?.companyName || 'sua empresa')
      .replace(/{{atendente}}/g, currentUser.name)
      .replace(/{{email}}/g, contact?.email || '')
      .replace(/{{telefone}}/g, contact?.phone || '');

    onSelect(replaced);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Templates Oficiais Aprovados Meta</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => handlePickTemplate(tmpl)}
              className="p-4 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900">{tmpl.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-medium">
                    {tmpl.category}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Aprovado Meta
                </span>
              </div>

              <p className="text-slate-600 group-hover:text-slate-800 leading-relaxed font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-100">
                {tmpl.content}
              </p>

              <div className="text-[10px] text-slate-400">
                Variáveis mapeadas automaticamente para: <strong>{contact?.name || 'Cliente'}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
