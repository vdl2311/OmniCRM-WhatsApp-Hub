import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowRule, WorkflowTrigger, WorkflowAction } from '../../types';
import { X, Zap, Play, CheckCircle2 } from 'lucide-react';

interface WorkflowModalProps {
  workflow?: WorkflowRule | null;
  onClose: () => void;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ workflow, onClose }) => {
  const { addWorkflow, updateWorkflow } = useApp();

  const [title, setTitle] = useState(workflow?.title || workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  
  const getInitialTrigger = (): WorkflowTrigger => {
    if (!workflow?.trigger) return 'lead_created';
    if (typeof workflow.trigger === 'string') return workflow.trigger.toLowerCase() as WorkflowTrigger;
    const type = (workflow.trigger as any)?.type?.toLowerCase();
    return (type || 'lead_created') as WorkflowTrigger;
  };

  const getInitialAction = (): WorkflowAction => {
    if (workflow?.action) return (typeof workflow.action === 'string' ? workflow.action.toLowerCase() : 'send_whatsapp_message') as WorkflowAction;
    if (workflow?.actions && workflow.actions.length > 0) {
      const actType = workflow.actions[0]?.type;
      return (typeof actType === 'string' ? actType.toLowerCase() : 'send_whatsapp_message') as WorkflowAction;
    }
    return 'send_whatsapp_message';
  };

  const [trigger, setTrigger] = useState<WorkflowTrigger>(getInitialTrigger());
  const [action, setAction] = useState<WorkflowAction>(getInitialAction());
  const [messageTemplate, setMessageTemplate] = useState(workflow?.actionPayload?.messageTemplate || 'Olá {{nome}}, recebemos seu contato!');
  const [taskTitle, setTaskTitle] = useState(workflow?.actionPayload?.taskTitle || 'Ligar para novo lead em até 15 minutos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título da automação é obrigatório.');
      return;
    }

    const payload: any = {};
    if (action === 'send_whatsapp_message') {
      payload.messageTemplate = messageTemplate;
    } else if (action === 'create_task') {
      payload.taskTitle = taskTitle;
      payload.priority = 'urgent';
    }

    if (workflow) {
      updateWorkflow(workflow.id, {
        title,
        description,
        trigger,
        action,
        actionPayload: payload,
      });
    } else {
      addWorkflow({
        title,
        description,
        trigger,
        action,
        isActive: true,
        actionPayload: payload,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {workflow ? 'Editar Automação' : 'Criar Nova Automação'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nome da Automação *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Mensagem de Boas-Vindas para Novos Leads"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Envia saudação imediata quando o lead se cadastra pelo site ou anúncio"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">1. Quando acontecer o evento (Trigger):</label>
            <select
              value={trigger}
              onChange={e => setTrigger(e.target.value as WorkflowTrigger)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
            >
              <option value="lead_created">Novo Lead Cadastrado (Site, Ads ou Manual)</option>
              <option value="deal_stage_changed">Oportunidade avançou de etapa no Funil</option>
              <option value="message_received">Mensagem WhatsApp recebida de cliente</option>
              <option value="deal_won">Venda Concluída / Marcada como Ganho</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">2. Executar a seguinte Ação (Action):</label>
            <select
              value={action}
              onChange={e => setAction(e.target.value as WorkflowAction)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none"
            >
              <option value="send_whatsapp_message">Enviar Mensagem WhatsApp Automática</option>
              <option value="create_task">Criar Tarefa de Follow-up com Prazo</option>
              <option value="assign_agent">Distribuir Lead para Atendente (Roleta)</option>
              <option value="add_tag">Adicionar Tag / Etiqueta ao Contato</option>
              <option value="change_deal_stage">Mover Negócio para Próxima Etapa</option>
            </select>
          </div>

          {action === 'send_whatsapp_message' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Texto da Mensagem (Variáveis: {'{{nome}}, {{empresa}}'}):</label>
              <textarea
                value={messageTemplate}
                onChange={e => setMessageTemplate(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none resize-none font-mono"
              />
            </div>
          )}

          {action === 'create_task' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Título da Tarefa Gerada:</label>
              <input
                type="text"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              {workflow ? 'Salvar Automação' : 'Criar Automação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
