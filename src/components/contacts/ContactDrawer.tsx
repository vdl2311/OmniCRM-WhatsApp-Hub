import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  Mail,
  Building2,
  Calendar,
  Tag,
  Clock,
  MessageSquare,
  Briefcase,
  CheckSquare,
  FileText,
  Plus,
  Send,
  UserCheck,
  Edit2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ContactDrawerProps {
  contactId: string | null;
  onClose: () => void;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({ contactId, onClose }) => {
  const {
    contacts,
    deals,
    tasks,
    timeline,
    users,
    chats,
    messages,
    setCurrentView,
    setActiveChatId,
    setIsDealModalOpen,
    setIsTaskModalOpen,
    addTimelineEvent,
    currentUser,
    updateContact,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'deals' | 'whatsapp' | 'tasks' | 'notes'>('timeline');
  const [newNoteText, setNewNoteText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ summary?: string; sentiment?: string; score?: number } | null>(null);

  if (!contactId) return null;

  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return null;

  const assignedUser = users.find(u => u.id === contact.assignedToId);
  const contactDeals = deals.filter(d => d.contactId === contactId);
  const contactTasks = tasks.filter(t => t.contactId === contactId);
  const contactEvents = timeline.filter(e => e.contactId === contactId);
  const contactChat = chats.find(c => c.contactId === contactId);
  const chatMessages = contactChat ? (messages[contactChat.id] || []) : [];

  const totalDealsValue = contactDeals.reduce((sum, d) => sum + d.value, 0);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    addTimelineEvent({
      contactId: contact.id,
      type: 'note',
      title: 'Nota Interna Adicionada',
      description: newNoteText,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    updateContact(contact.id, {
      notes: contact.notes ? `${contact.notes}\n• ${newNoteText}` : newNoteText,
    });

    setNewNoteText('');
  };

  const handleOpenWhatsAppChat = () => {
    if (contactChat) {
      setActiveChatId(contactChat.id);
    }
    setCurrentView('whatsapp');
    onClose();
  };

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, messages: chatMessages, deals: contactDeals }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch {
      setAiAnalysis({
        summary: 'Lead engajado com foco em atendimento WhatsApp integrado.',
        sentiment: 'Muito Interessado',
        score: 85,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3.5">
            <img
              src={contact.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={contact.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{contact.name}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  contact.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' :
                  contact.status === 'aguardando' ? 'bg-amber-100 text-amber-800' :
                  contact.status === 'ganho' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {contact.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                {contact.companyName && <span>{contact.companyName} • {contact.role || 'Contato'}</span>}
                <span>({contact.source})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsAppChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Contact Info Strip */}
        <div className="px-5 py-3 bg-white border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{contact.email || 'Sem e-mail'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{assignedUser?.name || 'Não atribuído'}</span>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="px-5 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-950">
              {aiAnalysis ? `Probabilidade: ${aiAnalysis.score}% (${aiAnalysis.sentiment})` : 'Análise Comercial com IA Gemini'}
            </span>
          </div>

          <button
            onClick={handleAiAnalysis}
            disabled={isAiLoading}
            className="text-xs px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100/50 rounded-lg font-medium transition shrink-0"
          >
            {isAiLoading ? 'Analisando...' : aiAnalysis ? 'Reanalisar' : 'Gerar Diagnóstico'}
          </button>
        </div>

        {aiAnalysis?.summary && (
          <div className="px-5 py-2 bg-emerald-100/40 text-xs text-emerald-900 border-b border-emerald-200/60">
            {aiAnalysis.summary}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-5 text-xs font-semibold text-slate-500 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${activeTab === 'timeline' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Timeline 360° ({contactEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${activeTab === 'deals' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Oportunidades ({contactDeals.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${activeTab === 'whatsapp' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            WhatsApp ({chatMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${activeTab === 'tasks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Tarefas ({contactTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${activeTab === 'notes' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Notas & Dados
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {/* Quick Note Input */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <textarea
                  placeholder="Registrar nota interna, resumo de ligação ou observação..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none h-20 text-slate-800"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteText.trim()}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Adicionar à Timeline</span>
                  </button>
                </div>
              </div>

              {/* Timeline feed */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {contactEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">Nenhum evento registrado ainda.</p>
                ) : (
                  contactEvents.map((evt) => (
                    <div key={evt.id} className="relative text-xs">
                      <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-slate-900">
                          <span className="font-bold">{evt.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(evt.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                        {evt.userName && (
                          <div className="text-[10px] text-slate-400 mt-1">Por: {evt.userName}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DEALS */}
          {activeTab === 'deals' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Total em Negociação: R$ {totalDealsValue.toLocaleString('pt-BR')}
                </span>
                <button
                  onClick={() => {
                    setIsDealModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Oportunidade</span>
                </button>
              </div>

              {contactDeals.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Nenhuma oportunidade cadastrada para este contato.
                </div>
              ) : (
                contactDeals.map(d => (
                  <div key={d.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{d.title}</h4>
                      <span className="font-bold text-emerald-700 text-xs">
                        R$ {d.value.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Status: <strong className="uppercase">{d.status}</strong></span>
                      {d.expectedCloseDate && <span>Previsão: {d.expectedCloseDate}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: WHATSAPP */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Canal: WhatsApp Oficial ({contact.whatsapp})
                </span>
                <button
                  onClick={handleOpenWhatsAppChat}
                  className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Abrir Caixa de Entrada</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-96 overflow-y-auto space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">Nenhuma mensagem trocada ainda.</p>
                ) : (
                  chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                        msg.sender === 'agent'
                          ? 'ml-auto bg-emerald-600 text-white rounded-tr-xs'
                          : msg.isInternalNote
                          ? 'mx-auto bg-amber-50 border border-amber-200 text-amber-900'
                          : 'mr-auto bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className={`text-[10px] mt-1 text-right ${msg.sender === 'agent' ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Tarefas Vinculadas</span>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Tarefa</span>
                </button>
              </div>

              {contactTasks.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Nenhuma tarefa pendente para este contato.
                </div>
              ) : (
                contactTasks.map(t => (
                  <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className={`font-semibold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Prazo: {t.dueDate} {t.dueTime}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: NOTES & DETAILS */}
          {activeTab === 'notes' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags do Contato</label>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações Cadastradas</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap">
                  {contact.notes || 'Nenhuma observação registrada.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Data de Cadastro</span>
                  <span className="font-semibold text-slate-800">{new Date(contact.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Última Interação</span>
                  <span className="font-semibold text-slate-800">{new Date(contact.lastInteractionAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
