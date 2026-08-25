import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageSquare,
  Zap,
  CheckSquare,
  ShieldAlert,
  BarChart3,
  Settings,
  FileText,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    chats,
    tasks,
    currentUser,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const unreadChats = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const navItems: Array<{
    id: AppView;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    requiresPermission?: keyof typeof currentUser.permissions;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'whatsapp', label: 'WhatsApp Inbox', icon: MessageSquare, badge: unreadChats > 0 ? unreadChats : undefined, badgeColor: 'bg-emerald-500 text-white' },
    { id: 'kanban', label: 'Funil de Vendas', icon: Kanban },
    { id: 'contacts', label: 'Contatos & Leads', icon: Users },
    { id: 'tasks', label: 'Tarefas & Follow-up', icon: CheckSquare, badge: pendingTasks > 0 ? pendingTasks : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'automations', label: 'Automações & Bot', icon: Zap },
    { id: 'reports', label: 'Relatórios & KPIs', icon: BarChart3, requiresPermission: 'canViewReports' },
    { id: 'users', label: 'Usuários & Perfis', icon: ShieldAlert, requiresPermission: 'canManageUsers' },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'proposal', label: 'Proposta Técnica', icon: FileText, badge: 'Completa', badgeColor: 'bg-blue-100 text-blue-700' },
  ];

  const handleNavClick = (id: AppView) => {
    setCurrentView(id);
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <MessageCircle className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none text-base">
              Omni<span className="text-emerald-400">CRM</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              WhatsApp & Sales Hub
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Módulos do Sistema
        </div>

        {navItems.map((item) => {
          // Check permission if specified
          if (item.requiresPermission && !currentUser.permissions[item.requiresPermission] && currentUser.role !== 'admin') {
            return null;
          }

          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400 font-semibold shadow-xs border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick WhatsApp API indicator footer */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Meta WhatsApp API</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Ativo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Webhook v20.0 conectado e roteando mensagens.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* 2. Mobile & Tablet Slide-over Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex h-full max-w-xs shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
