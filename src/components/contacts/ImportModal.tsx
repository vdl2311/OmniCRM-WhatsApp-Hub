import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { Contact } from '../../types';

interface ImportModalProps {
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const { importContacts, currentUser } = useApp();
  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<{ imported: number; duplicates: number } | null>(null);

  const sampleCsv = `Nome,Telefone,Email,Empresa,Cargo,Origem,Status,Tags
Gabriel Santos,+55 11 99887-1122,gabriel@solucoes.com,Santos Tech,CEO,Site Orgânico,ativo,B2B;Enterprise
Patricia Lima,+55 21 98877-3344,patricia@clinicavita.com,Clínica Vita,Gerente,Instagram,aguardando,Saúde;Urgente
Eduardo Rocha,+55 31 97766-5544,eduardo@rochalaw.com,Rocha Advogados,Sócio,Google Ads,ativo,Jurídico`;

  const handleLoadSample = () => {
    setCsvText(sampleCsv);
  };

  const handleProcessImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      alert('O CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
      return;
    }

    const rows = lines.slice(1);
    const parsedContacts: Array<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>> = [];

    rows.forEach(line => {
      const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const [name, phone, email, companyName, role, source, status, tagsStr] = parts;
        parsedContacts.push({
          name: name || 'Sem Nome',
          type: 'lead',
          phone: phone,
          whatsapp: phone.replace(/\D/g, ''),
          email: email || '',
          companyName: companyName || '',
          role: role || '',
          source: (source as any) || 'Site Orgânico',
          assignedToId: currentUser.id,
          tags: tagsStr ? tagsStr.split(';').map(t => t.trim()) : ['Importado via CSV'],
          status: (status as any) || 'ativo',
          notes: 'Importado em lote via planilha.',
        });
      }
    });

    const result = importContacts(parsedContacts);
    setImportResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Importação de Contatos em Lote (CSV)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {importResult ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Importação Concluída com Sucesso!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Foram inseridos <strong>{importResult.imported}</strong> novos contatos.
                {importResult.duplicates > 0 && (
                  <span className="text-amber-600 block mt-0.5">
                    {importResult.duplicates} registros foram ignorados por duplicidade de telefone/email.
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Cole abaixo os dados em formato CSV separados por vírgula. O sistema identificará e evitará registros duplicados automaticamente.
            </p>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Formato: Nome, Telefone, Email, Empresa, Cargo, Origem, Status, Tags</span>
              <button
                onClick={handleLoadSample}
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Carregar Exemplo
              </button>
            </div>

            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="Cole seu CSV aqui..."
              rows={8}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessImport}
                disabled={!csvText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold transition"
              >
                <Upload className="w-4 h-4" />
                Processar e Importar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
