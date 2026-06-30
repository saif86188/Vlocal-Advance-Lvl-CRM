import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import Link from 'next/link';
import { X, Download, FileText, Search } from 'lucide-react';

const priorityColors: Record<string, string> = {
  low: 'var(--info)',
  medium: 'var(--warning)',
  high: 'var(--danger)',
  urgent: 'var(--danger)'
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'var(--bg-hover)', text: 'var(--text-secondary)' },
  awaiting_review: { bg: 'var(--warning-dim)', text: 'var(--warning)' },
  reviewed: { bg: 'var(--info-dim)', text: 'var(--info)' },
  proposal_sent: { bg: 'var(--success-dim)', text: 'var(--success)' },
  closed: { bg: 'var(--bg-hover)', text: 'var(--text-muted)' },
};

export function Requirements() {
  const { state } = useAdminStore();
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const clientName = (id: string) => id === 'u-1' ? 'Apex Corp' : id === 'u-2' ? 'Nova Tech' : 'Unknown';

  const filtered = state.requirements.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !clientName(r.clientId).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-[var(--gap-section)]">
        <div>
          <h1>Client Requirements</h1>
          <p className="text-[var(--text-secondary)] mt-1">{state.requirements.length} total requirements</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[140px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="vlocal-input pl-8 w-full text-[12.5px]"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="vlocal-input flex-1 min-w-[130px] text-[12.5px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="awaiting_review">Awaiting Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="draft">Draft</option>
          </select>
          <select className="vlocal-input flex-1 min-w-[130px] text-[12.5px]" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
              <th className="font-medium text-[11.5px] p-3 pl-4 uppercase tracking-wider">Client</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Project Title</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Budget</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Priority</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Submitted</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Status</th>
              <th className="font-medium text-[11.5px] p-3 pr-4 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => {
              const sc = statusColors[req.status] || statusColors.draft;
              return (
                <tr key={req.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors" style={{ height: 'var(--row-height)' }}>
                  <td className="p-3 pl-4 text-[13px] text-[var(--text-secondary)]">{clientName(req.clientId)}</td>
                  <td className="p-3 font-medium text-[13px]">{req.title}</td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">
                    ₹{(req.budgetMin/1000).toFixed(0)}k – ₹{(req.budgetMax/1000).toFixed(0)}k
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${req.priority === 'urgent' ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: priorityColors[req.priority] }} />
                      <span className="capitalize text-[13px] text-[var(--text-secondary)]">{req.priority}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">
                    {new Date(req.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-[10px] py-[2px] rounded-full text-[11px] font-medium capitalize border"
                      style={{ background: sc.bg, color: sc.text, borderColor: sc.bg }}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex gap-3 justify-end items-center">
                      <button onClick={() => setSelectedReq(req)}
                        className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-[12.5px] font-medium">
                        View
                      </button>
                      <Link href={`/builder?req=${req.id}`}
                        className="text-[var(--success)] hover:text-[#2EAA68] text-[12.5px] font-medium whitespace-nowrap">
                        Create Proposal
                      </Link>
                      <button className="text-[var(--text-secondary)] hover:text-[var(--danger)] text-[12.5px] font-medium">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="text-[var(--text-muted)] text-[28px] mb-2">📋</div>
                  <div className="font-medium text-[15px] text-[var(--text-secondary)]">No requirements found</div>
                  <div className="text-[13px] text-[var(--text-muted)] mt-1">Try adjusting your filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Slide-over */}
      {selectedReq && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setSelectedReq(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h2 className="text-[18px]">Requirement Details</h2>
                <p className="text-[11.5px] text-[var(--text-secondary)] mt-0.5">{clientName(selectedReq.clientId)}</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">{selectedReq.title}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                  {selectedReq.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                  <div className="caption mb-1">Budget Range</div>
                  <div className="font-semibold text-[15px]">₹{new Intl.NumberFormat('en-IN').format(selectedReq.budgetMin)} – ₹{new Intl.NumberFormat('en-IN').format(selectedReq.budgetMax)}</div>
                </div>
                <div className="bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                  <div className="caption mb-1">Deadline</div>
                  <div className="font-semibold text-[15px]">{new Date(selectedReq.deadline).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
              <div className="bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                <div className="caption mb-1">Priority</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: priorityColors[selectedReq.priority] }} />
                  <span className="font-medium capitalize text-[13px]">{selectedReq.priority}</span>
                </div>
              </div>
              <div>
                <div className="caption mb-2">Uploaded Files</div>
                {selectedReq.files?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {selectedReq.files.map((f: any) => (
                      <div key={f.id} className="flex items-center justify-between p-3 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover)] transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-[var(--text-secondary)]" />
                          <span className="text-[13px]">{f.name}</span>
                        </div>
                        <button className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-[var(--text-muted)] italic">No files attached.</div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-[var(--border-subtle)] flex gap-2 justify-end bg-[var(--bg-surface)]">
              <button className="vlocal-btn border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-dim)]">Reject</button>
              <button className="vlocal-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)]">Ask Clarification</button>
              <Link
                href={`/builder?req=${selectedReq.id}`}
                onClick={() => setSelectedReq(null)}
                className="vlocal-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                Create Proposal
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

