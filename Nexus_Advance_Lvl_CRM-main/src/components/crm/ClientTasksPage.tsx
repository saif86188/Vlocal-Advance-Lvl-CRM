'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  ClipboardList, Calendar, AlertCircle, RefreshCw, 
  CheckCircle2, Clock, CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface TaskItem {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId?: { _id: string; title: string };
}

export function ClientTasksPage() {
  const [items, setItems] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.success) {
        setItems(json.data.items ?? []);
      }
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: TaskItem['status']) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Unable to update task');
        return;
      }
      toast.success('Task status updated');
      await load();
    } catch {
      toast.error('Network error updating task');
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-600 border-red-150';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-150';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-150';
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/50 pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Tasks</h1>
            <p className="text-xs text-neutral-500 font-medium">Verify checklist assignments and change project phases</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 py-6 animate-pulse">
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 glass-card rounded-[40px] border border-white shadow-xl max-w-xl mx-auto space-y-6 relative z-10">
          <div className="w-20 h-20 rounded-[28px] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-sm relative group">
            <ClipboardList size={36} className="text-neutral-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm animate-bounce">
              <CheckCircle size={12} />
            </div>
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="text-lg font-black text-neutral-800 tracking-tight uppercase">No pending tasks</h3>
            <p className="text-xs text-neutral-400 font-medium max-w-xs mx-auto leading-relaxed">
              Assignments will appear here as your project manager allocates active checkpoints.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 relative z-10">
          {items.map((task) => {
            const priorityClass = getPriorityStyle(task.priority);
            const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : null;

            return (
              <div 
                key={task._id} 
                className="glass-card p-5 md:p-6 rounded-[28px] border border-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-neutral-50 text-neutral-400 border border-neutral-150'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className={`font-bold text-[15px] leading-snug tracking-tight text-neutral-900 ${task.status === 'completed' ? 'line-through text-neutral-400' : ''}`}>
                      {task.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {task.projectId?.title && (
                        <>
                          <span className="text-neutral-500 font-bold">{task.projectId.title}</span>
                          <span>•</span>
                        </>
                      )}
                      {formattedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${priorityClass}`}>
                    {task.priority} Priority
                  </span>

                  <select 
                    className="CODEVATE-input h-10 px-3 bg-neutral-50 hover:bg-neutral-100 border-neutral-200 focus:bg-white rounded-xl font-bold cursor-pointer text-xs min-w-[130px] transition" 
                    value={task.status} 
                    onChange={(e) => updateStatus(task._id, e.target.value as any)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
