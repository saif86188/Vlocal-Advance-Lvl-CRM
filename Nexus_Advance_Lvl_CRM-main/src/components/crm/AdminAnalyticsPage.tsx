'use client';

import { useEffect, useState } from 'react';

export function AdminAnalyticsPage() {
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok) setSummary(json.summary);
    };
    load();
  }, []);

  const totalRevenuePlaceholder = summary.completedProjects * 25000;
  const clientGrowthPlaceholder = Math.min(summary.totalClients * 8, 100);
  const activeProjectsPercent =
    summary.totalProjects > 0 ? Math.round((summary.activeProjects / summary.totalProjects) * 100) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Total Revenue (placeholder)</p>
          <p className="text-2xl font-semibold mt-1">₹{totalRevenuePlaceholder.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Active Projects Chart</p>
          <div className="mt-3 h-3 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${activeProjectsPercent}%` }} />
          </div>
          <p className="text-sm mt-2">{activeProjectsPercent}% active</p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--text-muted)]">Client Growth Chart</p>
          <div className="mt-3 h-3 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-emerald-600" style={{ width: `${clientGrowthPlaceholder}%` }} />
          </div>
          <p className="text-sm mt-2">{clientGrowthPlaceholder}% growth index</p>
        </div>
      </div>
    </div>
  );
}
