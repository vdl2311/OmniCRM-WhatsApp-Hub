import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Zap, Phone, MessageSquare, Plus, UserCheck } from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  onClose: () => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({ onClose }) => {
  const { contacts, simulateIncomingMessage, setActiveChatId, setCurrentView } = useApp();

  const [senderMode, setSenderMode] = useState<'existing' | 'new'>('existing');
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [newSenderName, setNewSenderName] = useState('Novo Cliente Interessado');
  const [newSenderPhone, setNewSenderPhone] = useState('+55 11 98765-9988');
  const [messageText, setMessageText] = useState('Olá! Gostaria de receber uma cotação para o CRM com WhatsApp integrado.');
  const [messageType, setMessageType] = useState<'text' | 'audio' | 'document'>('text');

  const presetMessages = [
    'Olá! Gostaria de receber uma cotação para o CRM com WhatsApp integrado.',
    'Boa tarde! Vocês possuem integração com catálogo de produtos e envio de boletos?',
    'Acabei de ver o anúncio de vocês no Instagram e quero agendar uma demonstração.',
    'Pode me mandar o PDF com a proposta atualizada que combinamos ontem por favor?',
  ];

  const handleSimulate = () => {
    let name = newSenderName;
    let phone = newSenderPhone;

    if (senderMode === 'existing') {
      const c = contacts.find(contact => contact.id === selectedContactId);
      if (c) {
        name = c.name;
        phone = c.phone;
      }
    }

    simulateIncomingMessage(phone, name, messageText, messageType);
    setCurrentView('whatsapp');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Simulador de Mensagem WhatsApp Recebida
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Simule o recebimento de uma mensagem em tempo real via Webhook da Meta / WhatsApp Oficial para testar a triagem, notificações e automações do CRM.
          </p>

          {/* Mode switch */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSenderMode('existing')}
              className={`py-1.5 rounded-lg font-bold transition ${
                senderMode === 'existing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Contato Existente
            </button>
            <button
              onClick={() => setSenderMode('new')}
              className={`py-1.5 rounded-lg font-bold transition ${
                senderMode === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Novo Lead Desconhecido
            </button>
          </div>

          {senderMode === 'existing' ? (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Selecionar Contato</label>
              <select
                value={selectedContactId}
                onChange={e => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome do Lead</label>
                <input
                  type="text"
                  value={newSenderName}
                  onChange={e => setNewSenderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Telefone WhatsApp</label>
                <input
                  type="text"
                  value={newSenderPhone}
                  onChange={e => setNewSenderPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Quick presets */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mensagens Rápidas de Teste</label>
            <div className="space-y-1.5">
              {presetMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessageText(msg)}
                  className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-700 transition"
                >
                  "{msg}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Conteúdo da Mensagem</label>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tipo de Mídia</label>
            <div className="flex gap-2">
              <label className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="media_type"
                  checked={messageType === 'text'}
                  onChange={() => setMessageType('text')}
                />
                <span>Texto</span>
              </label>
              <label className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="media_type"
                  checked={messageType === 'audio'}
                  onChange={() => setMessageType('audio')}
                />
                <span>Áudio de Voz</span>
              </label>
              <label className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="media_type"
                  checked={messageType === 'document'}
                  onChange={() => setMessageType('document')}
                />
                <span>Documento PDF</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSimulate}
              disabled={!messageText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold transition"
            >
              <Zap className="w-4 h-4" />
              <span>Simular Disparo Webhook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
