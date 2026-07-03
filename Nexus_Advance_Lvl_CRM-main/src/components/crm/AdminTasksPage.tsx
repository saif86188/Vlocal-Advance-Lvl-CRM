'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle2, Plus, Clock, User as UserIcon, Calendar, 
  AlertCircle, CheckSquare, Square, Search, Trash2
} from 'lucide-react';

interface TaskItem {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: { _id: string; title: string };
  clientId: string;
  assignedTo?: { _id: string; name: string; avatarUrl?: string; email: string };
}

interface ProjectItem {
  _id: string;
  title: string;
  clientId: string;
}

interface AssigneeItem {
  _id: string;
  name: string;
  email: string;
}

function getDueCountdown(dueDate?: string): { text: string; color: string } {
  if (!dueDate) return { text: 'No due date', color: 'text-neutral-400' };
  const diff = new Date(dueDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) {
    return { text: `Overdue by ${Math.abs(days)}d`, color: 'text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-100' };
  }
  if (days === 0) {
    return { text: 'Due today', color: 'text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100' };
  }
  if (days === 1) {
    return { text: 'Due tomorrow', color: 'text-yellow-500 font-bold bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100' };
  }
  return { text: `${days}d left`, color: 'text-neutral-500 font-bold bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100' };
}

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [assignees, setAssignees] = useState<AssigneeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    projectId: '',
    clientId: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: '',
    assignedTo: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [taskRes, projectRes, clientsRes] = await Promise.all([
        fetch('/api/tasks', { cache: 'no-store' }),
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/clients?page=1&pageSize=100', { cache: 'no-store' }),
      ]);
      
      const taskJson = await taskRes.json();
      const projectJson = await projectRes.json();
      const clientsJson = await clientsRes.json();

      if (taskRes.ok && taskJson.success) setTasks(taskJson.data.items ?? []);
      if (projectRes.ok && projectJson.success) setProjects(projectJson.data.items ?? []);
      if (clientsRes.ok && clientsJson.success) {
        setAssignees((clientsJson.data.items ?? []).map((c: any) => ({
          _id: c.userId,
          name: c.contactName,
          email: c.email,
        })));
      }
    } catch {
      toast.error('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to create task');
      return;
    }
    toast.success('Task created successfully');
    setForm({ ...form, title: '', dueDate: '', assignedTo: '' });
    await load();
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to update task');
      return;
    }
    toast.success(nextStatus === 'completed' ? 'Task completed!' : 'Task active');
    await load();
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('Delete task?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to delete task');
      return;
    }
    toast.success('Task deleted');
    await load();
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Tasks</h1>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Coordinate deliverables and checklists</p>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={createTask} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <input 
          className="vlocal-input w-full" 
          placeholder="Task title" 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          required 
        />
        
        <select
          className="vlocal-input w-full"
          value={form.projectId}
          onChange={(e) => {
            const selected = projects.find((p) => p._id === e.target.value);
            setForm({ ...form, projectId: e.target.value, clientId: selected?.clientId ?? '' });
          }}
          required
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <select 
          className="vlocal-input w-full" 
          value={form.priority} 
          onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          className="vlocal-input w-full"
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        >
          <option value="">Select assignee (optional)</option>
          {assignees.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <input 
          type="datetime-local" 
          className="vlocal-input w-full" 
          value={form.dueDate} 
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })} 
        />

        <button className="vlocal-btn bg-neutral-900 text-white font-bold cursor-pointer">
          Create Task
        </button>
      </form>

      {/* Tasks Table */}
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">Loading task boards...</p>
        ) : tasks.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">No tasks scheduled yet.</p>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="p-4 w-12 text-center">Status</th>
                <th className="p-4">Task Details</th>
                <th className="p-4">Project</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Assignee</th>
                <th className="p-4 w-12">Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const countdown = getDueCountdown(t.dueDate);
                return (
                  <tr key={t._id} className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => updateStatus(t._id, t.status)}
                        className="p-1 rounded-full text-neutral-400 hover:text-[var(--accent)] transition cursor-pointer"
                      >
                        {t.status === 'completed' ? (
                          <CheckSquare size={18} className="text-[var(--accent)] stroke-[2.5]" />
                        ) : (
                          <Square size={18} className="stroke-[2]" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`font-bold text-neutral-800 text-[13px] ${
                        t.status === 'completed' ? 'line-through text-neutral-400 font-medium' : ''
                      }`}>
                        {t.title}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-neutral-500">
                      {t.projectId?.title || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        t.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : t.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={countdown.color}>{countdown.text}</span>
                    </td>
                    <td className="p-4">
                      {t.assignedTo ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-150 flex items-center justify-center font-bold text-neutral-700 border border-neutral-200">
                            {t.assignedTo.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">{t.assignedTo.name}</p>
                            <p className="text-[9px] text-neutral-400 font-semibold">{t.assignedTo.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 font-medium italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteTask(t._id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
