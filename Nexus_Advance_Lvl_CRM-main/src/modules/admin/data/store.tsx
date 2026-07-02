'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  mockUsers, mockRequirements, mockProposals, mockProjects,
  mockPayments, mockDiscussions, mockTickets
} from './mock';
import { Requirement, Proposal, Project, Payment, Discussion, EscalationTicket } from './models';

export const mockTeamMembers = [
  { id: 't-1', name: 'Arjun Mehta', role: 'Lead', email: 'arjun@vlocal.com', activeProjects: 3, avatar: 'AM', color: 'var(--accent)' },
  { id: 't-2', name: 'Priya Shah', role: 'Designer', email: 'priya@vlocal.com', activeProjects: 2, avatar: 'PS', color: 'var(--info)' },
  { id: 't-3', name: 'Rahul Verma', role: 'Developer', email: 'rahul@vlocal.com', activeProjects: 4, avatar: 'RV', color: 'var(--success)' },
  { id: 't-4', name: 'Kavya Nair', role: 'QA', email: 'kavya@vlocal.com', activeProjects: 1, avatar: 'KN', color: 'var(--warning)' },
];

export type TeamMember = typeof mockTeamMembers[0];

interface Notification {
  id: string;
  type: 'system' | 'security' | 'business' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  link?: string;
}

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
  location: string;
  bio: string;
  joinedAt: string;
}

interface CoreSettings {
  workspaceName: string;
  maintenanceMode: boolean;
  twoFactorAuth: boolean;
  auditLogging: boolean;
  themeColor: string;
  autoBackup: boolean;
  apiCache: boolean;
}

interface AdminState {
  requirements: Requirement[];
  proposals: Proposal[];
  projects: Project[];
  payments: Payment[];
  discussions: Discussion[];
  tickets: EscalationTicket[];
  teamMembers: TeamMember[];
  settings: CoreSettings;
  adminProfile: AdminProfile;
  notifications: Notification[];
}

