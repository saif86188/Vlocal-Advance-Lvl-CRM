import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import Link from 'next/link';
import { Edit2, Download, MessageSquare, CheckSquare, Upload, X, Send } from 'lucide-react';
import { toast } from 'sonner';

const vBadge = (v: number) => {
  if (v === 1) return { bg: '#55597033', color: '#555970' };
  if (v === 2) return { bg: 'var(--info-dim)', color: 'var(--info)' };
  if (v === 3) return { bg: 'var(--warning-dim)', color: 'var(--warning)' };
  return { bg: 'var(--success-dim)', color: 'var(--success)' };
};

const statusStyle: Record<string, string> = {
  awaiting_approval: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
  under_discussion: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
  approved: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
  in_progress: 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-dim)]',
  completed: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
  archived: 'bg-[#55597033] text-[#555970] border-[#55597033]',
  draft: 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-default)]',
  rejected: 'bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger-dim)]',
  sent: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
};

export function Proposals() {
  const { state, dispatch } = useAdminStore();
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [uploadPanel, setUploadPanel] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState('');

  const activeProposals = state.proposals.filter(p => (p.status as string) !== 'archived');
  const archivedProposals = state.proposals.filter(p => (p.status as string) === 'archived');

  const handleMarkMilestoneDone = (prop: any, milestoneIdx: number) => {
    toast.success(`Milestone "${prop.milestones[milestoneIdx].name}" marked as done!`);
  };

  const handleSendChat = (discussionId: string) => {
    if (!chatMsg.trim()) return;
    dispatch({
      type: 'ADD_DISCUSSION_MESSAGE',
      payload: {
        discussionId,
        message: {
          id: `msg-${Date.now()}`,
          senderId: 'a-1',
          senderRole: 'admin',
          content: chatMsg,
          timestamp: new Date().toISOString(),
        },
      },
    });
    setChatMsg('');
    toast.success('Message sent!');
  };

  const handleUpload = (propId: string) => {
    if (!uploadFile.trim()) return;
    toast.success(`Deliverable "${uploadFile}" uploaded successfully!`);
    setUploadPanel(null);
    setUploadFile('');
  };

  const discussion = selectedDiscussion
    ? state.discussions.find(d => d.proposalId === selectedDiscussion.id)
    : null;

  return (
    <div className="flex flex-col h-full relative gap-[var(--gap-section)]">
      <div className="flex items-center justify-between">
        <div>
          <h1>All Proposals</h1>
          <p className="text-[var(--text-secondary)] mt-1">{activeProposals.length} active proposals</p>
        </div>
        <Link href="/builder" className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white gap-2">
          + New Proposal
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
              <th className="font-medium text-[11.5px] p-3 pl-4 uppercase tracking-wider">Client</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Project</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Ver</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Total Value</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Status</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Sent</th>
              <th className="font-medium text-[11.5px] p-3 pr-4 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeProposals.map(prop => {
              const badge = vBadge(prop.version);
              const ss = statusStyle[(prop.status as string)] || statusStyle.draft;
              const disc = state.discussions.find(d => d.proposalId === prop.id);
              return (
                <tr key={prop.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors" style={{ height: 'var(--row-height)' }}>
                  <td className="p-3 pl-4 text-[13px] text-[var(--text-secondary)]">
                    {prop.clientId === 'u-1' ? 'Apex Corp' : 'Nova Tech'}
                  </td>
                  <td className="p-3 font-medium text-[13px]">Brand Identity + Website</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: badge.bg, color: badge.color }}>
                      V{prop.version}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-[13px]">₹{new Intl.NumberFormat('en-IN').format(prop.totalCost)}</td>
                  <td className="p-3">
                    <span className={`inline-block px-[10px] py-[2px] rounded-full text-[11px] font-medium capitalize border ${ss}`}>
                      {(prop.status as string).replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">
                    {new Date(prop.sentAt).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex gap-3 justify-end items-center">
                      {prop.status === 'awaiting_approval' && (
                        <Link href={`/builder?req=${prop.requirementId}`}
                          className="text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 text-[12.5px] font-medium">
                          <Edit2 size={13} /> Reissue
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedDiscussion(prop)}
                        className="relative text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        title="View Discussion">
                        <MessageSquare size={15} />
                        {disc && disc.unreads > 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent)] rounded-full" />
                        )}
                      </button>
                      <button onClick={() => setUploadPanel(prop)}
                        className="text-[var(--text-secondary)] hover:text-[var(--success)] transition-colors"
                        title="Upload Deliverable">
                        <Upload size={15} />
                      </button>
                      <button
                        onClick={() => handleMarkMilestoneDone(prop, 0)}
                        className="text-[var(--text-secondary)] hover:text-[var(--info)] transition-colors"
                        title="Mark Milestone Done">
                        <CheckSquare size={15} />
                      </button>
                      <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Download">
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Version History */}
      <div className="glass-card p-[var(--card-padding)]">
        <h3 className="section-heading mb-4">Version History Map</h3>
        <div className="flex gap-4 items-center overflow-x-auto pb-2">
          {state.proposals.map((prop, i) => {
            const badge = vBadge(prop.version);
            return (
              <div key={prop.id} className="flex items-center shrink-0">
                <div className="p-4 border rounded-[var(--radius-sm)] min-w-[180px]"
                  style={{ borderColor: badge.color, background: badge.bg }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[13px]" style={{ color: badge.color }}>Version {prop.version}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{new Date(prop.sentAt).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</span>
                  </div>
                  <div className="text-[13px] font-medium mb-1">₹{new Intl.NumberFormat('en-IN').format(prop.totalCost)}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] capitalize">{(prop.status as string).replace(/_/g, ' ')}</div>
                </div>
                {i < state.proposals.length - 1 && <div className="w-8 h-px bg-[var(--border-strong)] mx-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discussion Slide-over */}
      {selectedDiscussion && discussion && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setSelectedDiscussion(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h3 className="font-semibold text-[15px]">Discussion Room</h3>
                <p className="text-[11.5px] text-[var(--text-secondary)]">
                  Brand Identity • V{selectedDiscussion.version} • Apex Corp
                </p>
              </div>
              <button onClick={() => setSelectedDiscussion(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {discussion.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-[10px] p-3 text-[13px] leading-relaxed ${
                    msg.senderRole === 'admin'
                      ? 'bg-[var(--accent)] text-white rounded-tr-none'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-none'
                  }`}>
                    <div className="text-[11px] opacity-70 mb-1">
                      {msg.senderRole === 'admin' ? 'You (Admin)' : 'Client'} • {new Date(msg.timestamp).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'})}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--border-subtle)] flex gap-2">
              <input
                className="CODEVATE-input flex-1 text-[13px]"
                placeholder="Type a reply..."
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendChat(discussion.id); }}
              />
              <button onClick={() => handleSendChat(discussion.id)}
                className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3">
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Upload Deliverable Panel */}
      {uploadPanel && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setUploadPanel(null)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] w-full max-w-[420px] shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <h3 className="font-semibold text-[15px]">Upload Deliverable</h3>
                <button onClick={() => setUploadPanel(null)}><X size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <label className="caption block mb-2">File Name / Label</label>
                  <input className="CODEVATE-input w-full" placeholder="e.g. logo-final-v3.fig" value={uploadFile} onChange={e => setUploadFile(e.target.value)} />
                </div>
                <div className="border border-dashed border-[var(--border-strong)] rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
                  <Upload size={24} className="mb-2 text-[var(--text-muted)]" />
                  <span className="text-[13px]">Drop file here or click to browse</span>
                </div>
                <button onClick={() => handleUpload(uploadPanel.id)}
                  className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full">
                  Upload Deliverable
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

