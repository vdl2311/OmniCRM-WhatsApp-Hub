import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
  MessageSquare,
  Sparkles,
  Server,
  Database,
  ArrowRight,
  Download,
  PhoneCall,
  Bot,
  Workflow,
  BarChart3,
  Users,
} from 'lucide-react';

export const ProposalView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'modules' | 'whatsapp' | 'stack' | 'architecture' | 'security'>('overview');

  const modules = [
    {
      title: '1. Gestão Centralizada de Contatos & Leads',
      icon: Users,
      desc: 'Cadastro 360°, enriquecimento de dados, histórico de interações unificado, campos personalizados, tags dinâmicas e importação/exportação CSV.',
      features: ['Deduplicação automática', 'Segmentação avançada por score e tag', 'Histórico completo de conversas e atividades'],
    },
    {
      title: '2. Pipeline Comercial Visual (Kanban & Lista)',
      icon: Layers,
      desc: 'Múltiplos funis configuráveis, cálculo automático de SLA em cada etapa, motivos de perda/ganho detalhados e previsão de receita.',
      features: ['Arrastar e soltar suave com recálculo de valores', 'Alertas visuais de estagnação por etapa', 'Validação de motivos de perda'],
    },
    {
      title: '3. Atendimento WhatsApp Multi-Atendente',
      icon: MessageSquare,
      desc: 'Caixa de entrada unificada com múltiplos operadores no mesmo número WhatsApp, distribuição automática (Round-Robin) e transferências.',
      features: ['Respostas rápidas com atalhos (/atalho)', 'Envio de mídia, áudio gravado e documentos', 'Auditoria de atendimentos e status em tempo real'],
    },
    {
      title: '4. IA Gemini Assistente Comercial',
      icon: Sparkles,
      desc: 'Análise preditiva de probabilidade de fechamento, sugestão contextual de respostas no chat, qualificação automática de leads e resumos de conversas.',
      features: ['Resumo executivo com 1 clique', 'Classificação de sentimento e urgência', 'Geração de mensagens persuasivas personalizadas'],
    },
    {
      title: '5. Automações & Gatilhos Comerciais',
      icon: Workflow,
      desc: 'Workflows inteligentes ativados por eventos (novo lead, mudança de etapa, mensagem recebida) com ações imediatas ou agendadas.',
      features: ['Distribuição automática em roleta (Round-Robin)', 'Envio automático de mensagem de boas-vindas', 'Criação automática de tarefas de follow-up'],
    },
    {
      title: '6. Gestão de Tarefas, Reuniões e Follow-ups',
      icon: Zap,
      desc: 'Agenda integrada de compromissos com lembretes automáticos, sincronização com contatos e negócios, e filtro de tarefas atrasadas.',
      features: ['Priorização (Urgente, Alta, Média, Baixa)', 'Vinculação direta com contatos e negócios', 'Notificações de vencimento'],
    },
    {
      title: '7. Relatórios & Business Intelligence',
      icon: BarChart3,
      desc: 'Dashboard executivo em tempo real, taxas de conversão de funil, tempo médio de resposta (TMR/SLA) e ranking de performance por vendedor.',
      features: ['Exportação de relatórios estruturados', 'Análise de canais de aquisição de leads', 'Monitoramento ao vivo de metas de receita'],
    },
    {
      title: '8. Segurança & Controle de Acesso (RBAC)',
      icon: ShieldCheck,
      desc: 'Hierarquia de permissões para Administradores, Gerentes e Atendentes, isolamento de visualização de dados e log de auditoria detalhado.',
      features: ['Privacidade de contatos por atendente', 'Log de eventos críticos do sistema', 'Conformidade integral com a LGPD'],
    },
  ];

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Documentação do Projeto & Arquitetura Comercial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Proposta de CRM Corporativo com Integração WhatsApp & IA
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Solução completa de gestão comercial, unificando captação de leads, atendimento multi-atendente via WhatsApp Oficial, automação de processos comerciais e inteligência artificial generativa.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Responsivo (Mobile, Tablet, Desktop)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Bot className="w-4 h-4 text-emerald-400" />
              IA Gemini 2.5 Integrada
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Controle RBAC & LGPD Ready
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'overview' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Visão Geral & Escopo
        </button>
        <button
          onClick={() => setActiveSection('modules')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'modules' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Módulos do Sistema ({modules.length})
        </button>
        <button
          onClick={() => setActiveSection('whatsapp')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Integração WhatsApp (Oficial vs Evolution)
        </button>
        <button
          onClick={() => setActiveSection('stack')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'stack' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stack Tecnológica & Engenharia
        </button>
        <button
          onClick={() => setActiveSection('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'architecture' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Arquitetura & IA
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSection === 'security' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Segurança & LGPD
        </button>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Objetivo Estratégico</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Substituir ferramentas descentralizadas e planilhas por uma plataforma centralizada e de alta performance. O CRM une o funil de vendas, as conversas em tempo real do WhatsApp e automações comerciais para acelerar o fechamento de oportunidades e garantir que nenhum lead fique sem resposta.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1">Centralização 360°</div>
                  <div className="text-[11px] text-slate-500">Histórico de conversas, negociações e dados de contato consolidados.</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1">Atendimento Simultâneo</div>
                  <div className="text-[11px] text-slate-500">Vários vendedores atendendo no mesmo número WhatsApp sem conflitos.</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1">Automação de Follow-ups</div>
                  <div className="text-[11px] text-slate-500">Réguas de mensagens automáticas e criação de tarefas inteligentes.</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1">Inteligência Artificial</div>
                  <div className="text-[11px] text-slate-500">Diagnóstico comercial, classificação de leads e sugestão de respostas com IA.</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Benefícios Mensuráveis</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Redução de 75% no Tempo de Primeira Resposta</h4>
                    <p className="text-[11px] text-slate-500">Distribuição imediata por roleta (Round-Robin) e mensagens instantâneas de acolhimento.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Aumento de 35% na Taxa de Conversão do Funil</h4>
                    <p className="text-[11px] text-slate-500">Visão transparente das etapas, alertas de leads estagnados e tarefas com SLA rigoroso.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Controle Total e Rastreabilidade da Carteira</h4>
                    <p className="text-[11px] text-slate-500">Os dados e contatos pertencem à empresa, com segurança e permissões por perfil de usuário.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resumo do Projeto
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Tipo:</span>
                  <span className="font-semibold text-white">Full-Stack SPA + API</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Frontend:</span>
                  <span className="font-semibold text-white">React 19 + Tailwind CSS</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Inteligência:</span>
                  <span className="font-semibold text-white">Gemini 2.5 AI SDK</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Integração:</span>
                  <span className="font-semibold text-white">WhatsApp Cloud API</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Responsividade:</span>
                  <span className="font-semibold text-emerald-400">Completa (Mobile/Desktop)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MODULES */}
      {activeSection === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{m.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {m.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 3: WHATSAPP INTEGRATION COMPARISON */}
      {activeSection === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Análise Técnica & Comparativo de Integração WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-1">Estratégias de conexão para o CRM: API Oficial Meta (Cloud API) vs Evolution API vs Provedores BSP.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Arquitetura Híbrida / Adapter Pattern
              </span>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Option 1: Meta Cloud API */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-emerald-500/50 relative flex flex-col justify-between space-y-4">
                <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                  Recomendado p/ Empresas
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      API
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">WhatsApp Cloud API (Meta Oficial)</h4>
                      <p className="text-[10px] text-slate-500">API Direta no Meta for Developers</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Risco Zero de Ban:</strong> 100% em conformidade com os Termos de Serviço da Meta.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>SLA & Alta Disponibilidade:</strong> Servidores globais da Meta com Webhooks assíncronos.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Templates Homologados:</strong> Envio de notificações proativas com botões interativos e listas.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Janela de 24h:</strong> Mensagens livres e ilimitadas durante a janela de atendimento iniciada pelo cliente.</span>
                    </li>
                  </ul>
                </div>
                <div className="text-[10px] bg-emerald-100/70 p-2.5 rounded-xl text-emerald-900 border border-emerald-200">
                  <strong>Indicado para:</strong> Operações corporativas, escalabilidade sem risco de bloqueio de número, envios estruturados.
                </div>
              </div>

              {/* Option 2: Evolution API */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      EVO
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Evolution API (Baileys / Node.js)</h4>
                      <p className="text-[10px] text-slate-500">Microserviço Open-Source via QR Code</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Custo Zero por Conversa:</strong> Utiliza o plano de dados do próprio chip/número.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Leitura de QR Code instantânea:</strong> Não requer aprovação prévia de templates ou verificação de empresa.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Suporte a Grupos e Status:</strong> Acesso a recursos nativos do app móvel.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">⚠️</span>
                      <span><strong>Atenção:</strong> Requer política anti-spam rigorosa para prevenir bloqueios pela Meta.</span>
                    </li>
                  </ul>
                </div>
                <div className="text-[10px] bg-blue-50 p-2.5 rounded-xl text-blue-900 border border-blue-200">
                  <strong>Indicado para:</strong> Validação ágil, números de SDRs individuais ou automações internas sem custo de API.
                </div>
              </div>

              {/* Option 3: BSPs (Twilio / Z-API) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      BSP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Provedores BSP / Hubs (Z-API, Twilio)</h4>
                      <p className="text-[10px] text-slate-500">Gateways Intermediários Gerenciados</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Onboarding Simplificado:</strong> Painéis pré-configurados e suporte técnico do intermediário.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Webhooks Normalizados:</strong> Facilidade de deploy com payloads padronizados.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">💰</span>
                      <span><strong>Custo Adicional:</strong> Cobrança de mensalidade ou markup sobre mensagens da Meta.</span>
                    </li>
                  </ul>
                </div>
                <div className="text-[10px] bg-purple-50 p-2.5 rounded-xl text-purple-900 border border-purple-200">
                  <strong>Indicado para:</strong> Times que buscam suporte terceiro com provisionamento guiado.
                </div>
              </div>
            </div>

            {/* Pattern Recommendation */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Zap className="w-4 h-4" />
                <span>Nossa Abordagem de Engenharia: WhatsApp Gateway Adapter Pattern</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Desenvolvemos uma camada agnóstica de mensageria (<code className="font-mono text-emerald-300">WhatsAppGatewayService</code>). O CRM se comunica com uma interface unificada (<code className="font-mono text-emerald-300">sendMessage</code>, <code className="font-mono text-emerald-300">receiveWebhook</code>, <code className="font-mono text-emerald-300">sendTemplate</code>, <code className="font-mono text-emerald-300">getMedia</code>). Isso permite ao cliente alternar entre <strong>WhatsApp Cloud API Oficial</strong> e <strong>Evolution API</strong> apenas alterando variáveis de ambiente, sem alterar uma única linha de código de negócio do CRM.
              </p>
            </div>
          </div>

          {/* Detailed Message Pipeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Pipeline de Dados em Tempo Real (Webhooks & Fila)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">1. Ingestão Webhook</div>
                <p className="text-[11px] text-slate-500">Validação de assinatura HMAC SHA-256 da Meta ou token da Evolution API. Resposta 200 OK em menos de 100ms.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">2. Fila Assíncrona (Redis/BullMQ)</div>
                <p className="text-[11px] text-slate-500">Desacoplamento de carga para garantir entrega e tratamento sequencial sem perda de mensagens em picos.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">3. Triagem & Roleta</div>
                <p className="text-[11px] text-slate-500">Busca contato existente ou cria novo lead. Atribuição de atendente via algoritmo Round-Robin ponderado.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">4. Broadcast SSE / WebSocket</div>
                <p className="text-[11px] text-slate-500">Envio instantâneo para a tela do atendente com notificações sonoras e sugestão automática da IA Gemini.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STACK TECNOLÓGICA DETALHADA */}
      {activeSection === 'stack' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontend Stack */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Frontend (Camada de Apresentação)</h4>
                  <p className="text-xs text-slate-500">Interface SPA de Alta Performance</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">React 19 + TypeScript (Strict Mode)</span>
                  Arquitetura baseada em componentes funcionais, custom hooks reativos e tipagem estrita de todos os modelos (Leads, Pipelines, Mensagens, Tasks).
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Tailwind CSS v4 + Motion</span>
                  Design system sob medida, responsividade total (Mobile, Tablet, Desktop), animações suaves e arrastar e soltar (Kanban DND).
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Lucide React & Canvas Confetti</span>
                  Ícones vetorizados sem impacto de bundle e celebrações visuais de fechamento de negócios.
                </div>
              </div>
            </div>

            {/* Backend & API Stack */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Backend & Microsserviços</h4>
                  <p className="text-xs text-slate-500">Motor de Regras, Webhooks & Integrações</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Node.js (v20+ LTS) + Express</span>
                  Servidor robusto para rotas RESTful, processamento de webhooks e proxies seguros de inteligência artificial.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Google GenAI SDK Oficial (@google/genai)</span>
                  Integração nativa com modelo Gemini 2.5 Flash para geração de respostas, scoring de probabilidade e resumos em tempo real.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Arquitetura de Filas e Eventos</span>
                  Fila para tratamento de picos de mensagens e envio em lote de automações sem travamento da thread principal.
                </div>
              </div>
            </div>

            {/* Database & Persistence */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Banco de Dados & Armazenamento</h4>
                  <p className="text-xs text-slate-500">Persistência Relacional & Cache em Memória</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">PostgreSQL / Cloud SQL / Firestore</span>
                  Modelagem relacional para integridade referencial entre Contatos, Negócios, Etapas, Tarefas e Histórico de Conversas.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Redis (Cache & Rate Limiting)</span>
                  Gerenciamento de sessões, controle de concorrência na roleta de leads e limitação de taxa (Rate Limiting).
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Storage S3 / Google Cloud Storage</span>
                  Repositório seguro de áudios gravados, imagens, PDFs e comprovantes enviados pelo WhatsApp.
                </div>
              </div>
            </div>

            {/* DevOps & Infra */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Infraestrutura & DevOps</h4>
                  <p className="text-xs text-slate-500">Escalabilidade, CI/CD e Monitoramento</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Docker & Containerização</span>
                  Empacotamento de toda a aplicação e microsserviços para deploy padronizado em Cloud Run, AWS ECS ou VPS.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">CI/CD Automatizado & GitHub Actions</span>
                  Pipeline contínuo de linting, testes automatizados e deploy zero-downtime.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Certificação SSL & Criptografia TLS 1.3</span>
                  Todas as conexões HTTP e WebSockets protegidas com certificados criptográficos ponta a ponta.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ARCHITECTURE */}
      {activeSection === 'architecture' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              Stack Tecnológica & Padrões
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>React 19 + TypeScript:</strong> Tipagem estrita de todos os modelos de dados e componentes modulares.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tailwind CSS v4:</strong> Design responsivo para mobile, tablet e desktop com alta densidade de informação.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Express API Server:</strong> Endpoints seguros para inteligência artificial, webhooks e proxy de API.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Persistência Segura:</strong> Armazenamento local e preparado para sincronização em nuvem.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Integração Gemini AI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O backend Express integra a biblioteca oficial <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded">@google/genai</code> para alimentar funcionalidades preditivas em tempo real no CRM:
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span><strong>Score de Qualificação:</strong> Avalia probabilidade de fechamento baseada no histórico.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span><strong>Resumo de Conversas:</strong> Sintetiza longas trocas de mensagens em tópicos-chave.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span><strong>Sugestões de Mensagem:</strong> Gera respostas empáticas e persuasivas para objeções comuns.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 5: SECURITY */}
      {activeSection === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Políticas de Segurança, RBAC & LGPD
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Perfis de Acesso (RBAC)</h4>
              <p className="text-[11px] text-slate-500">Administradores têm controle total; vendedores visualizam apenas seus contatos e negócios atribuídos.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Auditoria & Rastreabilidade</h4>
              <p className="text-[11px] text-slate-500">Registro cronológico de todas as ações: criação de contatos, alterações de estágio e exclusões.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">Privacidade dos Dados</h4>
              <p className="text-[11px] text-slate-500">Chaves de API mantidas exclusivamente no servidor backend sem exposição ao navegador.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
