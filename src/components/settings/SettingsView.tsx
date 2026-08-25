import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  MessageSquare,
  Zap,
  Globe,
  Clock,
  Shield,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { QuickReply, WhatsAppTemplate } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    templates,
    addTemplate,
    quickReplies,
    addQuickReply,
    deleteQuickReply,
    isSoundEnabled,
    setIsSoundEnabled,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'whatsapp_api' | 'templates' | 'quick_replies' | 'business_hours' | 'ai_bot'>('whatsapp_api');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // WhatsApp API Configuration state
  const [provider, setProvider] = useState<'meta_cloud_api' | 'evolution_api' | 'z_api'>('meta_cloud_api');
  const [phoneNumberId, setPhoneNumberId] = useState('109823485723491');
  const [wabaId, setWabaId] = useState('294829384729384');
  const [apiToken, setApiToken] = useState('EAAGk...8293489234892');
  const [webhookUrl, setWebhookUrl] = useState(`${window.location.origin}/api/webhook/whatsapp`);
  const [verifyToken, setVerifyToken] = useState('omnicrm_secure_token_2025');

  // Business Hours
  const [isBusinessHoursActive, setIsBusinessHoursActive] = useState(true);
  const [startHour, setStartHour] = useState('08:00');
  const [endHour, setEndHour] = useState('18:00');
  const [outOfHoursMessage, setOutOfHoursMessage] = useState(
    'Olá! Nosso horário de atendimento é de segunda a sexta, das 08h às 18h. Já registramos sua mensagem e retornaremos assim que iniciarmos o expediente!'
  );

  // AI Chatbot
  const [isAiBotActive, setIsAiBotActive] = useState(true);
  const [aiBotPrompt, setAiBotPrompt] = useState(
    'Você é o assistente virtual da OmniCRM. Seu objetivo é qualificar leads com cordialidade, tirar dúvidas sobre o sistema e sugerir agendamento de demonstração.'
  );

  // New Quick Reply Modal State
  const [isNewQrOpen, setIsNewQrOpen] = useState(false);
  const [newQrShortcut, setNewQrShortcut] = useState('');
  const [newQrTitle, setNewQrTitle] = useState('');
  const [newQrCategory, setNewQrCategory] = useState('Geral');
  const [newQrContent, setNewQrContent] = useState('');

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCreateQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQrShortcut || !newQrContent) return;

    addQuickReply({
      shortcut: newQrShortcut.startsWith('/') ? newQrShortcut : `/${newQrShortcut}`,
      title: newQrTitle || newQrShortcut,
      category: newQrCategory,
      content: newQrContent,
    });

    setNewQrShortcut('');
    setNewQrTitle('');
    setNewQrContent('');
    setIsNewQrOpen(false);
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Configurações & Integrações</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Conexão da API WhatsApp Oficial, Webhooks, Templates aprovados, Respostas Rápidas e Bot de IA.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('whatsapp_api')}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'whatsapp_api' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          WhatsApp API & Webhook
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'templates' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Templates Meta ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('quick_replies')}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'quick_replies' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Respostas Rápidas ({quickReplies.length})
        </button>

        <button
          onClick={() => setActiveTab('business_hours')}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'business_hours' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Horário de Atendimento
        </button>

        <button
          onClick={() => setActiveTab('ai_bot')}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'ai_bot' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Chatbot de IA Gemini
        </button>
      </div>

      {/* TAB CONTENT 1: WHATSAPP API & WEBHOOK */}
      {activeTab === 'whatsapp_api' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Provedor de Conexão WhatsApp</h3>
                  <p className="text-xs text-slate-500">Conecte sua conta oficial Meta Cloud API ou Evolution API</p>
                </div>
              </div>

              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Webhook Online & Conectado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Provedor</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="meta_cloud_api">Meta Cloud API (Oficial WhatsApp)</option>
                  <option value="evolution_api">Evolution API (v2 Self-Hosted)</option>
                  <option value="z_api">Z-API WhatsApp Gateway</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number ID</label>
                <input
                  type="text"
                  value={phoneNumberId}
                  onChange={e => setPhoneNumberId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={wabaId}
                  onChange={e => setWabaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Token Permanente de Acesso (Bearer Token)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Webhook Configuration Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-900">Configuração de Callback de Webhook</h4>
              <p className="text-xs text-slate-600">
                Copie a URL abaixo e configure no painel do Meta for Developers na aba Webhooks &rarr; WhatsApp Business Account:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">URL de Callback (Webhook Endpoint)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-700"
                    />
                    <button
                      onClick={handleCopyWebhook}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1 transition"
                    >
                      {copiedWebhook ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedWebhook ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Verify Token (Token de Verificação)</label>
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={e => setVerifyToken(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert('Configurações da API salvas com sucesso!')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
              >
                Salvar Configurações da API
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TEMPLATES META */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Templates aprovados pela Meta para disparo ativo de mensagens (fora da janela de 24 horas).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{tmpl.name}</h4>
                    <span className="text-[10px] text-slate-400">Categoria: {tmpl.category} • Idioma: {tmpl.language}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                    Aprovado
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 font-mono leading-relaxed">
                  {tmpl.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: QUICK REPLIES */}
      {activeTab === 'quick_replies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Atalhos iniciados com barra (<strong className="text-emerald-700">/</strong>) para envio instantâneo no chat.
            </p>

            <button
              onClick={() => setIsNewQrOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Resposta Rápida</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickReplies.map(qr => (
              <div key={qr.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                      {qr.shortcut}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{qr.title}</h4>
                  </div>

                  <button
                    onClick={() => deleteQuickReply(qr.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {qr.content}
                </p>
              </div>
            ))}
          </div>

          {/* New QR Modal */}
          {isNewQrOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900">Nova Resposta Rápida</h3>

                <form onSubmit={handleCreateQuickReply} className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Atalho (Ex: /ola)</label>
                    <input
                      type="text"
                      required
                      placeholder="/ola"
                      value={newQrShortcut}
                      onChange={e => setNewQrShortcut(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Título</label>
                    <input
                      type="text"
                      required
                      placeholder="Saudação Inicial"
                      value={newQrTitle}
                      onChange={e => setNewQrTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Texto da Resposta</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Olá {{nome}}, como posso te ajudar hoje?"
                      value={newQrContent}
                      onChange={e => setNewQrContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewQrOpen(false)}
                      className="px-4 py-2 bg-slate-100 rounded-xl font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
                    >
                      Salvar Atalho
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: BUSINESS HOURS */}
      {activeTab === 'business_hours' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Horário de Atendimento & Resposta Automática</h3>
              <p className="text-slate-500">Defina os horários em que os atendentes estão disponíveis</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBusinessHoursActive}
                onChange={e => setIsBusinessHoursActive(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-800">Ativar Regra de Fora do Horário</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Início do Expediente</label>
              <input
                type="time"
                value={startHour}
                onChange={e => setStartHour(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Término do Expediente</label>
              <input
                type="time"
                value={endHour}
                onChange={e => setEndHour(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mensagem enviada automaticamente fora do horário:</label>
            <textarea
              value={outOfHoursMessage}
              onChange={e => setOutOfHoursMessage(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert('Horários de atendimento salvos!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              Salvar Horários
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: AI BOT */}
      {activeTab === 'ai_bot' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Bot className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Agente de IA Autônomo (Gemini Copilot)</h3>
                <p className="text-slate-500">Qualificação e triagem 24/7 de contatos antes do transbordo humano</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAiBotActive}
                onChange={e => setIsAiBotActive(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-800">IA Copilot Ativa</span>
            </label>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Instruções de Personalidade (System Prompt)</label>
            <textarea
              value={aiBotPrompt}
              onChange={e => setAiBotPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert('Parâmetros do agente de IA salvos!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              Salvar Configurações de IA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
