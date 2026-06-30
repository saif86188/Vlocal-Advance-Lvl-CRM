'use client';

import { useEffect, useState } from 'react';

interface ActivityItem {
  _id: string;
  action: string;
  description: string;
  timestamp: string;
}

export function AdminActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch('/api/activities', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to load activities');
        setLoading(false);
        return;
      }
      setItems(json.items ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-sm">Loading activity log...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Activity Log</h1>
      <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((activity) => (
              <li key={activity._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {activity.action} • {new Date(activity.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
