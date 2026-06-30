'use client';

import { useEffect, useState } from 'react';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function ClientNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok) setItems(json.items ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="rounded-xl border border-[var(--border-default)] bg-white p-4">
        {loading ? (
          <p className="text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No notifications.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item._id} className="border-b border-[var(--border-subtle)] pb-2 last:border-b-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.message}</p>
                <p className="text-xs text-[var(--text-muted)]">{new Date(item.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
