import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact,
  Deal,
  Pipeline,
  User,
  WhatsAppChat,
  ChatMessage,
  QuickReply,
  MessageTemplate,
  WorkflowRule,
  Task,
  TimelineEvent,
  AuditLog,
  NotificationItem,
  MovementHistory,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CONTACTS,
  INITIAL_PIPELINES,
  INITIAL_DEALS,
  INITIAL_WHATSAPP_CHATS,
  INITIAL_MESSAGES,
  INITIAL_QUICK_REPLIES,
  INITIAL_TEMPLATES,
  INITIAL_WORKFLOWS,
  INITIAL_TASKS,
  INITIAL_TIMELINE,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

export type AppView = 
  | 'dashboard' 
  | 'contacts' 
  | 'kanban' 
  | 'whatsapp' 
  | 'automations' 
  | 'tasks' 
  | 'users' 
  | 'reports' 
  | 'settings' 
  | 'proposal';

interface WhatsAppConfig {
  provider: 'official' | 'evolution' | 'mock';
  officialWabaId: string;
  officialPhoneId: string;
  officialAccessToken: string;
  officialVerifyToken: string;
  evolutionServerUrl: string;
  evolutionInstance: string;
  evolutionApiKey: string;
  webhookUrl: string;
  autoDistributeEnabled: boolean;
  distributionType: 'round_robin' | 'least_busy';
  isConnected: boolean;
}

interface AppContextType {
  // Navigation & User
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  updateUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (userId: string) => void;

  // Contacts
  contacts: Contact[];
  selectedContactId: string | null;
  setSelectedContactId: (id: string | null) => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  importContacts: (newContacts: Array<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>>) => { imported: number; duplicates: number };
  mergeContacts: (targetId: string, sourceId: string) => void;

  // Pipelines & Deals
  pipelines: Pipeline[];
  activePipelineId: string;
  setActivePipelineId: (id: string) => void;
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  moveDealStage: (dealId: string, targetStageId: string, lostReason?: string) => void;
  deleteDeal: (id: string) => void;
  addPipeline: (pipeline: Omit<Pipeline, 'id'>) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;

  // WhatsApp & Chats
  chats: WhatsAppChat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (chatId: string, content: string, type?: ChatMessage['type'], extra?: Partial<ChatMessage>) => void;
  transferChat: (chatId: string, targetUserId: string, reason?: string) => void;
  updateChatStatus: (chatId: string, status: WhatsAppChat['status']) => void;
  updateChatTags: (chatId: string, tags: string[]) => void;
  simulateIncomingMessage: (phone: string, text: string, contactName?: string) => void;

