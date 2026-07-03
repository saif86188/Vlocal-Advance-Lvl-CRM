'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircle2, PlusCircle, Trash2, Edit, User, Briefcase, 
  Settings, HelpCircle, Activity, Clock
} from 'lucide-react';

interface ActivityItem {
  _id: string;
  action: string;
  description: string;
  timestamp: string;
}

function getRelativeTime(timestamp: string): string {
  const now = new Date().getTime();
  const past = new Date(timestamp).getTime();
  const diffMs = now - past;
  if (diffMs < 0) return 'Just now';
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getActivityIcon(action: string) {
  const act = action.toUpperCase();
  if (act.includes('CREATE') || act.includes('ADD')) {
    return { icon: PlusCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  }
  if (act.includes('DELETE') || act.includes('REMOVE')) {
    return { icon: Trash2, color: 'bg-red-50 text-red-600 border-red-100' };
  }
  if (act.includes('UPDATE') || act.includes('EDIT') || act.includes('PATCH')) {
    return { icon: Edit, color: 'bg-blue-50 text-blue-600 border-blue-100' };
  }
  if (act.includes('CLIENT')) {
    return { icon: User, color: 'bg-purple-50 text-purple-600 border-purple-100' };
  }
  if (act.includes('PROJECT')) {
    return { icon: Briefcase, color: 'bg-amber-50 text-amber-600 border-amber-100' };
  }
  if (act.includes('TASK')) {
    return { icon: CheckCircle2, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
  }
  return { icon: Activity, color: 'bg-neutral-50 text-neutral-600 border-neutral-100' };
}

export function AdminActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/activities', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.message ?? 'Failed to load activities');
          setLoading(false);
          return;
        }
        setItems(json.data.items ?? []);
        setLoading(false);
      } catch {
        setError('Network error loading activities');
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) return <p className="text-sm text-red-600 font-semibold">{error}</p>;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Activity Log</h1>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Audit records for platform events</p>
      </div>

      <div className="glass-card p-6">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-12">No activity logged yet.</p>
        ) : (
          <div className="relative border-l border-neutral-100 pl-6 ml-4 space-y-6">
            {items.map((activity) => {
              const style = getActivityIcon(activity.action);
              const Icon = style.icon;
              return (
                <div key={activity._id} className="relative group animate-in fade-in duration-300">
                  {/* Timeline bullet icon */}
                  <div className={`absolute -left-[39px] top-0.5 p-2 rounded-xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${style.color}`}>
                    <Icon size={14} />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-neutral-800 leading-normal">{activity.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                      <span className="uppercase tracking-wider">{activity.action}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {getRelativeTime(activity.timestamp)} ({new Date(activity.timestamp).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
