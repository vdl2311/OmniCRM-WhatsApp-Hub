import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { KanbanView } from './components/kanban/KanbanView';
import { WhatsAppInboxView } from './components/whatsapp/WhatsAppInboxView';
import { TasksView } from './components/tasks/TasksView';
import { AutomationsView } from './components/automations/AutomationsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { UsersView } from './components/users/UsersView';
import { SettingsView } from './components/settings/SettingsView';
import { ProposalView } from './components/proposal/ProposalView';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header Bar */}
        <Header />

        {/* Dynamic View Mount */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'contacts' && <ContactsView />}
          {currentView === 'kanban' && <KanbanView />}
          {currentView === 'whatsapp' && <WhatsAppInboxView />}
          {currentView === 'tasks' && <TasksView />}
          {currentView === 'automations' && <AutomationsView />}
          {(currentView === 'reports' || (currentView as string) === 'analytics') && <AnalyticsView />}
          {currentView === 'users' && <UsersView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'proposal' && <ProposalView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
