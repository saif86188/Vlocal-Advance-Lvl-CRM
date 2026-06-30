'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface SummaryResponse {
  summary: {
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingTasks: number;
  };
  recentActivities: Array<{ _id: string; action: string; description: string; timestamp: string }>;
  latestClients: Array<{ _id: string; name: string; email: string; company?: string; createdAt: string }>;
}

export function AdminDashboardHome() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? 'Failed to load dashboard');
          return;
        }
        setData(json);
      } catch {
        setError('Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Total Clients', value: data?.summary.totalClients ?? 0 },
      { label: 'Total Projects', value: data?.summary.totalProjects ?? 0 },
      { label: 'Active Projects', value: data?.summary.activeProjects ?? 0 },
      { label: 'Completed Projects', value: data?.summary.completedProjects ?? 0 },
      { label: 'Pending Tasks', value: data?.summary.pendingTasks ?? 0 },
    ],
    [data]
  );

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, Admin</h1>
          <p className="text-sm text-[var(--text-secondary)]">Your CRM command center</p>
        </div>
        <button
          className="vlocal-btn bg-[var(--accent)] text-neutral-900"
          onClick={() => toast.info('Use the navigation to manage clients, projects, and tasks')}
        >
          Quick Actions
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[var(--border-default)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{card.label}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
          {data?.recentActivities.length ? (
            <ul className="space-y-3">
              {data.recentActivities.map((activity) => (
                <li key={activity._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {activity.action} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Latest Registered Clients</h2>
          {data?.latestClients.length ? (
            <ul className="space-y-3">
              {data.latestClients.map((client) => (
                <li key={client._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{client.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No clients yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
