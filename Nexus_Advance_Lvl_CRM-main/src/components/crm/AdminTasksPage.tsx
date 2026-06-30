'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TaskItem {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  clientId: string;
}

interface ProjectItem {
  _id: string;
  title: string;
  clientId: string;
}

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    projectId: '',
    clientId: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  const load = async () => {
    setLoading(true);
    const [taskRes, projectRes] = await Promise.all([
      fetch('/api/tasks', { cache: 'no-store' }),
      fetch('/api/projects', { cache: 'no-store' }),
    ]);
    const taskJson = await taskRes.json();
    const projectJson = await projectRes.json();
    if (taskRes.ok) setTasks(taskJson.items ?? []);
    if (projectRes.ok) setProjects(projectJson.items ?? []);
    setLoading(false);
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
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to create task');
      return;
    }
    toast.success('Task created');
    setForm({ ...form, title: '', dueDate: '' });
    await load();
  };

  const updateStatus = async (id: string, status: TaskItem['status']) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to update task');
      return;
    }
    toast.success('Task updated');
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Task Management</h1>
      <form onSubmit={createTask} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 rounded-xl border border-[var(--border-default)] bg-white">
        <input className="vlocal-input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select
          className="vlocal-input"
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
        <select className="vlocal-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="datetime-local" className="vlocal-input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <button className="vlocal-btn bg-neutral-900 text-white md:col-span-2">Create Task</button>
      </form>

      <div className="rounded-xl border border-[var(--border-default)] bg-white overflow-x-auto">
        {loading ? (
          <p className="p-4 text-sm">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="p-4 text-sm text-[var(--text-muted)]">No tasks yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-subtle)]">
                <th className="p-3">Task</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id} className="border-b border-[var(--border-subtle)]">
                  <td className="p-3">{t.title}</td>
                  <td className="p-3 capitalize">{t.priority}</td>
                  <td className="p-3">
                    <select className="vlocal-input h-8" value={t.status} onChange={(e) => updateStatus(t._id, e.target.value as any)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
