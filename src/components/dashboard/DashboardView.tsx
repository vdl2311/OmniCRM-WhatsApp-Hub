import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Filter,
  Calendar,
  AlertTriangle,
  Flame,
  Zap,
  PhoneIncoming,
  Headphones,
  Award,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { contacts, deals, chats, tasks, users, pipelines, setCurrentView, setActiveChatId } = useApp();
  const [periodFilter, setPeriodFilter] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  // Filter deals
  const filteredDeals = deals.filter(d => {
    if (selectedAgentFilter !== 'all' && d.assignedToId !== selectedAgentFilter) return false;
    return true;
  });

  // Calculate Metrics
  const wonDeals = filteredDeals.filter(d => d.status === 'won');
  const openDeals = filteredDeals.filter(d => d.status === 'open');
  const lostDeals = filteredDeals.filter(d => d.status === 'lost');

  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalInNegotiation = openDeals.reduce((sum, d) => sum + d.value, 0);
  const conversionRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : '0';
  const averageTicket = wonDeals.length > 0 ? (totalWonRevenue / wonDeals.length) : 0;

  // WhatsApp Metrics
  const activeChats = chats.filter(c => c.status === 'open' || c.status === 'pending');
  const unassignedChats = chats.filter(c => c.status === 'unassigned');
  const resolvedChats = chats.filter(c => c.status === 'resolved' || c.status === 'closed');

  // Sources breakdown
  const sourceCounts: Record<string, number> = {};
  contacts.forEach(c => {
    sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1;
  });

  // Stage distribution
  const mainPipeline = pipelines[0];
  const stageStats = mainPipeline?.stages.map(stg => {
    const stageDeals = deals.filter(d => d.stageId === stg.id);
    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      stage: stg,
      count: stageDeals.length,
      value: stageValue,
    };
  }) || [];

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>Painel Executivo & Atendimento</span>
            <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
              Ao Vivo
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão consolidada de pipeline comercial, conversas de WhatsApp e desempenho da equipe.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setPeriodFilter('today')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${periodFilter === 'today' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriodFilter('7d')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${periodFilter === '7d' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setPeriodFilter('30d')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${periodFilter === '30d' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              30 Dias
            </button>
          </div>

          {/* Agent Filter */}
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Toda a Equipe</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row 1: Commercial */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          Indicadores Comerciais & Receita
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Won */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Vendas Realizadas</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                R$ {totalWonRevenue.toLocaleString('pt-BR')}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{wonDeals.length} contratos fechados</span>
              </div>
            </div>
          </div>

          {/* In Negotiation Pipeline */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Em Negociação / Aberto</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                R$ {totalInNegotiation.toLocaleString('pt-BR')}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-600 font-medium">
                <span>{openDeals.length} oportunidades ativas</span>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Taxa de Conversão</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {conversionRate}%
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-600 font-medium">
                <span>Ticket Médio: R$ {Math.round(averageTicket).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Total Leads */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total de Leads / Contatos</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {contacts.length}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 font-medium">
                <span>{contacts.filter(c => c.type === 'lead').length} novos leads qualificados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2: WhatsApp & Support Operations */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          Métricas de Atendimento WhatsApp em Tempo Real
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Chats */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Conversas em Atendimento</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {activeChats.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Distribuídas entre {users.filter(u => u.isOnline).length} atendentes online</p>
          </div>

          {/* Unassigned Queue */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Fila Sem Responsável</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600">
              {unassignedChats.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {unassignedChats.length > 0 ? 'Aguardando atribuição automática' : 'Fila zerada! Parabéns'}
            </p>
          </div>

          {/* First Response Time */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tempo Médio 1ª Resposta (TMG)</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              1m 42s
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Meta atingida (&lt; 3 minutos)</p>
          </div>

          {/* Average Resolution Time */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tempo Médio Atendimento (TMA)</span>
              <Headphones className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              14m 10s
            </div>
            <p className="text-xs text-slate-500 mt-1">94% de satisfação do cliente</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Stage Breakdown */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Volume e Valor por Etapa do Funil</h3>
              <p className="text-xs text-slate-500">{mainPipeline?.name}</p>
            </div>
            <button
              onClick={() => setCurrentView('kanban')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              Abrir Kanban Completo &rarr;
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {stageStats.map(({ stage, count, value }) => {
              const maxVal = Math.max(...stageStats.map(s => s.value), 1);
              const percentage = (value / maxVal) * 100;

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                      <span className="font-semibold text-slate-800">{stage.name}</span>
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[11px]">
                        {count} {count === 1 ? 'negócio' : 'negócios'}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      R$ {value.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 4)}%`,
                        backgroundColor: stage.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Origins & Channels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Origem dos Leads</h3>
          <div className="space-y-3">
            {Object.entries(sourceCounts).map(([source, count]) => {
              const pct = ((count / contacts.length) * 100).toFixed(0);
              return (
                <div key={source} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{source}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="font-bold text-slate-900 w-8 text-right">{count} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Motivos de Perda Frequentes
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Preço / Orçamento</span>
                <span className="font-semibold text-rose-600">50%</span>
              </div>
              <div className="flex justify-between">
                <span>Escolheu Concorrente</span>
                <span className="font-semibold text-rose-600">30%</span>
              </div>
              <div className="flex justify-between">
                <span>Sem retorno / Contato Frio</span>
                <span className="font-semibold text-rose-600">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leaderboard & Active Chats Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Leaderboard */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Desempenho da Equipe Comercial
            </h3>
            <span className="text-xs text-slate-400">Atendimentos e Negócios</span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((user) => {
              const userDeals = deals.filter(d => d.assignedToId === user.id);
              const userWon = userDeals.filter(d => d.status === 'won');
              const wonTotal = userWon.reduce((sum, d) => sum + d.value, 0);

              return (
                <div key={user.id} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.department}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      R$ {wonTotal.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {userWon.length} vendas • {user.activeChatsCount} chats ativos
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live WhatsApp Queue Quick Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Atendimentos Recentes no WhatsApp
            </h3>
            <button
              onClick={() => setCurrentView('whatsapp')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Ver Todas as Conversas &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {chats.slice(0, 4).map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setCurrentView('whatsapp');
                }}
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={chat.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={chat.contactName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900 truncate flex items-center gap-1.5">
                      {chat.contactName}
                      {chat.status === 'unassigned' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">
                          Fila
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                      {chat.lastMessage}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400">
                    {new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="mt-0.5 inline-block text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
