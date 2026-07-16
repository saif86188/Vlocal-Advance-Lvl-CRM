import { useState } from 'react';
import { useClientStore } from '@/modules/client/data/store';
import { Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

const priorityColors: Record<string, string> = {
  low: 'var(--info)', medium: 'var(--warning)', high: 'var(--danger)', urgent: 'var(--danger)'
};
const statusColors: Record<string, string> = {
  draft: 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-default)]',
  awaiting_review: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
  reviewed: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
  proposal_sent: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
  closed: 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-default)]',
};
const FILTER_MAP: Record<string, string[]> = {
  'All': [],
  'Pending Review': ['awaiting_review', 'draft'],
  'In Progress': ['reviewed', 'proposal_sent'],
  'Completed': ['closed'],
};

export function Requirements() {
  const { state, dispatch } = useClientStore();
  const [filter, setFilter] = useState('All');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [charCount, setCharCount] = useState(0);

  const filtered = state.requirements.filter(r => {
    if (filter === 'All') return true;
    return FILTER_MAP[filter]?.includes(r.status) ?? true;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newReq: any = {
      id: `req-${Date.now()}`,
      clientId: 'u-1',
      title: data.get('title') as string,
      description: data.get('description') as string,
      budgetMin: Number(data.get('budget')),
      budgetMax: Number(data.get('budget')) * 1.2,
      deadline: data.get('deadline') as string,
      priority: selectedPriority.toLowerCase() as any,
      files: [],
      status: 'awaiting_review',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_REQUIREMENT', payload: newReq });
    setIsOpen(false);
    form.reset();
    setCharCount(0);
    toast.success('Requirement submitted — CODEVATE team will review within 24 hours');
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-[var(--gap-section)]">
        <div>
          <h1>My Requirements</h1>
          <p className="text-[var(--text-secondary)] mt-1">{state.requirements.length} total submissions</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white gap-2">
          <Plus size={15} /> New Requirement
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-[var(--gap-section)]">
        {['All', 'Pending Review', 'In Progress', 'Completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`h-[28px] px-3 rounded-full text-[11px] font-medium transition-colors border ${filter === f ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-transparent border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <th className="font-medium text-[11.5px] p-3 pl-4 uppercase tracking-wider">Title</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Priority</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Budget</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Submitted</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Status</th>
                <th className="font-medium text-[11.5px] p-3 pr-4 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors" style={{ height: 'var(--row-height)' }}>
                  <td className="p-3 pl-4 font-medium text-[13px]">{req.title}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${req.priority === 'urgent' ? 'animate-pulse' : ''}`} style={{ backgroundColor: priorityColors[req.priority] }} />
                      <span className="capitalize text-[13px] text-[var(--text-secondary)]">{req.priority}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">₹{new Intl.NumberFormat('en-IN').format(req.budgetMin)} – ₹{new Intl.NumberFormat('en-IN').format(req.budgetMax)}</td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">{new Date(req.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="p-3">
                    <span className={`inline-block px-[10px] py-[2px] rounded-full text-[11px] font-medium capitalize border ${statusColors[req.status] || statusColors.draft}`}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <button className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-[12.5px] font-medium">View</button>
                      <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[12.5px] font-medium">Follow Up</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center">
                  <div className="text-[32px] mb-2">📋</div>
                  <div className="font-medium text-[15px] text-[var(--text-secondary)]">No requirements found</div>
                  <div className="text-[13px] text-[var(--text-muted)] mt-1">Submit your first requirement to get started</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h2 className="text-[18px]">New Requirement</h2>
                <p className="text-[11.5px] text-[var(--text-secondary)] mt-0.5">Tell us what you need built</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 max-h-[85vh] custom-scrollbar">
              <div className="flex flex-col gap-1.5">
                <label className="caption">Project Title *</label>
                <input name="title" type="text" className="CODEVATE-input w-full" placeholder="e.g. E-commerce Website Redesign" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="caption flex justify-between">
                  <span>Requirement Description *</span>
                  <span className="text-[var(--text-muted)]">{charCount}/500</span>
                </label>
                <textarea name="description" className="CODEVATE-input py-2 min-h-[100px] resize-none w-full" rows={4}
                  placeholder="Describe what you need in detail..." maxLength={500} required onChange={e => setCharCount(e.target.value.length)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="caption">Budget Expectation *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-[13px]">₹</span>
                  <input name="budget" type="number" className="CODEVATE-input pl-7 w-full" placeholder="50000" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="caption">Deadline *</label>
                <input name="deadline" type="date" className="CODEVATE-input w-full" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="caption">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                    <button key={p} type="button" onClick={() => setSelectedPriority(p)}
                      className={`flex-1 py-1.5 rounded-[var(--radius-sm)] border text-[12px] font-medium transition-colors ${selectedPriority === p
                        ? p === 'Low' ? 'bg-[var(--info)] border-[var(--info)] text-white'
                          : p === 'Medium' ? 'bg-[var(--warning)] border-[var(--warning)] text-white'
                          : 'bg-[var(--danger)] border-[var(--danger)] text-white'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="caption">Attachments</label>
                <label className="border border-dashed border-[var(--border-strong)] rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--text-muted)] transition-colors cursor-pointer">
                  <Upload size={24} className="mb-2 text-[var(--text-muted)]" />
                  <span className="text-[13px]">Drop files here or click to browse</span>
                  <input type="file" className="hidden" multiple />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="CODEVATE-btn flex-1 border border-[var(--border-default)] hover:bg-[var(--bg-hover)]">Cancel</button>
                <button type="submit" className="CODEVATE-btn flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Submit Requirement</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

