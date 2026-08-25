import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowRule } from '../../types';
import {
  Zap,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit2,
  ArrowRight,
  MessageSquare,
  CheckSquare,
  UserCheck,
  Tag,
  GitBranch,
} from 'lucide-react';
import { WorkflowModal } from './WorkflowModal';

export const AutomationsView: React.FC = () => {
  const { workflows, toggleWorkflow, deleteWorkflow } = useApp();
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTriggerLabel = (trigger: any): string => {
    if (!trigger) return 'Gatilho de entrada';
    const typeStr = typeof trigger === 'string' ? trigger : trigger?.type || '';
    const upperType = String(typeStr).toUpperCase();

    switch (upperType) {
      case 'LEAD_CREATED':
        return 'Quando um novo Lead for cadastrado';
      case 'DEAL_STAGE_CHANGED': {
        const stageId = trigger?.params?.stageId || trigger?.stageId;
        return stageId ? `Quando Oportunidade avançar de etapa (${stageId})` : 'Quando uma Oportunidade mudar de etapa';
      }
      case 'MESSAGE_RECEIVED':
        return 'Quando uma mensagem WhatsApp for recebida';
      case 'CHAT_UNANSWERED': {
        const mins = trigger?.params?.unansweredMinutes || 30;
        return `Quando conversa ficar sem resposta por ${mins} min`;
      }
      case 'CHAT_RESOLVED':
        return 'Quando um atendimento for finalizado';
      case 'DEAL_WON':
        return 'Quando uma Venda for marcada como Ganha';
      case 'TAG_ADDED':
        return 'Quando uma etiqueta for adicionada';
      default:
        return typeof trigger === 'string' ? trigger : String(typeStr || 'Gatilho personalizado');
    }
  };

  const getActionLabel = (action: any): string => {
    if (!action) return 'Ação automática';
    const typeStr = typeof action === 'string' ? action : action?.type || '';
    const upperAction = String(typeStr).toUpperCase();

    switch (upperAction) {
      case 'SEND_WHATSAPP_MESSAGE':
      case 'SEND_WHATSAPP_TEMPLATE':
        return 'Enviar mensagem/template WhatsApp';
      case 'CREATE_TASK':
        return 'Criar tarefa de follow-up automaticamente';
      case 'ASSIGN_AGENT':
      case 'ASSIGN_AGENT_ROUND_ROBIN':
        return 'Distribuir para atendente em roleta (Round-Robin)';
      case 'ASSIGN_SPECIFIC_AGENT':
        return 'Atribuir a um atendente específico';
      case 'ADD_TAG':
        return 'Adicionar etiqueta/tag ao contato';
      case 'CHANGE_DEAL_STAGE':
      case 'MOVE_DEAL_STAGE':
        return 'Mover para próxima etapa no funil';
      case 'NOTIFY_TEAM':
        return 'Enviar notificação de alerta para a equipe';
      default:
        return typeof action === 'string' ? action : String(typeStr || 'Ação configurada');
    }
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>Motor de Automações & Workflows</span>
            <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
              {workflows.filter(w => w.isActive).length} ativas
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure réguas de atendimento automático, distribuição de leads (round-robin) e follow-ups inteligentes.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingWorkflow(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Automação</span>
        </button>
      </div>

      {/* Workflow Rules List */}
      <div className="space-y-4">
        {workflows.map(wf => (
          <div
            key={wf.id}
            className={`p-5 rounded-2xl border transition shadow-xs bg-white ${
              wf.isActive ? 'border-slate-200/90' : 'border-slate-200/50 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${wf.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{wf.title || wf.name || 'Automação Comercial'}</h4>
                  <p className="text-xs text-slate-500">{wf.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Active toggle */}
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl transition ${
                    wf.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {wf.isActive ? 'Automação Ativa' : 'Pausada'}
                </button>

                <button
                  onClick={() => {
                    setEditingWorkflow(wf);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  title="Editar Workflow"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Excluir automação "${wf.title || wf.name}"?`)) {
                      deleteWorkflow(wf.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Excluir Automação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Logic Flow Representation */}
            <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 text-xs">
              {/* Trigger */}
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  1. Gatilho de Entrada (Trigger)
                </span>
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{getTriggerLabel(wf.trigger)}</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block shrink-0" />

              {/* Action */}
              <div className="flex-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  2. Ação(ões) Executada(s) Automaticamente
                </span>
                {wf.actions && wf.actions.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {wf.actions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-emerald-950 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{getActionLabel(act)}</span>
                        {act.params?.taskTitle && (
                          <span className="text-[11px] text-emerald-800 font-normal italic truncate">
                            ("{act.params.taskTitle}")
                          </span>
                        )}
                        {act.params?.tagToAdd && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                            {act.params.tagToAdd}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-semibold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{getActionLabel(wf.action)}</span>
                  </div>
                )}
                {wf.actionPayload && (
                  <div className="text-[11px] text-emerald-800/80 mt-1 font-mono">
                    {wf.actionPayload.messageTemplate || wf.actionPayload.taskTitle || (typeof wf.actionPayload === 'string' ? wf.actionPayload : '')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <WorkflowModal
          workflow={editingWorkflow}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWorkflow(null);
          }}
        />
      )}
    </div>
  );
};
