'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  Briefcase, Calendar, Play, CheckCircle, Plus, Trash2, Edit2, 
  ChevronDown, X
} from 'lucide-react';
import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core';

interface ClientItem {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
}

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  clientId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  dueDate: string;
  progress: number;
}

const COLUMNS: { id: ProjectItem['status']; title: string; color: string }[] = [
  { id: 'pending', title: 'Pending / To Do', color: 'border-t-yellow-400' },
  { id: 'in-progress', title: 'In Progress', color: 'border-t-blue-400' },
  { id: 'completed', title: 'Completed', color: 'border-t-emerald-400' },
];

function DroppableColumn({ id, title, color, children }: { id: string; title: string; color: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col gap-4 p-4 rounded-3xl min-h-[500px] border-2 border-t-4 transition-colors ${color} ${
        isOver ? 'bg-neutral-100/70 border-dashed border-neutral-350' : 'bg-neutral-50/50 border-neutral-100'
      }`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">{title}</h3>
        <span className="px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-600 text-[10px] font-black">
          {React.Children.count(children)}
        </span>
      </div>
      <div className="flex-1 space-y-3">
        {children}
      </div>
    </div>
  );
}

function DraggableCard({ project, onDelete }: { project: ProjectItem; onDelete: (id: string, e: React.MouseEvent) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project._id,
    data: { status: project.status },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.6 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow relative group ${
        isDragging ? 'border-dashed border-[var(--accent)] shadow-none z-50' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-extrabold text-neutral-800 text-sm leading-snug">{project.title}</h4>
        <button 
          onClick={(e) => onDelete(project._id, e)}
          className="p-1 rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
      
      {project.description && (
        <p className="text-xs text-neutral-400 font-medium mt-1.5 line-clamp-2 leading-relaxed">{project.description}</p>
      )}

      <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
        <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-black">{project.progress}%</span>
      </div>
    </div>
  );
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    clientId: '',
    startDate: '',
    dueDate: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [projRes, clientRes] = await Promise.all([
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/clients?page=1&pageSize=100', { cache: 'no-store' }),
      ]);
      const projJson = await projRes.json();
      const clientJson = await clientRes.json();

      if (projRes.ok && projJson.success) setProjects(projJson.data.items ?? []);
      if (clientRes.ok && clientJson.success) {
        setClients((clientJson.data.items ?? []).map((c: any) => ({
          _id: c._id,
          companyName: c.companyName,
          contactName: c.contactName,
          email: c.email,
        })));
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error loading projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const projectId = active.id as string;
    const nextStatus = over.id as ProjectItem['status'];
    const activeData = active.data.current as { status: ProjectItem['status'] };

    if (activeData?.status === nextStatus) return;

    // Optimistic Update
    setProjects(prev => prev.map(p => p._id === projectId ? { ...p, status: nextStatus } : p));

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Failed to update status');
        load();
      } else {
        toast.success(`Project moved to ${nextStatus}`);
      }
    } catch {
      toast.error('Network error updating project');
      load();
    }
  };

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        dueDate: new Date(form.dueDate).toISOString(),
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to create project');
      return;
    }
    toast.success('Project created successfully');
    setShowCreate(false);
    setForm({ title: '', description: '', clientId: '', startDate: '', dueDate: '' });
    await load();
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Delete this project? All tasks will remain but will be unlinked.')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Unable to delete');
        return;
      }
      toast.success('Project deleted');
      await load();
    } catch {
      toast.error('Network error deleting project');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Projects Kanban</h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Drag cards to update deliverable statuses</p>
        </div>
        <button 
          className="CODEVATE-btn bg-[var(--accent)] text-neutral-900 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" 
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? 'Close Form' : 'Create Project'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createProject} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl border border-neutral-200 bg-white shadow-sm animate-in fade-in duration-300">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Project Title</label>
            <input className="CODEVATE-input w-full" placeholder="e.g. CRM Implementation" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Client / Company</label>
            <select className="CODEVATE-input w-full" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
              <option value="">Select corporate client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName} ({c.contactName})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Start Date</label>
            <input className="CODEVATE-input w-full" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Due Date</label>
            <input className="CODEVATE-input w-full" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Project Description</label>
            <textarea className="CODEVATE-input w-full h-20 py-2.5 resize-none" placeholder="Outline deliverables..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button className="CODEVATE-btn bg-neutral-900 text-white md:col-span-2 font-bold cursor-pointer">Start Project</button>
        </form>
      )}

      {loading ? (
        <p className="p-6 text-sm text-[var(--text-secondary)]">Loading project board...</p>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map((col) => (
              <DroppableColumn key={col.id} id={col.id} title={col.title} color={col.color}>
                {projects
                  .filter((p) => p.status === col.id)
                  .map((project) => (
                    <DraggableCard 
                      key={project._id} 
                      project={project} 
                      onDelete={deleteProject} 
                    />
                  ))}
              </DroppableColumn>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
