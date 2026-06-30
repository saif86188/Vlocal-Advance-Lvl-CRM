'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ClientUser {
  _id: string;
  name: string;
  email: string;
}

interface ProjectItem {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  clientId: string;
  dueDate: string;
  phases: Array<{ progressPercent: number }>;
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    clientId: '',
    description: '',
    status: 'pending',
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    progress: 0,
  });

  const load = async () => {
    setLoading(true);
    const [projectsRes, usersRes] = await Promise.all([
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/auth/me', { cache: 'no-store' }),
    ]);
    const projectsJson = await projectsRes.json();
    if (projectsRes.ok) setProjects(projectsJson.items ?? []);

    if (usersRes.ok) {
      const usersList = await fetch('/api/clients?page=1&pageSize=100', { cache: 'no-store' });
      const usersJson = await usersList.json();
      if (usersList.ok) {
        setClients((usersJson.items ?? []).map((c: any) => ({ _id: c.userId, name: c.contactName, email: c.email })));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to create project');
      return;
    }
    toast.success('Project created');
    setForm({ ...form, title: '', description: '' });
    await load();
  };

  const updateStatus = async (id: string, status: ProjectItem['status']) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to update project');
      return;
    }
    toast.success('Project updated');
    await load();
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Delete project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to delete project');
      return;
    }
    toast.success('Project deleted');
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Project Management</h1>
      <form onSubmit={createProject} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 rounded-xl border border-[var(--border-default)] bg-white">
        <input className="vlocal-input" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select className="vlocal-input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
          <option value="">Select client</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
        <select className="vlocal-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
        <input className="vlocal-input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="datetime-local" className="vlocal-input" value={form.dueDate.slice(0, 16)} onChange={(e) => setForm({ ...form, dueDate: new Date(e.target.value).toISOString() })} />
        <button className="vlocal-btn bg-neutral-900 text-white md:col-span-3">Create Project</button>
      </form>

      <div className="rounded-xl border border-[var(--border-default)] bg-white overflow-x-auto">
        {loading ? (
          <p className="p-4 text-sm">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="p-4 text-sm text-[var(--text-muted)]">No projects yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-subtle)]">
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-[var(--border-subtle)]">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">
                    <select className="vlocal-input h-8" value={p.status} onChange={(e) => updateStatus(p._id, e.target.value as any)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td className="p-3">{p.phases?.[0]?.progressPercent ?? 0}%</td>
                  <td className="p-3">
                    <button className="text-xs underline text-red-600" onClick={() => deleteProject(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
