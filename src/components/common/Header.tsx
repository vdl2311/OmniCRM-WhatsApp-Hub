import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  MessageSquare,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  UserCheck,
  ChevronDown,
  Shield,
  Zap,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    setCurrentUser,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    whatsAppConfig,
    setIsContactModalOpen,
    setIsDealModalOpen,
    setIsTaskModalOpen,
    setIsSimulatorModalOpen,
    setCurrentView,
    chats,
    setIsMobileMenuOpen,
    isMobileMenuOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const unassignedChatsCount = chats.filter(c => c.status === 'unassigned').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg min-w-0">
        {/* Hamburger Menu on mobile/tablet */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="relative w-full max-w-xs sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
        </div>
      </div>

      {/* Center: Status badges (Desktop) */}
      <div className="hidden xl:flex items-center gap-3 shrink-0 mx-2">
        {/* WhatsApp Connection status pill */}
        <div
          onClick={() => setCurrentView('settings')}
          className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full cursor-pointer hover:bg-emerald-100/70 transition"
          title="WhatsApp Conectado e Operacional"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-800">
            WhatsApp {whatsAppConfig.provider === 'official' ? 'Cloud API' : 'Evolution'} Online
          </span>
        </div>

        {/* Unassigned queue alert pill */}
        {unassignedChatsCount > 0 && (
          <button
            onClick={() => setCurrentView('whatsapp')}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold hover:bg-amber-100 transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{unassignedChatsCount} na fila</span>
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Incoming WhatsApp Simulator */}
        <button
          onClick={() => setIsSimulatorModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-xs transition shrink-0"
          title="Simular mensagem recebida no WhatsApp"
        >
          <Zap className="w-4 h-4 text-emerald-200" />
          <span className="hidden sm:inline">Simulador</span>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-medium transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isQuickAddOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-xs"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Novo Contato / Lead
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setIsDealModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-xs"
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                Nova Oportunidade
              </button>
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setIsTaskModalOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Nova Tarefa
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="fixed sm:absolute top-16 sm:top-auto right-2 sm:right-0 mt-1 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Notificações</h4>
                  {unreadNotifs.length > 0 && (
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                      {unreadNotifs.length} novas
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Limpar todas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Nenhuma notificação no momento
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        notif.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-emerald-50/50 border-emerald-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Switcher (Simulating Multi-user RBAC) */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-xl transition"
            title="Alternar perfil de usuário"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 ring-2 ring-emerald-500/20"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                {currentUser.name}
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[100px]">
                {currentUser.department}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {isUserMenuOpen && (
            <div className="fixed sm:absolute top-16 sm:top-auto right-2 sm:right-0 mt-1 w-[calc(100vw-1rem)] sm:w-64 max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-sm animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Simular Perfil (RBAC)
                </p>
              </div>

              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition ${
                    currentUser.id === u.id ? 'bg-emerald-50/80 text-emerald-950 font-medium' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.department}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}

              <div className="mt-2 pt-2 border-t border-slate-100 px-3">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentView('users');
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Gerenciar Permissões da Equipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
