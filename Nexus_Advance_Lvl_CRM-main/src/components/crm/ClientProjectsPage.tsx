'use client';

import { useEffect, useState } from 'react';
import { 
  Briefcase, Calendar, CheckCircle2, Clock, 
  ArrowRight, AlertCircle, RefreshCw, BarChart2 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: string;
  phases?: Array<{ name: string; progressPercent: number; status: string }>;
}

export function ClientProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.message ?? 'Failed to load projects');
          return;
        }
        setItems(json.data.items ?? []);
      } catch {
        setError('Network error loading projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 py-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-neutral-200 rounded-3xl"></div>
          <div className="h-48 bg-neutral-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-md">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-neutral-800 tracking-tight">Sync Exception</h3>
          <p className="text-xs text-neutral-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Completed' };
      case 'in-progress':
      case 'in_progress':
      case 'active':
        return { bg: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Active' };
      default:
        return { bg: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Pending' };
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/50 pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Projects</h1>
            <p className="text-xs text-neutral-500 font-medium">Track your active campaign milestones and phase progress</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 glass-card rounded-[40px] border border-white shadow-xl max-w-xl mx-auto space-y-6 relative z-10">
          <div className="w-20 h-20 rounded-[28px] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-sm relative group">
            <Briefcase size={36} className="text-neutral-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm animate-bounce">
              <Calendar size={12} />
            </div>
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="text-lg font-black text-neutral-800 tracking-tight uppercase">No assigned projects</h3>
            <p className="text-xs text-neutral-400 font-medium max-w-xs mx-auto leading-relaxed">
              When a new marketing campaign or requirement proposal is approved, your projects will populate here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {items.map((project) => {
            const statusConfig = getStatusStyles(project.status);
            const currentPhase = project.phases?.[0];
            const progress = currentPhase?.progressPercent ?? 0;
            const formattedDate = new Date(project.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={project._id} 
                className="glass-card p-6 rounded-[32px] border border-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-extrabold text-neutral-900 leading-tight tracking-tight text-lg">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-3">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="h-px bg-neutral-100/80 my-3" />

                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      <span>Phase: {currentPhase?.name || 'Initiation'}</span>
                      <span className="text-neutral-900 font-mono">{progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-400" />
                    <span>Due: <span className="text-neutral-700 font-bold">{formattedDate}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition cursor-pointer">
                    <span>Details</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
