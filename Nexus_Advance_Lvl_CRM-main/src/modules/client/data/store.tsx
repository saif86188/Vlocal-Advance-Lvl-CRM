'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  mockRequirements, mockProposals, mockProjects,
  mockPayments, mockDiscussions, mockTickets
} from './mock';
import { Requirement, Proposal, Project, Payment, Discussion, EscalationTicket } from './models';

const CLIENT_REQ_KEY = 'vlocal_client_requirements';
const ADMIN_PROPOSALS_KEY = 'vlocal_admin_proposals';

interface ClientProfile {
  name: string;
  company: string;
  email: string;
  avatar: string;
  phone: string;
  industry: string;
  address: string;
  joinedAt: string;
}

interface ClientSettings {
  language: string;
  currency: string;
  timezone: string;
  marketingEmails: boolean;
  projectUpdates: boolean;
  billingAlerts: boolean;
}

interface ClientNotification {
  id: string;
  type: 'project' | 'payment' | 'proposal' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ClientState {
  requirements: Requirement[];
  proposals: Proposal[];
  projects: Project[];
  payments: Payment[];
  discussions: Discussion[];
  tickets: EscalationTicket[];
  profile: ClientProfile;
  settings: ClientSettings;
  notifications: ClientNotification[];
}

type Action =
  | { type: 'ADD_REQUIREMENT'; payload: Requirement }
  | { type: 'UPDATE_PROPOSAL'; payload: { id: string; updates: Partial<Proposal> } }
  | { type: 'APPROVE_PROPOSAL'; payload: { proposalId: string } }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; updates: Partial<Payment> } }
  | { type: 'ADD_DISCUSSION_MESSAGE'; payload: { discussionId: string; message: any } }
  | { type: 'ADD_TICKET'; payload: EscalationTicket }
  | { type: 'REPLY_TICKET'; payload: { ticketId: string; message: any } }
  | { type: 'LOAD_ADMIN_PROPOSALS'; payload: Proposal[] }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ClientProfile> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ClientSettings> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_READ' };

function getInitialState(): ClientState {
  // Load admin proposals from localStorage
  let adminProposals: Proposal[] = [];
  try {
    const stored = localStorage.getItem(ADMIN_PROPOSALS_KEY);
    if (stored) adminProposals = JSON.parse(stored);
  } catch {}

  const allProposals = [...mockProposals];
  adminProposals.forEach(p => {
    if (!allProposals.find(e => e.id === p.id)) allProposals.unshift(p);
  });

  return {
    requirements: mockRequirements,
    proposals: allProposals,
    projects: mockProjects,
    payments: mockPayments,
    discussions: mockDiscussions,
    tickets: mockTickets,
    profile: {
      name: 'saif',
      company: 'Vlocal Corp',
      email: 'saif@vlocal.com',
      avatar: 'S',
      phone: '+1 (555) 000-1234',
      industry: 'Technology',
      address: 'San Francisco, CA',
      joinedAt: '2025-02-15T10:00:00Z'
    },
    settings: {
      language: 'English',
      currency: 'USD',
      timezone: 'UTC-8',
      marketingEmails: false,
      projectUpdates: true,
      billingAlerts: true
    },
    notifications: [
      { id: 'cn-1', type: 'proposal', title: 'New Proposal Received', message: 'A new strategy for Project Nova v2 is ready for review.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, priority: 'high' },
      { id: 'cn-2', type: 'project', title: 'Milestone Completed', message: 'The Design phase for Q2 Launch has been marked as complete.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: false, priority: 'medium' },
      { id: 'cn-3', type: 'payment', title: 'Payment Confirmed', message: 'We have received your payment for Invoice INV-003.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true, priority: 'low' },
    ]
  };
}

function reducer(state: ClientState, action: Action): ClientState {
  switch (action.type) {
    case 'ADD_REQUIREMENT': {
      const newReqs = [action.payload, ...state.requirements];
      // Write to localStorage for admin to see
      try {
        localStorage.setItem(CLIENT_REQ_KEY, JSON.stringify(newReqs));
      } catch {}
      return { ...state, requirements: newReqs };
    }
    case 'LOAD_ADMIN_PROPOSALS': {
      const existing = state.proposals.map(p => p.id);
      const newOnes = action.payload.filter(p => !existing.includes(p.id));
      return { ...state, proposals: [...newOnes, ...state.proposals] };
    }
    case 'UPDATE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'APPROVE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map(p =>
          p.id === action.payload.proposalId
            ? { ...p, status: 'approved', approvedAt: new Date().toISOString() }
            : p
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
            ? { ...d, messages: [...d.messages, action.payload.message] }
            : d
        ),
      };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'REPLY_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.payload.ticketId
            ? { ...t, thread: [...t.thread, action.payload.message] }
            : t
        ),
      };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
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
    default:
      return state;
  }
}

const ClientStoreContext = createContext<{ state: ClientState; dispatch: React.Dispatch<Action> } | null>(null);

export function ClientStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Poll for admin proposals every 3s
  useEffect(() => {
    const poll = setInterval(() => {
      try {
        const stored = localStorage.getItem(ADMIN_PROPOSALS_KEY);
        if (stored) {
          const proposals: Proposal[] = JSON.parse(stored);
          dispatch({ type: 'LOAD_ADMIN_PROPOSALS', payload: proposals });
        }
      } catch {}
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  return (
    <ClientStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientStoreContext.Provider>
  );
}

export function useClientStore() {
  const ctx = useContext(ClientStoreContext);
  if (!ctx) throw new Error('useClientStore must be used within ClientStoreProvider');
  return ctx;
}
