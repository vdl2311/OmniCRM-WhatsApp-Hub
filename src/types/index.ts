export type ContactType = 'lead' | 'client' | 'company' | 'vendor';

export type ContactStatus = 'ativo' | 'inativo' | 'aguardando' | 'ganho' | 'perdido';

export type LeadSource = 
  | 'WhatsApp Direto' 
  | 'Instagram' 
  | 'Site Orgânico' 
  | 'Google Ads' 
  | 'Facebook Ads' 
  | 'Indicação' 
  | 'Evento' 
  | 'Outro';

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  phone: string;
  whatsapp: string;
  email: string;
  companyName?: string;
  role?: string;
  source: LeadSource;
  assignedToId: string;
  tags: string[];
  status: ContactStatus;
  notes: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastInteractionAt: string;
  customFields?: Record<string, string>;
}

export type DealStatus = 'open' | 'won' | 'lost';

export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  isWon?: boolean;
  isLost?: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  stages: Stage[];
}

export interface MovementHistory {
  id: string;
  fromStageId?: string;
  toStageId: string;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  pipelineId: string;
  stageId: string;
  value: number;
  assignedToId: string;
  expectedCloseDate?: string;
  lostReason?: string;
  status: DealStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history?: MovementHistory[];
}

export type MessageSender = 'contact' | 'agent' | 'system' | 'bot';

export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'internal_note';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: MessageSender;
  senderName?: string;
  agentId?: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
  audioDurationSeconds?: number;
  timestamp: string;
  status: MessageStatus;
  isInternalNote?: boolean;
}

export type ChatStatus = 'unassigned' | 'open' | 'pending' | 'resolved' | 'closed';

export interface WhatsAppChat {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  assignedToId?: string;
  assignedToName?: string;
  status: ChatStatus;
  tags: string[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastMessageTimestamp: string;
  lastMessageSender?: MessageSender;
  channel: 'whatsapp_official' | 'evolution_api' | 'web_chat';
  startedAt: string;
  resolvedAt?: string;
}

export interface QuickReply {
  id: string;
  shortcut: string; // e.g. "/oi", "/preco"
  title: string;
  category: string;
  content: string;
  usageCount?: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  content?: string;
  body?: string;
  headerType?: string;
  headerText?: string;
  footer?: string;
  buttons?: Array<{ type: string; text: string; value?: string }>;
  status?: string;
}

export type MessageTemplate = WhatsAppTemplate;

export type WorkflowTrigger = 
  | 'lead_created' 
  | 'deal_stage_changed' 
  | 'message_received' 
  | 'deal_won'
  | 'LEAD_CREATED'
  | 'DEAL_STAGE_CHANGED'
  | 'CHAT_UNANSWERED'
  | 'TAG_ADDED'
  | 'CHAT_RESOLVED'
  | { type: string; params?: any };

export type WorkflowAction = 
  | 'send_whatsapp_message' 
  | 'create_task' 
  | 'assign_agent' 
  | 'add_tag' 
  | 'change_deal_stage'
  | 'SEND_WHATSAPP_TEMPLATE'
  | 'ASSIGN_AGENT_ROUND_ROBIN'
  | 'ASSIGN_SPECIFIC_AGENT'
  | 'CREATE_TASK'
  | 'MOVE_DEAL_STAGE'
  | 'ADD_TAG'
  | 'NOTIFY_TEAM';

export interface WorkflowRule {
  id: string;
  title?: string;
  name?: string;
  description: string;
  trigger: WorkflowTrigger;
  action?: WorkflowAction;
  actions?: Array<{ type: WorkflowAction; params?: any }>;
  isActive: boolean;
  executionCount?: number;
  lastExecutedAt?: string;
  actionPayload?: {
    messageTemplate?: string;
    taskTitle?: string;
    targetStageId?: string;
    tagToAdd?: string;
    priority?: TaskPriority;
    [key: string]: any;
  };
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskType = 'call' | 'whatsapp' | 'meeting' | 'email' | 'proposal' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type?: TaskType;
  priority: TaskPriority;
  dueDate: string; // ISO string YYYY-MM-DD
  dueTime?: string;
  completed: boolean;
  completedAt?: string;
  assignedToId: string;
  contactId?: string;
  dealId?: string;
  createdAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'agent' | 'support';

export interface UserPermissions {
  canViewAllContacts: boolean;
  canViewAllChats: boolean;
  canExportData?: boolean;
  canManageAutomations?: boolean;
  canDeleteRecords?: boolean;
  canCreateContacts?: boolean;
  canEditContacts?: boolean;
  canDeleteContacts?: boolean;
  canExportContacts?: boolean;
  canTransferChats?: boolean;
  canManageDeals?: boolean;
  canViewReports?: boolean;
  canManageUsers?: boolean;
  canChangeSettings?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department?: string;
  status?: 'online' | 'busy' | 'offline';
  isOnline?: boolean;
  activeChatsCount?: number;
  phone?: string;
  permissions: UserPermissions;
}

export interface TimelineEvent {
  id: string;
  contactId: string;
  type: 'message' | 'call' | 'stage_change' | 'note' | 'task_completed' | 'assignment' | 'proposal';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'chat' | 'lead' | 'deal' | 'task' | 'system';
  timestamp: string;
  read: boolean;
  linkTo?: { view: string; id?: string };
}