type Action =
  | { type: 'ADD_REQUIREMENT'; payload: Requirement }
  | { type: 'UPDATE_REQUIREMENT'; payload: { id: string; updates: Partial<Requirement> } }
  | { type: 'ADD_PROPOSAL'; payload: Proposal }
  | { type: 'UPDATE_PROPOSAL'; payload: { id: string; updates: Partial<Proposal> } }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; updates: Partial<Payment> } }
  | { type: 'ADD_DISCUSSION_MESSAGE'; payload: { discussionId: string; message: any } }
  | { type: 'REPLY_TICKET'; payload: { ticketId: string; message: any } }
  | { type: 'MARK_MILESTONE_DONE'; payload: { projectId: string; milestoneId: string } }
  | { type: 'ADD_DELIVERABLE'; payload: { projectId: string; deliverable: any } }
  | { type: 'LOAD_CLIENT_REQUIREMENTS'; payload: Requirement[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<CoreSettings> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<AdminProfile> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' };

const ADMIN_STORAGE_KEY = 'vlocal_admin_state';
const CLIENT_REQ_KEY = 'vlocal_client_requirements';
const ADMIN_PROPOSALS_KEY = 'vlocal_admin_proposals';

function getInitialState(): AdminState {
  // Load any requirements submitted by client
  let clientReqs: Requirement[] = [];
  try {
    const stored = localStorage.getItem(CLIENT_REQ_KEY);
    if (stored) clientReqs = JSON.parse(stored);
  } catch {}

  const allReqs = [...mockRequirements];
  clientReqs.forEach(r => {
    if (!allReqs.find(e => e.id === r.id)) allReqs.push(r);
  });

  return {
    requirements: allReqs,
    proposals: mockProposals,
    projects: mockProjects,
    payments: mockPayments,
    discussions: mockDiscussions,
    tickets: [
      ...mockTickets,
      {
        id: 'tic-2',
        clientId: 'u-2',
        subject: 'Invoice INV-002 not received',
        description: 'We have not received the invoice for the Design milestone yet.',
        priority: 'low' as const,
        status: 'resolved' as const,
        createdAt: '2025-05-18T10:00:00Z',
        resolvedAt: '2025-05-18T11:30:00Z',
        thread: [
          { id: 'tt1', senderId: 'u-2', senderRole: 'client', content: 'We have not received the invoice for the Design milestone.', timestamp: '2025-05-18T10:00:00Z' },
          { id: 'tt2', senderId: 'a-1', senderRole: 'admin', content: 'Apologies! We\'ve resent it now. Please check your email.', timestamp: '2025-05-18T11:30:00Z' },
        ]
      }
    ],
    teamMembers: mockTeamMembers,
    settings: {
      workspaceName: 'Vlocal Core Enterprise',
      maintenanceMode: false,
      twoFactorAuth: true,
      auditLogging: true,
      themeColor: '#FBC13A',
      autoBackup: true,
      apiCache: true,
    },
    adminProfile: {
      name: 'saif',
      email: 'saif@vlocal.com',
      role: 'Global Administrator',
      avatar: 'S',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      bio: 'Leading the digital transformation and node orchestration for the Vlocal Core ecosystem.',
      joinedAt: '2025-01-12T08:00:00Z'
    },
    notifications: [
      { id: 'n-1', type: 'system', title: 'Node Migration Successful', message: 'Intelligence Node AX-1 has successfully migrated to the Mumbai cluster.', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), read: false, priority: 'medium' },
      { id: 'n-2', type: 'payment', title: 'Invoice Paid', message: 'Apex Corp has cleared Invoice INV-004 for the Design milestone.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false, priority: 'high' },
      { id: 'n-3', type: 'security', title: 'Unusual Login Blocked', message: 'A login attempt from an unrecognized IP (192.168.1.1) was automatically blocked.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true, priority: 'high' },
      { id: 'n-4', type: 'business', title: 'New Requirement Submitted', message: 'Nova Tech has submitted a new campaign requirement for Q3 Social Media.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true, priority: 'medium' },
    ]
  };
}

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case 'LOAD_CLIENT_REQUIREMENTS': {
      const existing = state.requirements.map(r => r.id);
      const newOnes = action.payload.filter(r => !existing.includes(r.id));
      return { ...state, requirements: [...state.requirements, ...newOnes] };
    }
    case 'ADD_REQUIREMENT':
      return { ...state, requirements: [action.payload, ...state.requirements] };
    case 'UPDATE_REQUIREMENT':
      return {
        ...state,
        requirements: state.requirements.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
      };
    case 'ADD_PROPOSAL': {
      const newProposals = [action.payload, ...state.proposals];
      // Write to localStorage for client to pick up
      try {
        const existing = JSON.parse(localStorage.getItem(ADMIN_PROPOSALS_KEY) || '[]');
        localStorage.setItem(ADMIN_PROPOSALS_KEY, JSON.stringify([action.payload, ...existing]));
      } catch {}
      return { ...state, proposals: newProposals };
    }
    case 'UPDATE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'ADD_DISCUSSION_MESSAGE':
      return {
        ...state,
        discussions: state.discussions.map(d =>
          d.id === action.payload.discussionId
            ? { ...d, messages: [...d.messages, action.payload.message], unreads: 0 }
            : d
        ),
      };
    case 'REPLY_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.payload.ticketId
            ? { ...t, thread: [...t.thread, action.payload.message], status: 'in_progress' as const }
            : t
        ),
      };
    case 'MARK_MILESTONE_DONE':
      return {
        ...state,
        projects: state.projects.map(p => {
          if (p.id !== action.payload.projectId) return p;
          return {
            ...p,
            milestoneChecklist: p.milestoneChecklist.map(m =>
              m.id === action.payload.milestoneId
                ? { ...m, completedAt: new Date().toISOString() }
                : m
            ),
          };
        }),
      };
    case 'ADD_DELIVERABLE':
      return {
        ...state,
        projects: state.projects.map(p => {
          if (p.id !== action.payload.projectId) return p;
          return { ...p, deliverables: [...p.deliverables, action.payload.deliverable] };
        }),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        adminProfile: { ...state.adminProfile, ...action.payload }
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n)
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
}

const AdminStoreContext = createContext<{ state: AdminState; dispatch: React.Dispatch<Action> } | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Poll for new client requirements every 3s
  useEffect(() => {
    const poll = setInterval(() => {
      try {
        const stored = localStorage.getItem(CLIENT_REQ_KEY);
        if (stored) {
          const reqs: Requirement[] = JSON.parse(stored);
          dispatch({ type: 'LOAD_CLIENT_REQUIREMENTS', payload: reqs });
        }
      } catch {}
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  return (
    <AdminStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used within AdminStoreProvider');
  return ctx;
}
