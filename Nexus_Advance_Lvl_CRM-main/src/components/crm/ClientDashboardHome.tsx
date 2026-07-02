'use client';

import { useEffect, useState } from 'react';

interface Summary {
  projects: Array<{ _id: string; title: string; status: string; dueDate: string }>;
  pendingTasks: number;
  completedTasks: number;
  notifications: Array<{ _id: string; title: string; message: string; createdAt: string }>;
  recentActivities: Array<{ _id: string; description: string; timestamp: string }>;
}

export function ClientDashboardHome() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to load dashboard');
        setLoading(false);
        return;
      }
      setData(json);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[var(--text-secondary)]">Track your projects and tasks in real time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Assigned Projects</p>
          <p className="text-2xl font-semibold mt-1">{data?.projects?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Pending Tasks</p>
          <p className="text-2xl font-semibold mt-1">{data?.pendingTasks ?? 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Completed Tasks</p>
          <p className="text-2xl font-semibold mt-1">{data?.completedTasks ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Assigned Projects</h2>
          {data?.projects?.length ? (
            <ul className="space-y-2">
              {data.projects.map((project) => (
                <li key={project._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-[var(--text-muted)] capitalize">
                    {project.status} • due {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No projects assigned yet.</p>
          )}
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          {data?.notifications?.length ? (
            <ul className="space-y-2">
              {data.notifications.map((note) => (
                <li key={note._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{note.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
