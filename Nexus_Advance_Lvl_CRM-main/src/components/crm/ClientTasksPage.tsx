'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TaskItem {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export function ClientTasksPage() {
  const [items, setItems] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/tasks', { cache: 'no-store' });
    const json = await res.json();
    if (res.ok) setItems(json.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: TaskItem['status']) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to update task');
      return;
    }
    toast.success('Task updated');
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Tasks</h1>
      <div className="rounded-xl border border-[var(--border-default)] bg-white overflow-x-auto">
        {loading ? (
          <p className="p-4 text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-[var(--text-muted)]">No tasks assigned yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-subtle)]">
                <th className="p-3">Task</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {items.map((task) => (
                <tr key={task._id} className="border-b border-[var(--border-subtle)]">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3 capitalize">{task.priority}</td>
                  <td className="p-3">
                    <select className="vlocal-input h-8" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value as any)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
