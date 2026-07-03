'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  Play, DollarSign, Target, Clock, AlertCircle, CheckCircle2, 
  User as UserIcon, Calendar, ArrowUpRight, Plus, Eye, ChevronDown, CheckSquare, Square
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
  startDate: string;
  progress: number;
  description?: string;
  phases?: Array<{ phase: string; progressPercent: number; status: string; dateRange: string }>;
}

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  description?: string;
}

interface Ticket {
  _id: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface TaskItem {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface ClientProfile {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  industry?: string;
  notes?: string;
}

interface DashboardSummary {
  clientProfile: ClientProfile;
  projects: Project[];
  pendingTasks: number;
  completedTasks: number;
  notifications: Array<{ _id: string; title: string; message: string; type: string; createdAt: string }>;
  recentActivities: Array<{ _id: string; description: string; timestamp: string }>;
  stats: {
    campaigns: number;
    proposals: number;
    openTickets: number;
  };
  campaigns: Campaign[];
  payments: Payment[];
  tickets: Ticket[];
  taskList: TaskItem[];
}

export function ClientDashboardHome() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Failed to load dashboard');
        setLoading(false);
        return;
      }
      setData(json.data);
      setLoading(false);
    } catch {
      setError('Unable to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Failed to update task');
        setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
        return;
      }
      toast.success(nextStatus === 'completed' ? 'Task marked complete!' : 'Task active');
      load();
    } catch {
      toast.error('Network error updating task');
      setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-neutral-200 rounded-2xl"></div>
          <div className="h-28 bg-neutral-200 rounded-2xl"></div>
          <div className="h-28 bg-neutral-200 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 h-96 bg-neutral-200 rounded-3xl"></div>
          <div className="lg:col-span-3 h-96 bg-neutral-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-neutral-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h3 className="text-lg font-bold text-neutral-800">Dashboard Error</h3>
        <p className="text-sm text-neutral-500 mt-1">{error}</p>
        <button onClick={load} className="vlocal-btn bg-neutral-900 text-white mt-4">Retry</button>
      </div>
    );
  }

  const activeProject = data?.projects?.find(p => p.status === 'in-progress') || data?.projects?.[0];
  
  // Calculate Progress Values
  const activePhaseProgress = activeProject?.phases?.find(ph => ph.status === 'in-progress')?.progressPercent ?? activeProject?.progress ?? 0;
  
  const totalBudget = activeProject ? 120000 : 0;
  const budgetUsed = data?.payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const budgetUsedPercent = totalBudget > 0 ? Math.min(Math.round((budgetUsed / totalBudget) * 100), 100) : 0;

  // Project Time calculation
  let projectTimePercent = 0;
  let daysLeft = 0;
  if (activeProject) {
    const start = new Date(activeProject.startDate).getTime();
    const end = new Date(activeProject.dueDate).getTime();
    const now = Date.now();
    const totalDuration = end - start;
    if (totalDuration > 0) {
      projectTimePercent = Math.min(Math.round(((now - start) / totalDuration) * 100), 100);
      projectTimePercent = Math.max(projectTimePercent, 0);
    }
    daysLeft = Math.max(Math.ceil((end - now) / (1000 * 60 * 60 * 24)), 0);
  }

  const outputPercent = activeProject?.progress ?? 0;
  const isProjectOnTrack = daysLeft > 0 || !activeProject;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {data?.clientProfile.name}!</h1>
          <p className="text-sm text-neutral-500 font-medium">Nexus CRM Workspace • Live Updates</p>
        </div>
        <div className="flex gap-2">
          <Link href="/client/billing" className="vlocal-btn vlocal-btn-sm border border-neutral-300 hover:bg-neutral-100 bg-white font-semibold transition">
            View Invoices
          </Link>
          <Link href="/client/support" className="vlocal-btn vlocal-btn-sm bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition">
            Submit Request
          </Link>
        </div>
      </div>

      {/* Top Stat Strip Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Campaigns</span>
            <h3 className="text-2xl font-extrabold">{data?.stats.campaigns ?? 0} Live</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Play size={18} className="fill-current" />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Proposals</span>
            <h3 className="text-2xl font-extrabold">{data?.stats.proposals ?? 0} Awaiting</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Target size={18} />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Open Tickets</span>
            <h3 className="text-2xl font-extrabold">{data?.stats.openTickets ?? 0} Active</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle size={18} />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Client Profile & Accordion */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-neutral-200 overflow-hidden relative mb-3">
              <img 
                src={`https://avatar.iran.liara.run/public/boy?username=${data?.clientProfile.name}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h4 className="font-extrabold text-neutral-800">{data?.clientProfile.name}</h4>
            <p className="text-xs text-neutral-400 font-medium mb-2">{data?.clientProfile.companyName || 'Nexus Industries'}</p>
            
            <div className="flex flex-wrap gap-1.5 justify-center mt-2 mb-6">
              <span className="px-2.5 py-1 text-[10px] font-bold bg-neutral-900 text-white rounded-full">
                PREMIUM
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-full">
                Active Budget
              </span>
            </div>

            {/* Collapsible Accordion details */}
            <div className="w-full text-left space-y-2">
              <details className="group border border-neutral-100 rounded-xl bg-neutral-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3 text-xs font-bold text-neutral-700 cursor-pointer select-none">
                  <span>My Projects</span>
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 pt-0 text-xs text-neutral-500 space-y-1.5 border-t border-neutral-100 bg-white">
                  {data?.projects?.slice(0, 3).map(p => (
                    <div key={p._id} className="flex justify-between">
                      <span className="truncate max-w-[120px]">{p.title}</span>
                      <span className="capitalize text-neutral-900 font-medium">{p.status}</span>
                    </div>
                  ))}
                </div>
              </details>

              <details className="group border border-neutral-100 rounded-xl bg-neutral-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3 text-xs font-bold text-neutral-700 cursor-pointer select-none">
                  <span>Payment Summary</span>
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 pt-0 text-xs text-neutral-500 space-y-1.5 border-t border-neutral-100 bg-white">
                  <div className="flex justify-between">
                    <span>Paid to Date:</span>
                    <span className="font-bold text-neutral-900">₹{budgetUsed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding:</span>
                    <span className="font-bold text-red-600">₹{(data?.payments?.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0) ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </details>

              <details className="group border border-neutral-100 rounded-xl bg-neutral-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3 text-xs font-bold text-neutral-700 cursor-pointer select-none">
                  <span>Support Tickets</span>
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 pt-0 text-xs text-neutral-500 space-y-1.5 border-t border-neutral-100 bg-white">
                  {data?.tickets?.slice(0, 3).map(t => (
                    <div key={t._id} className="flex justify-between">
                      <span className="truncate max-w-[120px]">{t.subject}</span>
                      <span className="capitalize text-neutral-900 font-medium">{t.status}</span>
                    </div>
                  ))}
                </div>
              </details>

              <details className="group border border-neutral-100 rounded-xl bg-neutral-50/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3 text-xs font-bold text-neutral-700 cursor-pointer select-none">
                  <span>My Services</span>
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 pt-0 text-xs text-neutral-500 space-y-1.5 border-t border-neutral-100 bg-white">
                  <div className="flex justify-between">
                    <span>CRM Implementation</span>
                    <span className="text-[var(--accent)] font-bold">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand Strategy</span>
                    <span className="text-[var(--accent)] font-bold">✓</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Analytics & Widget Panels */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Progress Indicators & Deliverables Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* SVG Delivery Countdown Ring & Health Status */}
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-sm font-bold text-neutral-700 mb-4">Project Timeline Health</h4>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-neutral-100" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="54" 
                    className="stroke-[var(--accent)]" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={339.29}
                    strokeDashoffset={339.29 - (339.29 * projectTimePercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-neutral-800">{daysLeft}</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">days left</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isProjectOnTrack ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isProjectOnTrack ? 'On Track' : 'At Risk'}
                </span>
              </div>
            </div>

            {/* 4 Horizontal Progress Bars */}
            <div className="glass-card p-6 md:col-span-2 space-y-5">
              <h4 className="text-sm font-bold text-neutral-700 mb-1">CRM Core Health Index</h4>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>Active Phase Progress</span>
                    <span>{activePhaseProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activePhaseProgress}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>Budget Consumed</span>
                    <span>{budgetUsedPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${budgetUsedPercent}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>Project Duration Elapsed</span>
                    <span>{projectTimePercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${projectTimePercent}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>Outputs & Deliverables Complete</span>
                    <span>{outputPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${outputPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Campaign Phase timeline & Weekly Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campaign progress card */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-sm font-bold text-neutral-700">Campaign Timeline Progress</h4>
              
              {data?.campaigns?.length ? (
                <div className="space-y-6 mt-4">
                  {data.campaigns.slice(0, 1).map(c => (
                    <div key={c._id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-neutral-800">{c.name}</span>
                        <span className="text-xs font-bold text-neutral-500">{c.progress}% complete</span>
                      </div>
                      
                      <div className="relative flex justify-between items-center w-full px-2">
                        {/* Connecting Line */}
                        <div className="absolute h-0.5 bg-neutral-200 left-4 right-4 top-1/2 -translate-y-1/2 -z-10" />
                        <div 
                          className="absolute h-0.5 bg-emerald-500 left-4 top-1/2 -translate-y-1/2 -z-10 transition-all duration-500" 
                          style={{ width: `calc(${c.progress}% - 32px)` }} 
                        />

                        {/* Dot 1 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                            c.progress >= 20 ? 'border-emerald-500 text-emerald-500' : 'border-neutral-300 text-neutral-400'
                          }`}>
                            <div className="w-2.5 h-2.5 rounded-full bg-current" />
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 mt-1">Setup</span>
                        </div>

                        {/* Dot 2 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                            c.progress >= 50 ? 'border-emerald-500 text-emerald-500' : 'border-neutral-300 text-neutral-400'
                          }`}>
                            <div className="w-2.5 h-2.5 rounded-full bg-current" />
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 mt-1">Launch</span>
                        </div>

                        {/* Dot 3 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                            c.progress >= 90 ? 'border-emerald-500 text-emerald-500' : 'border-neutral-300 text-neutral-400'
                          }`}>
                            <div className="w-2.5 h-2.5 rounded-full bg-current" />
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 mt-1">Optimization</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                  <Play size={24} className="stroke-1 mb-2" />
                  <span className="text-xs">No campaigns configured yet.</span>
                </div>
              )}
            </div>

            {/* Weekly calendar widget */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-sm font-bold text-neutral-700">Weekly Activity Calendar</h4>
              
              <div className="grid grid-cols-7 gap-1 mt-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-50 transition cursor-pointer">
                    <span className="text-[10px] font-bold text-neutral-400">{day}</span>
                    <span className={`text-xs font-extrabold mt-1 w-6 h-6 flex items-center justify-center rounded-full ${
                      idx === 4 ? 'bg-[var(--accent)] text-neutral-900' : 'text-neutral-700'
                    }`}>
                      {29 + idx}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                <div className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-800 truncate">CRM Delivery Deadline</p>
                    <p className="text-[9px] font-semibold text-neutral-400">Friday, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Pending Actions & Notifications list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pending actions checklist card */}
            <div className="dark-card p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white">Pending Action Checklist</h4>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black">
                  {data?.taskList?.filter(t => checkedTasks[t._id] || t.status === 'completed').length ?? 0}/{data?.taskList?.length ?? 0}
                </span>
              </div>

              {data?.taskList?.length ? (
                <div className="space-y-3 flex-1">
                  {data.taskList.map(task => {
                    const isChecked = checkedTasks[task._id] || task.status === 'completed';
                    return (
                      <div 
                        key={task._id} 
                        onClick={() => handleTaskToggle(task._id, task.status)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isChecked ? (
                            <CheckCircle2 size={16} className="text-[var(--accent)]" />
                          ) : (
                            <Square size={16} className="text-neutral-400" />
                          )}
                          <span className={`text-xs text-white truncate ${isChecked ? 'line-through opacity-50' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-neutral-500/20 text-neutral-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white/40 flex-1">
                  <CheckSquare size={24} className="stroke-1 mb-2" />
                  <span className="text-xs">No pending actions left!</span>
                </div>
              )}
            </div>

            {/* Notifications panel */}
            <div className="glass-card p-6 flex flex-col h-full">
              <h4 className="text-sm font-bold text-neutral-700 mb-4">Workspace Notifications</h4>
              
              {data?.notifications?.length ? (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px]">
                  {data.notifications.map(note => (
                    <div key={note._id} className="p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-800">{note.title}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          note.type === 'success' ? 'bg-emerald-500' : note.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">{note.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400 flex-1">
                  <AlertCircle size={24} className="stroke-1 mb-2" />
                  <span className="text-xs">No new notifications.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
