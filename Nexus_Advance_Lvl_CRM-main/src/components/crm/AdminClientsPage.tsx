'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ClientItem {
  _id: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

interface ClientsResponse {
  items: ClientItem[];
  total: number;
  page: number;
  pageSize: number;
}

export function AdminClientsPage() {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    contactName: '',
    phone: '',
  });

  const load = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      q: search,
      status,
    });
    const res = await fetch(`/api/clients?${query.toString()}`, { cache: 'no-store' });
    const json: ClientsResponse | { error: string } = await res.json();
    if (!res.ok || 'error' in json) {
      toast.error('Failed to load clients');
      setLoading(false);
      return;
    }
    setItems(json.items);
    setTotal(json.total);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    await load();
  };

  const createClient = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to create client');
      return;
    }
    toast.success('Client created');
    setShowCreate(false);
    setForm({ name: '', email: '', password: '', companyName: '', contactName: '', phone: '' });
    await load();
  };

  const toggleStatus = async (item: ClientItem) => {
    const res = await fetch(`/api/clients/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: item.status === 'active' ? 'inactive' : 'active' }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to update status');
      return;
    }
    toast.success('Client updated');
    await load();
  };

  const deleteClient = async (id: string) => {
    if (!window.confirm('Delete this client?')) return;
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to delete');
      return;
    }
    toast.success('Client deleted');
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Client Management</h1>
        <button className="vlocal-btn bg-[var(--accent)] text-neutral-900" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? 'Close' : 'Create Client'}
        </button>
      </div>

      <form onSubmit={onSearch} className="flex flex-wrap gap-2">
        <input className="vlocal-input w-56" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="vlocal-input w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="vlocal-btn border border-[var(--border-default)] bg-white">Filter</button>
      </form>

      {showCreate && (
        <form onSubmit={createClient} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-xl border border-[var(--border-default)] bg-white">
          <input className="vlocal-input" placeholder="User name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="vlocal-input" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          <input className="vlocal-input" placeholder="Contact name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
          <input className="vlocal-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="vlocal-input" type="password" placeholder="Temp password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="vlocal-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button className="vlocal-btn bg-neutral-900 text-white md:col-span-2">Save Client</button>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border-default)] bg-white overflow-x-auto">
        {loading ? (
          <p className="p-4 text-sm text-[var(--text-secondary)]">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-[var(--text-secondary)]">No clients found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-subtle)]">
                <th className="p-3">Company</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-[var(--border-subtle)]">
                  <td className="p-3">{item.companyName}</td>
                  <td className="p-3">{item.contactName}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3 capitalize">{item.status}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-xs underline" onClick={() => toggleStatus(item)}>
                      {item.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-xs underline text-red-600" onClick={() => deleteClient(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>
          Page {page} / {Math.max(Math.ceil(total / pageSize), 1)}
        </span>
        <div className="flex gap-2">
          <button className="vlocal-btn border border-[var(--border-default)] bg-white" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>
          <button
            className="vlocal-btn border border-[var(--border-default)] bg-white"
            onClick={() => setPage((p) => (p < Math.ceil(total / pageSize) ? p + 1 : p))}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
