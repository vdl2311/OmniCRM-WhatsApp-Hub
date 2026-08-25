import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatsAppChat, ChatMessage } from '../../types';
import {
  Search,
  MessageSquare,
  Send,
  Sparkles,
  UserCheck,
  Phone,
  Clock,
  Check,
  CheckCheck,
  Tag,
  Shield,
  ArrowRightLeft,
  CheckCircle,
  FileText,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Zap,
  Volume2,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { TransferModal } from './TransferModal';
import { TemplateSelectorModal } from './TemplateSelectorModal';
import { WhatsAppSimulatorModal } from './WhatsAppSimulatorModal';

export const WhatsAppInboxView: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    sendMessage,
    updateChatStatus,
    updateChatTags,
    contacts,
    users,
    deals,
    quickReplies,
    currentUser,
    setSelectedContactId,
    setIsDealModalOpen,
    setIsSimulatorModalOpen,
    isSimulatorModalOpen,
  } = useApp();

  // Chat filters
  const [tabFilter, setTabFilter] = useState<'mine' | 'unassigned' | 'all' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Mobile navigation state
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Quick replies autocomplete
  const [quickReplyFilter, setQuickReplyFilter] = useState<string | null>(null);

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // AI Suggestions
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Audio Playback simulation state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active chat
  const activeChat = chats.find(c => c.id === activeChatId) || (chats.length > 0 ? chats[0] : null);
  const activeContact = contacts.find(c => c.id === activeChat?.contactId);
  const activeAssignedUser = users.find(u => u.id === activeChat?.assignedToId);
  const activeChatMessages = activeChat ? (messages[activeChat.id] || []) : [];
  const linkedDeals = activeContact ? deals.filter(d => d.contactId === activeContact.id) : [];

  // When active chat changes, open mobile chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setShowMobileChat(true);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages.length, activeChatId]);

  // Filter chats
  const filteredChats = chats.filter(chat => {
    if (!currentUser.permissions.canViewAllChats && currentUser.role !== 'admin' && chat.assignedToId && chat.assignedToId !== currentUser.id) {
      return false;
    }

    if (tabFilter === 'mine' && chat.assignedToId !== currentUser.id) return false;
    if (tabFilter === 'unassigned' && chat.status !== 'unassigned') return false;
    if (tabFilter === 'resolved' && chat.status !== 'resolved' && chat.status !== 'closed') return false;
    if (tabFilter === 'all' && (chat.status === 'resolved' || chat.status === 'closed')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        chat.contactName.toLowerCase().includes(q) ||
        chat.contactPhone.includes(q) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Handle Input typing and '/' quick reply trigger
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (val.startsWith('/')) {
      setQuickReplyFilter(val.substring(1).toLowerCase());
    } else {
      setQuickReplyFilter(null);
    }
  };

  const handleSelectQuickReply = (qrContent: string) => {
    let finalContent = qrContent
      .replace(/{{nome}}/g, activeContact?.name || 'Cliente')
      .replace(/{{empresa}}/g, activeContact?.companyName || 'sua empresa')
      .replace(/{{atendente}}/g, currentUser.name)
      .replace(/{{email}}/g, activeContact?.email || '');

    setInputText(finalContent);
    setQuickReplyFilter(null);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    sendMessage(
      activeChat.id,
      inputText.trim(),
      isInternalNoteMode ? 'internal_note' : 'text',
      { isInternalNote: isInternalNoteMode }
    );

    setInputText('');
    setQuickReplyFilter(null);
    setIsInternalNoteMode(false);
  };

  // AI Suggestion fetch
  const handleFetchAiSuggestions = async () => {
    if (!activeChat) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: activeChat.contactName,
          recentMessages: activeChatMessages.slice(-5),
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch {
      setAiSuggestions([
        `Olá ${activeChat.contactName}! Como posso te auxiliar com a implantação do sistema hoje?`,
        `Perfeito! Gostaria de agendar uma demonstração rápida de 15 minutos para te mostrar ao vivo?`,
        `Já revisei seus dados e enviei a proposta com as condições especiais para seu e-mail.`
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] pb-14 md:pb-0 flex overflow-hidden bg-slate-100 relative">
      {/* 1. LEFT SIDEBAR: CONVERSATIONS LIST */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Central WhatsApp</span>
            </h3>

            <button
              onClick={() => setIsSimulatorModalOpen(true)}
              className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            />
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-semibold text-slate-600">
            <button
              onClick={() => setTabFilter('all')}
              className={`py-1 rounded-lg transition ${tabFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setTabFilter('mine')}
              className={`py-1 rounded-lg transition ${tabFilter === 'mine' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Minhas
            </button>
            <button
              onClick={() => setTabFilter('unassigned')}
              className={`py-1 rounded-lg transition relative ${tabFilter === 'unassigned' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Fila
              {chats.filter(c => c.status === 'unassigned').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1"></span>
              )}
            </button>
            <button
              onClick={() => setTabFilter('resolved')}
              className={`py-1 rounded-lg transition ${tabFilter === 'resolved' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Resolvidas
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p>Nenhuma conversa encontrada nesta aba.</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const isSelected = activeChat?.id === chat.id;
              const assignedUser = users.find(u => u.id === chat.assignedToId);

              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`p-3.5 cursor-pointer transition flex items-start gap-3 relative ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={chat.contactName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <span className={`w-3 h-3 rounded-full border-2 border-white absolute bottom-0 right-0 ${
                      chat.status === 'open' ? 'bg-emerald-500' :
                      chat.status === 'unassigned' ? 'bg-amber-500' :
                      chat.status === 'pending' ? 'bg-blue-500' :
                      'bg-slate-400'
                    }`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                        {chat.contactName}
                        {chat.status === 'unassigned' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            Fila
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1">
                      {chat.lastMessageSender === 'agent' && <span className="font-medium text-slate-700">Você: </span>}
                      {chat.lastMessage || 'Nenhuma mensagem'}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1 text-slate-400 truncate">
                        {assignedUser ? (
                          <>
                            <img src={assignedUser.avatarUrl} alt={assignedUser.name} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                            <span className="truncate max-w-[90px]">{assignedUser.name}</span>
                          </>
                        ) : (
                          <span className="text-amber-600 font-medium">Sem atendente</span>
                        )}
                      </div>

                      {chat.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-extrabold text-[10px] shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CENTRAL CHAT AREA */}
      {activeChat ? (
        <div
          className={`flex-1 flex flex-col bg-[#efeae2] relative min-w-0 h-full ${
            showMobileChat ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Chat Top Header */}
          <div className="h-16 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-xs z-10">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back button for mobile */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition shrink-0"
                aria-label="Voltar para conversas"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <img
                src={activeChat.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={activeChat.contactName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1.5">
                  <span className="truncate">{activeChat.contactName}</span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200 shrink-0 hidden sm:inline">
                    API Oficial
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                  <span className="truncate">{activeChat.contactPhone}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium truncate">
                    {activeAssignedUser?.name || 'Fila'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Transfer Button */}
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                title="Transferir atendimento"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Transferir</span>
              </button>

              {/* Status Switcher (Aberto / Resolvido) */}
              {activeChat.status !== 'resolved' ? (
                <button
                  onClick={() => updateChatStatus(activeChat.id, 'resolved')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Encerrar</span>
                </button>
              ) : (
                <button
                  onClick={() => updateChatStatus(activeChat.id, 'open')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl text-xs font-semibold transition"
                >
                  <span className="hidden sm:inline">Reabrir</span>
                </button>
              )}

              {/* Toggle Right Panel (Contact Details) */}
              <button
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`p-2 rounded-xl transition ${isRightPanelOpen ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Ver dados do cliente"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Reply Suggestion Banner */}
          {aiSuggestions.length > 0 && (
            <div className="bg-emerald-900 text-white px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs shadow-md animate-in slide-in-from-top duration-200 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-semibold text-emerald-200 shrink-0 hidden sm:inline">Sugestões IA:</span>
                {aiSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sug);
                      setAiSuggestions([]);
                    }}
                    className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-50 px-2.5 py-1 rounded-lg truncate max-w-[200px] sm:max-w-xs transition font-medium border border-emerald-600/50 text-[11px]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
              <button onClick={() => setAiSuggestions([])} className="text-emerald-300 hover:text-white p-1 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Encryption & Security Banner */}
            <div className="text-center my-1 sm:my-2">
              <span className="inline-block bg-[#ffeecd] text-[#54656f] text-[10px] sm:text-[11px] px-3 py-1 rounded-lg shadow-2xs font-medium border border-[#fae2a6]">
                🔒 Criptografia de ponta a ponta via API Oficial WhatsApp Meta.
              </span>
            </div>

            {activeChatMessages.map(msg => {
              const isAgent = msg.sender === 'agent';
              const isNote = msg.isInternalNote || msg.type === 'internal_note';

              if (isNote) {
                return (
                  <div key={msg.id} className="max-w-md mx-auto my-2 p-3 bg-amber-50/95 border border-amber-200 rounded-xl shadow-xs text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Nota Interna (Apenas equipe)</span>
                    </div>
                    <p className="break-words">{msg.content}</p>
                    <div className="text-[10px] text-amber-600 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-xs text-xs relative space-y-1.5 ${
                      isAgent
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                        : 'bg-white text-slate-900 rounded-tl-xs'
                    }`}
                  >
                    {/* Audio Message */}
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-2 sm:gap-3 py-1 min-w-[180px] sm:min-w-[220px]">
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0"
                        >
                          {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-emerald-600 ${playingAudioId === msg.id ? 'w-3/4 animate-pulse' : 'w-1/3'}`}
                            ></div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                            <span>0:18</span>
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              Áudio
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Document Message */}
                    {msg.type === 'document' && (
                      <div className="p-2.5 bg-black/5 rounded-xl flex items-center gap-3 border border-black/5">
                        <FileText className="w-6 h-6 text-rose-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 truncate">{msg.mediaName || msg.content}</div>
                          <div className="text-[10px] text-slate-500">{msg.mediaSize || '1.4 MB • PDF'}</div>
                        </div>
                      </div>
                    )}

                    {/* Text Message Content */}
                    {msg.type === 'text' && (
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                    )}

                    {/* Timestamp & Status ticks */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isAgent && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Autocomplete Dropdown */}
          {quickReplyFilter !== null && (
            <div className="absolute bottom-20 left-2 right-2 sm:left-4 sm:right-auto sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 max-h-60 overflow-y-auto space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Respostas Rápidas (Atalhos)
              </div>
              {quickReplies
                .filter(qr => qr.shortcut.toLowerCase().includes(quickReplyFilter) || qr.title.toLowerCase().includes(quickReplyFilter))
                .map(qr => (
                  <button
                    key={qr.id}
                    onClick={() => handleSelectQuickReply(qr.content)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-xs flex items-center justify-between transition"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-emerald-700 font-mono">{qr.shortcut}</span>
                        <span className="truncate">{qr.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{qr.content}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0 ml-2">
                      {qr.category}
                    </span>
                  </button>
                ))}
            </div>
          )}

          {/* Message Input Box */}
          <div className="p-2 sm:p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
            {/* Note Mode Banner */}
            {isInternalNoteMode && (
              <div className="flex items-center justify-between px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Nota Interna Privada (Cliente não recebe)
                </span>
                <button onClick={() => setIsInternalNoteMode(false)} className="text-amber-800 font-bold hover:underline text-[11px]">
                  Cancelar
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end gap-1.5 sm:gap-2">
              {/* Actions: Note toggle, Template picker, AI Copilot */}
              <div className="flex items-center gap-0.5 pb-0.5">
                <button
                  type="button"
                  onClick={() => setIsInternalNoteMode(!isInternalNoteMode)}
                  className={`p-2 rounded-xl transition ${isInternalNoteMode ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}
                  title="Escrever Nota Interna Privada"
                >
                  <Shield className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition"
                  title="Templates Oficiais WhatsApp"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleFetchAiSuggestions}
                  disabled={isAiLoading}
                  className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1"
                  title="Sugerir Respostas com IA Gemini"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={e => handleInputChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isInternalNoteMode
                      ? 'Nota interna para a equipe...'
                      : 'Mensagem ou / para atalhos...'
                  }
                  rows={1}
                  className={`w-full text-xs rounded-xl p-2.5 border focus:outline-none resize-none transition max-h-24 ${
                    isInternalNoteMode
                      ? 'bg-amber-50/50 border-amber-300 text-amber-950 focus:ring-2 focus:ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-2.5 sm:p-3 rounded-xl transition shadow-xs text-white disabled:opacity-40 shrink-0 ${
                  isInternalNoteMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 text-slate-400 text-xs">
          Selecione uma conversa para iniciar o atendimento.
        </div>
      )}

      {/* 3. RIGHT SIDEBAR / SLIDE-OVER DRAWER: 360° CONTACT INFO */}
      {isRightPanelOpen && activeContact && (
        <div className="fixed inset-y-0 right-0 z-50 md:static w-80 max-w-full bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 text-xs shadow-2xl md:shadow-none animate-in slide-in-from-right duration-200">
          {/* Close button on drawer */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900">Ficha do Contato 360°</h4>
            <button
              onClick={() => setIsRightPanelOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact summary */}
          <div className="text-center pb-3 border-b border-slate-100">
            <img
              src={activeContact.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={activeContact.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border border-slate-200"
            />
            <h4 className="font-bold text-sm text-slate-900">{activeContact.name}</h4>
            <div className="text-slate-500 text-[11px]">
              {activeContact.companyName ? `${activeContact.companyName} • ${activeContact.role || 'Contato'}` : 'Pessoa Física'}
            </div>
            <button
              onClick={() => setSelectedContactId(activeContact.id)}
              className="mt-2 text-xs text-emerald-700 font-semibold hover:underline block mx-auto"
            >
              Ver Ficha Completa 360° &rarr;
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Etiquetas / Tags</label>
            <div className="flex flex-wrap gap-1">
              {activeContact.tags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-semibold text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Linked Deals / Oportunidade */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Oportunidades</label>
              <button
                onClick={() => setIsDealModalOpen(true)}
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                Nova
              </button>
            </div>

            {linkedDeals.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-[11px]">
                Nenhuma oportunidade vinculada.
              </div>
            ) : (
              linkedDeals.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">{d.title}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700">R$ {d.value.toLocaleString('pt-BR')}</span>
                    <span className="uppercase font-bold text-slate-500">{d.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Channel Info */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-500 text-[11px]">
            <div className="flex justify-between">
              <span>Origem:</span>
              <span className="font-semibold text-slate-800">{activeContact.source}</span>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp:</span>
              <span className="font-semibold text-slate-800">{activeContact.whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span>Responsável:</span>
              <span className="font-semibold text-slate-800">{activeAssignedUser?.name || 'Fila'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && activeChat && (
        <TransferModal
          chatId={activeChat.id}
          currentAssignedId={activeChat.assignedToId}
          onClose={() => setIsTransferModalOpen(false)}
        />
      )}

      {/* Template Selector Modal */}
      {isTemplateModalOpen && activeChat && (
        <TemplateSelectorModal
          contact={activeContact}
          onSelect={(content) => {
            setInputText(content);
            setIsTemplateModalOpen(false);
          }}
          onClose={() => setIsTemplateModalOpen(false)}
        />
      )}

      {/* WhatsApp Simulator Modal */}
      {isSimulatorModalOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorModalOpen(false)} />
      )}
    </div>
  );
};
