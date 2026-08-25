import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  Menu,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    chats,
    setIsMobileMenuOpen,
    isMobileMenuOpen,
  } = useApp();

  const unreadChats = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-inset-bottom">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* Dashboard */}
        <button
          onClick={() => {
            setCurrentView('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            currentView === 'dashboard'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium leading-none">Início</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => {
            setCurrentView('whatsapp');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl relative transition ${
            currentView === 'whatsapp'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadChats > 9 ? '9+' : unreadChats}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium leading-none">WhatsApp</span>
        </button>

        {/* Kanban / Funil */}
        <button
          onClick={() => {
            setCurrentView('kanban');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            currentView === 'kanban'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium leading-none">Funil</span>
        </button>

        {/* Contacts */}
        <button
          onClick={() => {
            setCurrentView('contacts');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            currentView === 'contacts'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium leading-none">Leads</span>
        </button>

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            isMobileMenuOpen
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium leading-none">Menu</span>
        </button>
      </div>
    </nav>
  );
};
