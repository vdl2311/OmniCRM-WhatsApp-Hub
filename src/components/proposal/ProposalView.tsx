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
  const [activeSection, setActiveSection] = useState<'overview' | 'modules' | 'whatsapp' | 'architecture' | 'security' | 'deliverables'>('overview');

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
          Fluxo WhatsApp Multi-Atendente
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

      {/* SECTION 3: WHATSAPP */}
      {activeSection === 'whatsapp' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Arquitetura de Atendimento WhatsApp</h3>
            <p className="text-xs text-slate-500 mt-1">Como funciona a comunicação bidirecional com a WhatsApp Cloud API e os operadores do CRM.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">1. Entrada do Lead</div>
              <p className="text-[11px] text-slate-500">Cliente envia mensagem no WhatsApp. O Webhook oficial recebe o evento em tempo real.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">2. Triagem & Roleta</div>
              <p className="text-[11px] text-slate-500">O motor de automação associa ou cria o contato e distribui para um atendente disponível.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">3. Atendimento & IA</div>
              <p className="text-[11px] text-slate-500">Vendedor conversa via Inbox central, usando respostas rápidas e sugestões da IA Gemini.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">4. Conversão no Funil</div>
              <p className="text-[11px] text-slate-500">A negociação é criada e movida no Kanban até a conclusão com registro do histórico.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ARCHITECTURE */}
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
