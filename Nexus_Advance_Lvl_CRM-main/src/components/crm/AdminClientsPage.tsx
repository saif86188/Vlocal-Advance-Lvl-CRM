'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  Search, Filter, Plus, X, User as UserIcon, Building, Mail, 
  Phone, Globe, Calendar, ArrowRight, Eye, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientItem {
  _id: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  industry?: string;
  notes?: string;
  createdAt: string;
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
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'tempPassword123!',
    companyName: '',
    contactName: '',
    phone: '',
    industry: '',
    notes: '',
  });

  const load = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      q: search,
      status,
    });
    try {
      const res = await fetch(`/api/clients?${query.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Failed to load clients');
        setLoading(false);
        return;
      }
      setItems(json.data.items);
      setTotal(json.data.total);
    } catch {
      toast.error('Network error loading clients');
    } finally {
      setLoading(false);
    }
  };

  // Trigger load on pagination or filter status changes
  useEffect(() => {
    load();
  }, [page, pageSize, status]);

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const createClient = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        contactName: form.name, // Map name to contactName
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to create client');
      return;
    }
    toast.success('Client created successfully');
    setShowCreate(false);
    setForm({ name: '', email: '', password: 'tempPassword123!', companyName: '', contactName: '', phone: '', industry: '', notes: '' });
    await load();
  };

  const toggleStatus = async (item: ClientItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening drawer
    const nextStatus = item.status === 'active' ? 'inactive' : 'active';
    const res = await fetch(`/api/clients/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to update status');
      return;
    }
    toast.success('Client status updated');
    await load();
    if (selectedClient && selectedClient._id === item._id) {
      setSelectedClient({ ...selectedClient, status: nextStatus });
    }
  };

  const deleteClient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening drawer
    if (!window.confirm('Delete this client? This will remove all their credentials.')) return;
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? 'Unable to delete');
      return;
    }
    toast.success('Client deleted');
    setSelectedClient(null);
    await load();
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Clients</h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Manage corporate user accounts</p>
        </div>
        <button 
          className="vlocal-btn bg-[var(--accent)] text-neutral-900 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" 
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? 'Cancel' : 'Create Client'}
        </button>
      </div>

      {/* Filter Options */}
      <form onSubmit={onSearchSubmit} className="flex flex-wrap gap-3 items-center">
        <div className="relative w-72">
          <input 
            className="vlocal-input w-full !pl-11" 
            placeholder="Search clients..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
        </div>
        
        <select 
          className="vlocal-input w-44" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <button type="submit" className="vlocal-btn border border-neutral-300 bg-white font-semibold cursor-pointer">
          Apply Filter
        </button>
      </form>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={createClient} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl border border-neutral-200 bg-white shadow-sm animate-in fade-in duration-300">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Contact Name</label>
            <input className="vlocal-input w-full" placeholder="e.g. Saif Client" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Company Name</label>
            <input className="vlocal-input w-full" placeholder="e.g. Nexus Industries" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Email Address</label>
            <input className="vlocal-input w-full" type="email" placeholder="saif@vlocal.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Industry</label>
            <input className="vlocal-input w-full" placeholder="e.g. Technology" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Phone</label>
            <input className="vlocal-input w-full" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Temporary Password</label>
            <input className="vlocal-input w-full" type="text" placeholder="tempPassword123!" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neutral-500">Internal Notes</label>
            <textarea className="vlocal-input w-full h-20 py-2.5 resize-none" placeholder="Notes for this client..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button className="vlocal-btn bg-neutral-900 text-white md:col-span-2 font-bold cursor-pointer">Save Client Profile</button>
        </form>
      )}

      {/* Clients Table */}
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">Loading client directories...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">No clients found matching the search criteria.</p>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="p-4">Company</th>
                <th className="p-4">Primary Contact</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr 
                  key={item._id} 
                  onClick={() => setSelectedClient(item)}
                  className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold">
                        {item.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-extrabold text-neutral-800">{item.companyName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-neutral-700">{item.contactName}</td>
                  <td className="p-4 font-medium text-neutral-500">{item.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={(e) => toggleStatus(item, e)}
                      className="text-neutral-500 hover:text-[var(--accent)] font-semibold transition cursor-pointer"
                    >
                      {item.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <span className="text-neutral-200">|</span>
                    <button 
                      onClick={(e) => deleteClient(item._id, e)}
                      className="text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
        <span>
          Showing page {page} of {Math.max(Math.ceil(total / pageSize), 1)} ({total} records)
        </span>
        <div className="flex gap-2">
          <button 
            className="vlocal-btn vlocal-btn-sm border border-neutral-300 bg-white font-semibold disabled:opacity-50 cursor-pointer" 
            onClick={() => setPage((p) => Math.max(1, p - 1))} 
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="vlocal-btn vlocal-btn-sm border border-neutral-300 bg-white font-semibold disabled:opacity-50 cursor-pointer"
            onClick={() => setPage((p) => (p < Math.ceil(total / pageSize) ? p + 1 : p))}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Side-Drawer */}
      <AnimatePresence>
        {selectedClient && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="fixed inset-0 bg-black z-[1000] cursor-pointer"
            />
            
            {/* Drawer container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-neutral-200 z-[1001] p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-neutral-800">Client Profile Info</h3>
                  <button 
                    onClick={() => setSelectedClient(null)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-neutral-100 rounded-3xl bg-neutral-50/50">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg mb-2">
                    {selectedClient.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-extrabold text-neutral-800 text-sm">{selectedClient.companyName}</h4>
                  <p className="text-xs text-[var(--accent)] font-bold mt-1 uppercase tracking-wider">{selectedClient.industry || 'No Industry Specifics'}</p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex gap-3 text-xs items-center">
                    <UserIcon size={14} className="text-neutral-400" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Contact</p>
                      <p className="font-bold text-neutral-800">{selectedClient.contactName}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs items-center">
                    <Mail size={14} className="text-neutral-400" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Email</p>
                      <p className="font-bold text-neutral-800">{selectedClient.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs items-center">
                    <Phone size={14} className="text-neutral-400" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Phone</p>
                      <p className="font-bold text-neutral-800">{selectedClient.phone || '-'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs items-center">
                    <Calendar size={14} className="text-neutral-400" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Created</p>
                      <p className="font-bold text-neutral-800">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="space-y-1.5 p-4 border border-neutral-100 rounded-3xl bg-white text-xs">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Internal Notes</p>
                    <p className="font-medium text-neutral-600 leading-relaxed">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-100">
                <button 
                  onClick={(e) => toggleStatus(selectedClient, e)}
                  className="vlocal-btn flex-1 bg-neutral-900 text-white font-bold cursor-pointer"
                >
                  {selectedClient.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={(e) => deleteClient(selectedClient._id, e)}
                  className="vlocal-btn bg-red-100 hover:bg-red-200 text-red-600 font-bold p-2.5 rounded-full cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