  // Automations & Templates
  quickReplies: QuickReply[];
  addQuickReply: (qr: Omit<QuickReply, 'id' | 'usageCount'>) => void;
  updateQuickReply: (id: string, updates: Partial<QuickReply>) => void;
  deleteQuickReply: (id: string) => void;
  templates: MessageTemplate[];
  addTemplate: (tpl: Omit<MessageTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  workflows: WorkflowRule[];
  toggleWorkflow: (id: string) => void;
  addWorkflow: (wf: Omit<WorkflowRule, 'id' | 'executionCount'>) => void;
  updateWorkflow: (id: string, updates: Partial<WorkflowRule>) => void;
  deleteWorkflow: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskComplete: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Timeline & Audit Logs & Notifications
  timeline: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Config
  whatsAppConfig: WhatsAppConfig;
  updateWhatsAppConfig: (updates: Partial<WhatsAppConfig>) => void;

  // Quick Action Modal helpers
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isDealModalOpen: boolean;
  setIsDealModalOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isSimulatorModalOpen: boolean;
  setIsSimulatorModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('omnicrm_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // Pipelines & Deals
  const [pipelines, setPipelines] = useState<Pipeline[]>(() => {
    const saved = localStorage.getItem('omnicrm_pipelines');
    return saved ? JSON.parse(saved) : INITIAL_PIPELINES;
  });
  const [activePipelineId, setActivePipelineId] = useState<string>('pipe-1');
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('omnicrm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  // WhatsApp
  const [chats, setChats] = useState<WhatsAppChat[]>(() => {
    const saved = localStorage.getItem('omnicrm_chats');
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_CHATS;
  });
  const [activeChatId, setActiveChatId] = useState<string | null>('chat-1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('omnicrm_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Automations & Content
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(INITIAL_QUICK_REPLIES);
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(INITIAL_WORKFLOWS);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('omnicrm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Logs & Notifications
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Nova Oportunidade em Negociação',
      message: 'Lucas Ferreira moveu TechSolar para Negociação (R$ 18.500)',
      type: 'deal',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Mensagem Não Atribuída',
      message: 'Fernanda Nogueira enviou uma nova mensagem no WhatsApp',
      type: 'chat',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: false,
    }
  ]);

  // WhatsApp Integration Config
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>({
    provider: 'official',
    officialWabaId: 'waba_994182941029',
    officialPhoneId: 'phone_102983719283',
    officialAccessToken: 'EAAG98273619283_META_CLOUD_API_PROD',
    officialVerifyToken: 'omnicrm_secure_webhook_token_2026',
    evolutionServerUrl: 'https://api.whatsapp-hub.cloud',
    evolutionInstance: 'omni_comercial_instancia_01',
    evolutionApiKey: 'evo_998127391823901823',
    webhookUrl: 'https://omnicrm.app.br/api/whatsapp/webhook',
    autoDistributeEnabled: true,
    distributionType: 'round_robin',
    isConnected: true,
  });

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('omnicrm_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('omnicrm_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('omnicrm_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('omnicrm_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('omnicrm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Helper to log audit
  const logAudit = (action: string, entity: string, entityId: string | undefined, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      entityId,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper to trigger automated actions
  const triggerAutomations = (triggerType: any, data: any) => {
    workflows.forEach(wf => {
      const wfTriggerType = typeof wf.trigger === 'string' ? wf.trigger : (wf.trigger as any)?.type;
      if (!wf.isActive || wfTriggerType !== triggerType) return;

      // Check specific conditions
      if (triggerType === 'DEAL_STAGE_CHANGED' && wf.trigger.params?.stageId && wf.trigger.params.stageId !== data.targetStageId) {
        return;
      }

      // Execute actions
      wf.actions.forEach(action => {
        if (action.type === 'CREATE_TASK' && action.params?.taskTitle) {
          const dueHours = action.params.taskDueHours || 24;
          const due = new Date(Date.now() + dueHours * 3600 * 1000);
          const newTask: Task = {
            id: `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            title: `[Automação: ${wf.name}] ${action.params.taskTitle}`,
            type: 'whatsapp',
            priority: 'high',
            dueDate: due.toISOString().split('T')[0],
            dueTime: '10:00',
            completed: false,
            assignedToId: data.assignedToId || currentUser.id,
            contactId: data.contactId,
            dealId: data.dealId,
            createdAt: new Date().toISOString(),
          };
          setTasks(prev => [newTask, ...prev]);
        }

        if (action.type === 'NOTIFY_TEAM') {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `Automação: ${wf.name}`,
            message: action.params?.notificationMessage || 'Evento acionado pelo sistema',
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false,
          };
          setNotifications(prev => [newNotif, ...prev]);
          sounds.playNotification();
        }

        if (action.type === 'SEND_WHATSAPP_TEMPLATE' && action.params?.templateId && data.contactId) {
          const tpl = templates.find(t => t.id === action.params?.templateId);
          if (tpl) {
            const contact = contacts.find(c => c.id === data.contactId);
            let content = tpl.body
              .replace(/{{nome}}/g, contact?.name || 'Cliente')
              .replace(/{{empresa}}/g, contact?.companyName || 'Sua Empresa')
              .replace(/{{atendente}}/g, currentUser.name);

            // Find or create chat
            const existingChat = chats.find(ch => ch.contactId === data.contactId);
            if (existingChat) {
              sendMessage(existingChat.id, content, 'text');
            }
          }
        }
      });

      // Update execution count
      setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, executionCount: w.executionCount + 1, lastExecutedAt: new Date().toISOString() } : w));
    });
  };

  // Contacts Handlers
  const addContact = (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>) => {
    const id = `cont-${Date.now()}`;
    const now = new Date().toISOString();
    const newContact: Contact = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      lastInteractionAt: now,
    };
    setContacts(prev => [newContact, ...prev]);
    logAudit('CONTATO_CRIADO', 'Contact', id, `Cadastrou o contato ${newContact.name}`);
    
    // Add timeline event
    addTimelineEvent({
      contactId: id,
      type: 'note',
      title: 'Contato Criado',
      description: `Contato cadastrado por ${currentUser.name} (${newContact.source})`,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    // Trigger automations
    triggerAutomations('LEAD_CREATED', { contactId: id, assignedToId: newContact.assignedToId });

    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    logAudit('CONTATO_EDITADO', 'Contact', id, `Atualizou informações do contato`);
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    logAudit('CONTATO_EXCLUIDO', 'Contact', id, `Excluiu o contato ${contact?.name || id}`);
  };

  const importContacts = (newItems: Array<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>>) => {
    let imported = 0;
    let duplicates = 0;
    const now = new Date().toISOString();
    const created: Contact[] = [];

    newItems.forEach(item => {
      const isDup = contacts.some(c => c.phone.replace(/\D/g, '') === item.phone.replace(/\D/g, '') || (item.email && c.email.toLowerCase() === item.email.toLowerCase()));
      if (isDup) {
        duplicates++;
      } else {
        const newContact: Contact = {
          ...item,
          id: `cont-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          createdAt: now,
          updatedAt: now,
          lastInteractionAt: now,
        };
        created.push(newContact);
        imported++;
      }
    });

    if (created.length > 0) {
      setContacts(prev => [...created, ...prev]);
      logAudit('IMPORTACAO_CONTATOS', 'Contact', undefined, `Importou ${imported} contatos (${duplicates} duplicados ignorados)`);
    }

    return { imported, duplicates };
  };

  const mergeContacts = (targetId: string, sourceId: string) => {
    const target = contacts.find(c => c.id === targetId);
    const source = contacts.find(c => c.id === sourceId);
    if (!target || !source) return;

    // Merge tags & notes
    const mergedTags = Array.from(new Set([...target.tags, ...source.tags]));
    const mergedNotes = `${target.notes}\n[Mesclado de ${source.name}]: ${source.notes}`;

    updateContact(targetId, {
      tags: mergedTags,
      notes: mergedNotes,
      email: target.email || source.email,
      companyName: target.companyName || source.companyName,
    });

    // Reassign deals and chats
    setDeals(prev => prev.map(d => d.contactId === sourceId ? { ...d, contactId: targetId } : d));
    setChats(prev => prev.map(ch => ch.contactId === sourceId ? { ...ch, contactId: targetId } : ch));

    // Delete source
    deleteContact(sourceId);
    logAudit('CONTATO_MESCLADO', 'Contact', targetId, `Mesclou contato ${source.name} em ${target.name}`);
  };

  // Pipeline & Deals
  const addDeal = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const id = `deal-${Date.now()}`;
    const now = new Date().toISOString();
    const newDeal: Deal = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `h-${Date.now()}`,
          toStageId: data.stageId,
          timestamp: now,
          userId: currentUser.id,
          userName: currentUser.name,
          notes: 'Oportunidade criada',
        }
      ]
    };
    setDeals(prev => [newDeal, ...prev]);
    logAudit('OPORTUNIDADE_CRIADA', 'Deal', id, `Criou oportunidade "${newDeal.title}" no valor de R$ ${newDeal.value.toLocaleString('pt-BR')}`);
    
    // Add timeline
    addTimelineEvent({
      contactId: data.contactId,
      type: 'stage_change',
      title: 'Nova Oportunidade Criada',
      description: `"${newDeal.title}" - R$ ${newDeal.value.toLocaleString('pt-BR')}`,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    logAudit('OPORTUNIDADE_EDITADA', 'Deal', id, `Atualizou dados da oportunidade`);
  };

  const moveDealStage = (dealId: string, targetStageId: string, lostReason?: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const pipeline = pipelines.find(p => p.id === deal.pipelineId) || pipelines[0];
    const targetStage = pipeline.stages.find(s => s.id === targetStageId);
    if (!targetStage) return;

    const isWon = targetStage.isWon || targetStage.name.toLowerCase().includes('ganho') || targetStage.name.toLowerCase().includes('venda realizada');
    const isLost = targetStage.isLost || targetStage.name.toLowerCase().includes('perdido') || targetStage.name.toLowerCase().includes('desistência');

    let status: Deal['status'] = 'open';
    if (isWon) {
      status = 'won';
      sounds.playWin();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (isLost) {
      status = 'lost';
    }

    const now = new Date().toISOString();
    const newMovement: MovementHistory = {
      id: `h-${Date.now()}`,
      fromStageId: deal.stageId,
      toStageId: targetStageId,
      timestamp: now,
      userId: currentUser.id,
      userName: currentUser.name,
      notes: lostReason ? `Motivo de perda: ${lostReason}` : undefined,
    };

    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        stageId: targetStageId,
        status,
        lostReason: lostReason || d.lostReason,
        updatedAt: now,
        history: [...d.history, newMovement],
      };
    }));

    logAudit('FUNIL_STAGE_UPDATE', 'Deal', dealId, `Moveu "${deal.title}" para etapa "${targetStage.name}" (${status.toUpperCase()})`);

    // Timeline event
    addTimelineEvent({
      contactId: deal.contactId,
      type: 'stage_change',
      title: isWon ? '🎉 Venda Realizada!' : isLost ? '❌ Oportunidade Perdida' : `Etapa Alterada: ${targetStage.name}`,
      description: `Oportunidade "${deal.title}" movida para ${targetStage.name}${lostReason ? ` (${lostReason})` : ''}`,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    // Trigger automations
    triggerAutomations('DEAL_STAGE_CHANGED', { dealId, targetStageId, contactId: deal.contactId, assignedToId: deal.assignedToId });
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    logAudit('OPORTUNIDADE_EXCLUIDA', 'Deal', id, 'Excluiu oportunidade comercial');
  };

  const addPipeline = (pipe: Omit<Pipeline, 'id'>) => {
    const id = `pipe-${Date.now()}`;
    setPipelines(prev => [...prev, { ...pipe, id }]);
  };

  const updatePipeline = (id: string, updates: Partial<Pipeline>) => {
    setPipelines(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // WhatsApp Messaging
  const sendMessage = (chatId: string, content: string, type: ChatMessage['type'] = 'text', extra: Partial<ChatMessage> = {}) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const isNote = type === 'internal_note' || extra.isInternalNote;
    const now = new Date().toISOString();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      chatId,
      sender: isNote ? 'system' : 'agent',
      senderName: currentUser.name,
      agentId: currentUser.id,
      type,
      content,
      timestamp: now,
      status: 'sent',
      isInternalNote: isNote,
      ...extra,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    if (!isNote) {
      sounds.playSent();

      // Update chat last message
      setChats(prev => prev.map(c => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          lastMessage: type === 'image' ? '📷 Imagem' : type === 'audio' ? '🎵 Áudio' : type === 'document' ? '📄 Documento' : content,
          lastMessageType: type,
          lastMessageTimestamp: now,
          lastMessageSender: 'agent',
          status: c.status === 'unassigned' ? 'open' : c.status,
          assignedToId: c.assignedToId || currentUser.id,
          assignedToName: c.assignedToName || currentUser.name,
        };
      }));

      // Simulate delivery & read ticks
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || []).map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m),
        }));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || []).map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m),
        }));
      }, 2500);

      logAudit('MENSAGEM_ENVIADA', 'WhatsAppChat', chatId, `Enviou mensagem para ${chat.contactName}`);
    } else {
      logAudit('NOTA_INTERNA_CRIADA', 'WhatsAppChat', chatId, `Criou nota interna na conversa de ${chat.contactName}`);
    }

    // Add to timeline
    addTimelineEvent({
      contactId: chat.contactId,
      type: isNote ? 'note' : 'message',
      title: isNote ? 'Nota Interna Adicionada' : 'Mensagem WhatsApp Enviada',
      description: content.substring(0, 100),
      userId: currentUser.id,
      userName: currentUser.name,
    });
  };

  const transferChat = (chatId: string, targetUserId: string, reason?: string) => {
    const targetUser = users.find(u => u.id === targetUserId);
    const chat = chats.find(c => c.id === chatId);
    if (!targetUser || !chat) return;

    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        assignedToId: targetUser.id,
        assignedToName: targetUser.name,
      };
    }));

    // Add internal transfer log message
    const transferMsg: ChatMessage = {
      id: `msg-trans-${Date.now()}`,
      chatId,
      sender: 'system',
      type: 'internal_note',
      content: `Atendimento transferido de ${currentUser.name} para ${targetUser.name}${reason ? `. Motivo: ${reason}` : ''}`,
      timestamp: new Date().toISOString(),
      status: 'read',
      isInternalNote: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), transferMsg],
    }));

    // Notification for target user
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Atendimento Transferido para Você',
        message: `${currentUser.name} transferiu o cliente ${chat.contactName} para você.`,
        type: 'chat',
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev
    ]);

    sounds.playNotification();
    logAudit('ATENDIMENTO_TRANSFERIDO', 'WhatsAppChat', chatId, `Transferiu conversa para ${targetUser.name}`);
  };

  const updateChatStatus = (chatId: string, status: WhatsAppChat['status']) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, status, resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : undefined } : c));
    logAudit('CHAT_STATUS_UPDATE', 'WhatsAppChat', chatId, `Atualizou status da conversa para ${status.toUpperCase()}`);
  };

  const updateChatTags = (chatId: string, tags: string[]) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, tags } : c));
  };

  const simulateIncomingMessage = (phone: string, text: string, contactName?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let contact = contacts.find(c => c.phone.replace(/\D/g, '') === cleanPhone || c.whatsapp.replace(/\D/g, '') === cleanPhone);

    const now = new Date().toISOString();

    // Auto-create contact if not exists
    if (!contact) {
      contact = addContact({
        name: contactName || `Lead WhatsApp (${phone.slice(-4)})`,
        type: 'lead',
        phone: phone,
        whatsapp: cleanPhone,
        email: '',
        source: 'WhatsApp Direto',
        assignedToId: currentUser.id,
        tags: ['Lead WhatsApp', 'Novo'],
        status: 'ativo',
        notes: 'Contato criado automaticamente a partir de mensagem no WhatsApp.',
      });
    }

    // Find or create chat
    let chat = chats.find(c => c.contactId === contact!.id);
    let chatId = chat?.id;

    if (!chat) {
      chatId = `chat-${Date.now()}`;
      const newChat: WhatsAppChat = {
        id: chatId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactAvatar: contact.avatarUrl,
        assignedToId: whatsAppConfig.autoDistributeEnabled ? currentUser.id : undefined,
        assignedToName: whatsAppConfig.autoDistributeEnabled ? currentUser.name : undefined,
        status: whatsAppConfig.autoDistributeEnabled ? 'open' : 'unassigned',
        tags: contact.tags,
        unreadCount: 1,
        lastMessage: text,
        lastMessageType: 'text',
        lastMessageTimestamp: now,
        lastMessageSender: 'contact',
        channel: whatsAppConfig.provider === 'official' ? 'whatsapp_official' : 'evolution_api',
        startedAt: now,
      };
      setChats(prev => [newChat, ...prev]);
    } else {
      setChats(prev => prev.map(c => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          unreadCount: c.unreadCount + 1,
          lastMessage: text,
          lastMessageType: 'text',
          lastMessageTimestamp: now,
          lastMessageSender: 'contact',
          status: c.status === 'resolved' || c.status === 'closed' ? 'open' : c.status,
        };
      }));
    }

    // Add message
    const newMsg: ChatMessage = {
      id: `msg-in-${Date.now()}`,
      chatId: chatId!,
      sender: 'contact',
      type: 'text',
      content: text,
      timestamp: now,
      status: 'delivered',
    };

    setMessages(prev => ({
      ...prev,
      [chatId!]: [...(prev[chatId!] || []), newMsg],
    }));

    sounds.playIncoming();

    // In-app Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Nova mensagem de ${contact!.name}`,
        message: text,
        type: 'chat',
        timestamp: now,
        read: false,
      },
      ...prev
    ]);
  };

  // Automations & Content CRUD
  const addQuickReply = (qr: Omit<QuickReply, 'id' | 'usageCount'>) => {
    const id = `qr-${Date.now()}`;
    setQuickReplies(prev => [...prev, { ...qr, id, usageCount: 0 }]);
  };

  const updateQuickReply = (id: string, updates: Partial<QuickReply>) => {
    setQuickReplies(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuickReply = (id: string) => {
    setQuickReplies(prev => prev.filter(q => q.id !== id));
  };

  const addTemplate = (tpl: Omit<MessageTemplate, 'id'>) => {
    const id = `tpl-${Date.now()}`;
    setTemplates(prev => [...prev, { ...tpl, id }]);
  };

  const updateTemplate = (id: string, updates: Partial<MessageTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const addWorkflow = (wf: Omit<WorkflowRule, 'id' | 'executionCount'>) => {
    const id = `wf-${Date.now()}`;
    setWorkflows(prev => [...prev, { ...wf, id, executionCount: 0 }]);
  };

  const updateWorkflow = (id: string, updates: Partial<WorkflowRule>) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  // Tasks CRUD
  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const id = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...data,
      id,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    logAudit('TAREFA_CRIADA', 'Task', id, `Criou tarefa "${newTask.title}"`);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isNowDone = !t.completed;
      if (isNowDone) sounds.playWin();
      return {
        ...t,
        completed: isNowDone,
        completedAt: isNowDone ? new Date().toISOString() : undefined,
      };
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Users CRUD
  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const id = `usr-${Date.now()}`;
    const newUser: User = { ...userData, id };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Timeline & Notifications
  const addTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateWhatsAppConfig = (updates: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig(prev => ({ ...prev, ...updates }));
    logAudit('CONFIG_WHATSAPP_UPDATE', 'Settings', undefined, 'Atualizou configurações de conexão com WhatsApp');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        users,
        updateUser,
        addUser,
        deleteUser,
        contacts,
        selectedContactId,
        setSelectedContactId,
        addContact,
        updateContact,
        deleteContact,
        importContacts,
        mergeContacts,
        pipelines,
        activePipelineId,
        setActivePipelineId,
        deals,
        addDeal,
        updateDeal,
        moveDealStage,
        deleteDeal,
        addPipeline,
        updatePipeline,
        chats,
        activeChatId,
        setActiveChatId,
        messages,
        sendMessage,
        transferChat,
        updateChatStatus,
        updateChatTags,
        simulateIncomingMessage,
        quickReplies,
        addQuickReply,
        updateQuickReply,
        deleteQuickReply,
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        workflows,
        toggleWorkflow,
        addWorkflow,
        updateWorkflow,
        deleteWorkflow,
        tasks,
        addTask,
        toggleTaskComplete,
        updateTask,
        deleteTask,
        timeline,
        addTimelineEvent,
        auditLogs,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        whatsAppConfig,
        updateWhatsAppConfig,
        isContactModalOpen,
        setIsContactModalOpen,
        isDealModalOpen,
        setIsDealModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isSimulatorModalOpen,
        setIsSimulatorModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
