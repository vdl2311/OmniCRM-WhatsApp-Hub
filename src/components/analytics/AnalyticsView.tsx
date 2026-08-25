import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Users,
  MessageSquare,
  Clock,
  Award,
  AlertCircle,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { deals, contacts, chats, users, pipelines } = useApp();
  const [period, setPeriod] = useState<'30d' | '90d' | 'year'>('30d');

  // Calculations
  const wonDeals = deals.filter(d => d.status === 'won');
  const lostDeals = deals.filter(d => d.status === 'lost');
  const openDeals = deals.filter(d => d.status === 'open');

  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalOpenValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const conversionRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;
  const avgTicket = wonDeals.length > 0 ? Math.round(totalWonValue / wonDeals.length) : 0;

  // Agent Performance ranking
  const agentRanking = users.map(user => {
    const userDeals = deals.filter(d => d.assignedToId === user.id);
    const userWon = userDeals.filter(d => d.status === 'won');
    const wonValue = userWon.reduce((sum, d) => sum + d.value, 0);
    const userChats = chats.filter(c => c.assignedToId === user.id);

    return {
      user,
      totalDeals: userDeals.length,
      wonDealsCount: userWon.length,
      wonValue,
      chatsCount: userChats.length,
      avgResponseMinutes: 4.2, // simulated SLA
    };
  }).sort((a, b) => b.wonValue - a.wonValue);

  // Lead Source breakdown
  const sourcesMap: Record<string, { total: number; won: number }> = {};
  contacts.forEach(c => {
    if (!sourcesMap[c.source]) {
      sourcesMap[c.source] = { total: 0, won: 0 };
    }
    sourcesMap[c.source].total += 1;
    if (c.status === 'ganho') {
      sourcesMap[c.source].won += 1;
    }
  });

  // Export Analytics CSV
  const handleExportReport = () => {
    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Total Vendas Ganhas (R$)', totalWonValue],
      ['Total Oportunidades Abertas (R$)', totalOpenValue],
      ['Taxa de Conversão Global (%)', `${conversionRate}%`],
      ['Ticket Médio (R$)', avgTicket],
      ['Tempo Médio Primeira Resposta', '4.5 minutos'],
      ['Atendimentos WhatsApp Realizados', chats.length],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_analitico_omnicrm_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Relatórios & Business Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas de conversão de funil, produtividade dos atendentes e análise de perdas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as any)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="30d">Últimos 30 Dias</option>
            <option value="90d">Último Trimestre</option>
            <option value="year">Ano Atual</option>
          </select>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Receita Ganha (Fechado)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            R$ {totalWonValue.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs. período anterior</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Em Negociação no Funil</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            R$ {totalOpenValue.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-slate-400">
            {openDeals.length} oportunidades ativas
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Taxa de Conversão</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Ticket Médio: R$ {avgTicket.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Tempo 1ª Resposta WhatsApp</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            4.2 min
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Meta interna atingida (&lt; 5 min)
          </div>
        </div>
      </div>

      {/* Main Analysis Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de Vendedores */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Desempenho da Equipe Comercial</span>
            </h3>
            <span className="text-xs text-slate-400">Ordenado por faturamento</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 font-semibold border-b border-slate-100 pb-2">
                <tr>
                  <th className="py-2">Vendedor</th>
                  <th className="py-2">Negócios</th>
                  <th className="py-2">Ganhos</th>
                  <th className="py-2">Faturamento</th>
                  <th className="py-2">TMR Médio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentRanking.map((item, idx) => (
                  <tr key={item.user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 flex items-center gap-2.5">
                      <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                      <img src={item.user.avatarUrl} alt={item.user.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900">{item.user.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{item.user.role}</div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{item.totalDeals}</td>
                    <td className="py-3 font-semibold text-emerald-700">{item.wonDealsCount}</td>
                    <td className="py-3 font-bold text-slate-900">R$ {item.wonValue.toLocaleString('pt-BR')}</td>
                    <td className="py-3 text-slate-500">{item.avgResponseMinutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Motivos de Perda & Insights */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Principais Motivos de Perda</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Preço / Orçamento fora</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[45%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Escolheu Concorrente</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[25%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Sem retorno / Contato frio</span>
                <span className="font-bold">20%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[20%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Falta de recursos técnicos</span>
                <span className="font-bold">10%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full w-[10%]"></div>
              </div>
            </div>
          </div>

          {/* Actionable Note */}
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-950">
            <strong>Recomendação IA:</strong> Criar uma régua de automação de reengajamento para leads que alegaram preço após 45 dias com condições sazonais.
          </div>
        </div>
      </div>

      {/* Conversion by Channel Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Conversão por Origem / Canal de Entrada</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {Object.entries(sourcesMap).map(([source, data]) => {
            const rate = data.total > 0 ? Math.round((data.won / data.total) * 100) : 0;

            return (
              <div key={source} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="font-bold text-slate-900">{source}</div>
                <div className="text-slate-500 text-[11px]">
                  {data.total} leads cadastrados • {data.won} fechados
                </div>
                <div className="text-emerald-700 font-extrabold text-base">
                  {rate}% de conversão
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
