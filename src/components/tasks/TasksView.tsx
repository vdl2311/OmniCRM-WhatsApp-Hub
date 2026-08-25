import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority } from '../../types';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  UserCheck,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  AlertTriangle,
} from 'lucide-react';
import { TaskModal } from './TaskModal';

export const TasksView: React.FC = () => {
  const {
    tasks,
    contacts,
    deals,
    users,
    toggleTaskComplete,
    deleteTask,
    isTaskModalOpen,
    setIsTaskModalOpen,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t => {
    // RBAC: If agent cannot view all contacts/deals, only show tasks assigned to currentUser
    if (currentUser.role === 'agent' && t.assignedToId !== currentUser.id) {
      return false;
    }

    if (statusFilter === 'pending' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assignedFilter !== 'all' && t.assignedToId !== assignedFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contact = contacts.find(c => c.id === t.contactId);
      const match =
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (contact && contact.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;

  return (
    <div className="p-3 sm:p-6 pb-20 md:pb-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>Gestão de Tarefas & Follow-ups</span>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-semibold">
              {pendingCount} pendentes
            </span>
            {overdueCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                {overdueCount} em atraso
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compromissos comerciais, reuniões, ligações e lembretes de follow-up com leads.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tarefa..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="pending">Apenas Pendentes</option>
            <option value="completed">Concluídas</option>
            <option value="all">Todas as Tarefas</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Prioridade: Todas</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>

          {/* Responsible Filter */}
          <select
            value={assignedFilter}
            onChange={e => setAssignedFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Responsável: Todos</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            Nenhuma tarefa encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredTasks.map(task => {
            const contact = contacts.find(c => c.id === task.contactId);
            const deal = deals.find(d => d.id === task.dealId);
            const assignedUser = users.find(u => u.id === task.assignedToId);
            const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

            return (
              <div
                key={task.id}
                className={`p-4 flex items-start justify-between gap-4 transition hover:bg-slate-50/80 ${
                  task.completed ? 'bg-slate-50/40 opacity-70' : isOverdue ? 'bg-rose-50/20' : ''
                }`}
              >
                {/* Checkbox and Main Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 text-emerald-600 hover:text-emerald-700 transition shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>

                      {/* Priority badge */}
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Overdue tag */}
                      {isOverdue && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-600 text-white rounded font-bold">
                          Atrasada
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        {task.dueTime && <span>às {task.dueTime}</span>}
                      </span>

                      {contact && (
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contact.name}</span>
                        </span>
                      )}

                      {deal && (
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{deal.title}</span>
                        </span>
                      )}

                      {assignedUser && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <img src={assignedUser.avatarUrl} alt={assignedUser.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{assignedUser.name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                    title="Editar Tarefa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Excluir tarefa "${task.title}"?`)) {
                        deleteTask(task.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Excluir Tarefa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
