import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, Stage } from '../../types';
import {
  Plus,
  Filter,
  Search,
  Settings,
  DollarSign,
  Calendar,
  UserCheck,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { DealModal } from './DealModal';
import { LostReasonModal } from './LostReasonModal';
import { PipelineManagerModal } from './PipelineManagerModal';

export const KanbanView: React.FC = () => {
  const {
    pipelines,
    activePipelineId,
    setActivePipelineId,
    deals,
    contacts,
    users,
    moveDealStage,
    deleteDeal,
    isDealModalOpen,
    setIsDealModalOpen,
    setSelectedContactId,
    setActiveChatId,
    setCurrentView,
    chats,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [lostDealToConfirm, setLostDealToConfirm] = useState<{ dealId: string; stageId: string } | null>(null);
  const [isPipelineManagerOpen, setIsPipelineManagerOpen] = useState(false);

  // Drag and Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const currentPipeline = pipelines.find(p => p.id === activePipelineId) || pipelines[0];

  // Filter deals
  const pipelineDeals = deals.filter(d => {
    if (d.pipelineId !== currentPipeline?.id) return false;
    if (selectedAgent !== 'all' && d.assignedToId !== selectedAgent) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contact = contacts.find(c => c.id === d.contactId);
      const match =
        d.title.toLowerCase().includes(q) ||
        (contact && contact.name.toLowerCase().includes(q)) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  const totalPipelineValue = pipelineDeals.reduce((sum, d) => sum + d.value, 0);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (!dealId) return;

    const targetStage = currentPipeline.stages.find(s => s.id === targetStageId);
    if (targetStage?.isLost || targetStage?.name.toLowerCase().includes('perdido')) {
      setLostDealToConfirm({ dealId, stageId: targetStageId });
    } else {
      moveDealStage(dealId, targetStageId);
    }
    setDraggedDealId(null);
  };

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-3 sm:space-y-4 max-w-full mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Controls & Pipeline Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Pipeline Dropdown */}
          <select
            value={activePipelineId}
            onChange={(e) => setActivePipelineId(e.target.value)}
            className="text-sm sm:text-base font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs cursor-pointer"
          >
            {pipelines.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/60">
            Total: R$ {totalPipelineValue.toLocaleString('pt-BR')}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56 min-w-[140px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar oportunidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            />
          </div>

          {/* Agent filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Todos os Vendedores</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          {/* Pipeline Manager */}
          {currentUser.permissions.canManageAutomations && (
            <button
              onClick={() => setIsPipelineManagerOpen(true)}
              className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition shadow-xs"
              title="Gerenciar Etapas e Funis"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* New Deal */}
          <button
            onClick={() => {
              setEditingDeal(null);
              setIsDealModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container with Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto pb-4 pt-1">
        <div className="flex gap-3.5 h-full min-w-max">
          {currentPipeline.stages.map((stage) => {
            const stageDeals = pipelineDeals.filter(d => d.stageId === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="w-72 bg-slate-100/70 border border-slate-200/80 rounded-2xl flex flex-col h-full max-h-[calc(100vh-10rem)] shadow-2xs"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-slate-200/70 bg-white/70 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                      <h4 className="font-bold text-xs text-slate-800 tracking-tight">{stage.name}</h4>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.2 bg-slate-200/80 text-slate-700 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">R$ {stageTotal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                {/* Deals List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
                  {stageDeals.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400">
                      Arraste oportunidades aqui
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const contact = contacts.find(c => c.id === deal.contactId);
                      const assignedUser = users.find(u => u.id === deal.assignedToId);
                      const contactChat = chats.find(c => c.contactId === deal.contactId);

                      return (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-grab active:cursor-grabbing space-y-2.5 group"
                        >
                          {/* Title & Value */}
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                              {deal.title}
                            </h5>
                            <span className="font-extrabold text-xs text-emerald-700 whitespace-nowrap">
                              R$ {deal.value.toLocaleString('pt-BR')}
                            </span>
                          </div>

                          {/* Contact & Company */}
                          {contact && (
                            <div
                              onClick={() => setSelectedContactId(contact.id)}
                              className="text-[11px] text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 truncate"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate font-medium">{contact.name}</span>
                              {contact.companyName && <span className="text-slate-400 truncate">({contact.companyName})</span>}
                            </div>
                          )}

                          {/* Tags */}
                          {deal.tags && deal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {deal.tags.map((t, idx) => (
                                <span key={idx} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer: User, Date & Action Menu */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                            {/* Assigned User */}
                            <div className="flex items-center gap-1.5">
                              {assignedUser && (
                                <img
                                  src={assignedUser.avatarUrl}
                                  alt={assignedUser.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                  title={`Responsável: ${assignedUser.name}`}
                                />
                              )}
                              {deal.expectedCloseDate && (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(deal.expectedCloseDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {contactChat && (
                                <button
                                  onClick={() => {
                                    setActiveChatId(contactChat.id);
                                    setCurrentView('whatsapp');
                                  }}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition"
                                  title="Conversar no WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEditingDeal(deal);
                                  setIsDealModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                                title="Editar Oportunidade"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Excluir oportunidade "${deal.title}"?`)) {
                                    deleteDeal(deal.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal Modals */}
      {isDealModalOpen && (
        <DealModal
          deal={editingDeal}
          pipelineId={activePipelineId}
          onClose={() => {
            setIsDealModalOpen(false);
            setEditingDeal(null);
          }}
        />
      )}

      {lostDealToConfirm && (
        <LostReasonModal
          dealId={lostDealToConfirm.dealId}
          stageId={lostDealToConfirm.stageId}
          onClose={() => setLostDealToConfirm(null)}
        />
      )}

      {isPipelineManagerOpen && (
        <PipelineManagerModal onClose={() => setIsPipelineManagerOpen(false)} />
      )}
    </div>
  );
};
