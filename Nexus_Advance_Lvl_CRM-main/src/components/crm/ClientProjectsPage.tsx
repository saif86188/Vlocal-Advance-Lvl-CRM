'use client';

import { useEffect, useState } from 'react';

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: string;
  phases?: Array<{ progressPercent: number }>;
}

export function ClientProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to load projects');
        setLoading(false);
        return;
      }
      setItems(json.items ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-sm">Loading projects...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Projects</h1>
      {items.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 text-sm text-[var(--text-muted)]">
          No projects assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((project) => (
            <div key={project._id} className="rounded-xl border border-[var(--border-default)] bg-white p-4">
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{project.description || 'No description'}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2 capitalize">Status: {project.status}</p>
              <p className="text-xs text-[var(--text-muted)]">Deadline: {new Date(project.dueDate).toLocaleDateString()}</p>
              <p className="text-xs text-[var(--text-muted)]">
                Progress: {project.phases?.[0]?.progressPercent ?? 0}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
