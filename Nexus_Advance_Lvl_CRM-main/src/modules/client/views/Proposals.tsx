import { useState } from 'react';
import { useClientStore } from '@/modules/client/data/store';
import { Download, MessageSquare, X, Send, CheckCircle } from 'lucide-react';
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
  sent: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
};

export function Proposals() {
  const { state, dispatch } = useClientStore();
  const [selectedVersion, setSelectedVersion] = useState('V2');
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('UPI');

  const activeProposals = state.proposals.filter(p => (p.status as string) !== 'archived');
  const archivedProposals = state.proposals.filter(p => (p.status as string) === 'archived');
  const currentProposal = state.proposals.find(p => `V${p.version}` === selectedVersion && (p.status as string) !== 'archived') || activeProposals[0];

  if (!currentProposal) return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="text-[32px] mb-2">📄</div>
      <h2 className="text-[18px] font-semibold">No proposals yet</h2>
      <p className="text-[var(--text-secondary)] text-[13px] mt-1">A proposal will appear here once the CODEVATE team sends one.</p>
    </div>
  );

  const discussion = state.discussions.find(d => d.proposalId === currentProposal.id);
  const pendingPayment = state.payments.find(p => p.status === 'pending' && p.proposalId === currentProposal.id);

  const handleApprove = () => {
    dispatch({ type: 'APPROVE_PROPOSAL', payload: { proposalId: currentProposal.id } });
    setConfirmApprove(false);
    toast.success('Proposal approved! Payment gateway is now unlocked.');
  };

  const handlePay = () => {
    if (!pendingPayment) return;
    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: pendingPayment.id, updates: { status: 'paid', paidAt: new Date().toISOString() } } });
    setPayModalOpen(false);
    toast.success(`Payment of ₹${new Intl.NumberFormat('en-IN').format(pendingPayment.total)} confirmed! Receipt sent to your email.`);
  };

  const handleSendMessage = () => {
    if (!chatMsg.trim() || !discussion) return;
    dispatch({
      type: 'ADD_DISCUSSION_MESSAGE',
      payload: {
        discussionId: discussion.id,
        message: { id: `m-${Date.now()}`, senderId: 'u-1', senderRole: 'client', content: chatMsg, timestamp: new Date().toISOString() },
      },
    });
    setChatMsg('');
    toast.success('Message sent to CODEVATE team!');
  };

  const status = currentProposal.status as string;
  const fmt = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

  return (
    <div className="flex flex-col gap-[var(--gap-section)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1>Proposals</h1>
          <p className="text-[var(--text-secondary)] mt-1">{activeProposals.length} active proposal{activeProposals.length !== 1 ? 's' : ''}</p>
        </div>
        <select value={selectedVersion} onChange={e => setSelectedVersion(e.target.value)} className="CODEVATE-input w-full sm:w-36">
          {activeProposals.map(p => (
            <option key={p.id} value={`V${p.version}`}>Version {p.version} (Current)</option>
          ))}
        </select>
      </div>

      {/* Main Proposal Card */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between bg-[var(--bg-elevated)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[18px] font-semibold">Brand Identity + Website</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: vBadge(currentProposal.version).bg, color: vBadge(currentProposal.version).color }}>
                V{currentProposal.version}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize border ${statusStyle[status] || statusStyle.draft}`}>
                {status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-[11.5px] text-[var(--text-secondary)]">Sent by CODEVATE Team • {new Date(currentProposal.sentAt).toLocaleDateString('en-GB')}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="caption text-[var(--text-muted)] mb-1">OFFERED PRICE</div>
            <div className="text-[22px] font-bold text-[var(--text-primary)]">{fmt(currentProposal.totalCost)}</div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">Valid until: 15 Jun 2025</div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-[var(--gap-section)]">
          {/* Scope */}
          <div>
            <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">Scope</h3>
            <div className="flex flex-wrap gap-2">
              {currentProposal.scope.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-hover)] border border-[var(--border-default)] text-[13px]">{s}</span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">Timeline & Phases</h3>
            <div className="flex flex-col gap-2.5">
              {currentProposal.phases.map((phase, i) => (
                <div key={phase.id} className="flex items-center gap-4 text-[13px]">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${i === 0 ? 'bg-[var(--success)]' : i === 1 ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]' : 'bg-transparent border-2 border-[var(--text-muted)]'}`} />
                  <div className={`font-medium w-28 ${i === 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{phase.name}</div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-[2px] w-full max-w-[180px] transition-all duration-700 ${i === 0 ? 'bg-[var(--success)]' : i === 1 ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)] opacity-30'}`} />
                  </div>
                  <div className="w-16 text-[var(--text-secondary)]">{phase.durationDays}d</div>
                  <div className="w-20 text-right text-[11.5px]">
                    {i === 0 && <span className="text-[var(--success)] flex items-center gap-1 justify-end"><CheckCircle size={12} /> Done</span>}
                    {i === 1 && <span className="text-[var(--accent)] font-medium">← Current</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">Milestones & Payment</h3>
            <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] overflow-hidden">
              {currentProposal.milestones.map((m, i) => (
                <div key={m.id} className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--text-muted)] font-medium w-8">M{i + 1}</span>
                    <span className="font-medium text-[13px]">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-medium text-[13px]">{fmt(m.amount)}</span>
                    <span className={`w-28 text-right text-[12px] ${m.status === 'paid' ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'}`}>
                      {m.status === 'paid' ? 'Paid ✓' : `Due ${new Date(m.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">Deliverables</h3>
              <ul className="space-y-1.5">
                {currentProposal.deliverables.map(d => (
                  <li key={d} className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />{d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">Notes</h3>
              <p className="text-[13px] text-[var(--text-secondary)]">{currentProposal.assumptions}</p>
              <p className="text-[13px] text-[var(--text-muted)] mt-1">Excludes: {currentProposal.exclusions}</p>
            </div>
          </div>
        </div>

        {/* Action Bar — state driven */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {status === 'awaiting_approval' && (
              <>
                <button onClick={() => setConfirmApprove(true)} className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Approve Proposal</button>
                <button onClick={() => toast.info('Change request sent to CODEVATE team!')} className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)]">Request Changes</button>
              </>
            )}
            {status === 'approved' && pendingPayment && (
              <button onClick={() => setPayModalOpen(true)} className="CODEVATE-btn bg-[var(--success)] hover:bg-[#2EAA68] text-white">Pay Now</button>
            )}
            {status === 'in_progress' && (
              <button className="CODEVATE-btn bg-[var(--info-dim)] text-[var(--info)] border border-[var(--info-dim)]">View Progress</button>
            )}
          </div>
          <div className="flex gap-2">
            {(status === 'awaiting_approval' || status === 'under_discussion' || status === 'approved') && (
              <button onClick={() => setDiscussionOpen(true)} className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] flex items-center gap-2">
                <MessageSquare size={15} /> Discuss
                {discussion && discussion.unreads > 0 && <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />}
              </button>
            )}
            <button className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] flex items-center gap-2">
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Archived */}
      {archivedProposals.length > 0 && (
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wider">Previous Versions</h3>
          {archivedProposals.map(p => (
            <div key={p.id} className="p-4 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] flex items-center justify-between mb-2 hover:border-[var(--border-strong)] transition-colors bg-[var(--bg-surface)]">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[13px]">Brand Identity + Website</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#55597033] text-[#555970]">V{p.version}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-[13px]">Archived on {new Date(p.archivedAt!).toLocaleDateString('en-GB')}</div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Confirmation */}
      {confirmApprove && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setConfirmApprove(false)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] w-full max-w-[400px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold text-[18px] mb-2">Approve Proposal?</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-4">By approving, you agree to the scope, timeline, and payment schedule outlined in this proposal. The payment gateway will be unlocked.</p>
              <div className="bg-[var(--bg-elevated)] p-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Total Project Cost</span>
                  <span className="font-bold">{fmt(currentProposal.totalCost)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmApprove(false)} className="CODEVATE-btn flex-1 border border-[var(--border-default)] hover:bg-[var(--bg-hover)]">Cancel</button>
                <button onClick={handleApprove} className="CODEVATE-btn flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Approve & Proceed</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Discussion Slide-over */}
      {discussionOpen && discussion && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setDiscussionOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h3 className="font-semibold text-[15px]">Discussion Room</h3>
                <p className="text-[11.5px] text-[var(--text-secondary)]">Brand Identity • V{currentProposal.version} • Direct with CODEVATE Team</p>
              </div>
              <button onClick={() => setDiscussionOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"><X size={18} /></button>
            </div>
            <div className="px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-center">
              <span className="text-[11px] text-[var(--text-muted)]">💬 Discussion started — May 3, 2025</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {discussion.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-[10px] p-3 text-[13px] leading-relaxed ${msg.senderRole === 'client' ? 'bg-[var(--accent)] text-white rounded-tr-none' : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-none'}`}>
                    <div className="text-[11px] opacity-70 mb-1">
                      {msg.senderRole === 'client' ? 'You' : 'CODEVATE Team'} • {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--border-subtle)] flex gap-2">
              <input className="CODEVATE-input flex-1 text-[13px]" placeholder="Type a message…" value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }} />
              <button onClick={handleSendMessage} className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4"><Send size={16} /></button>
            </div>
          </div>
        </>
      )}

      {/* Pay Modal */}
      {payModalOpen && pendingPayment && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setPayModalOpen(false)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <h3 className="font-semibold text-[18px]">Make Payment</h3>
                <button onClick={() => setPayModalOpen(false)}><X size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="bg-[var(--bg-hover)] rounded-[var(--radius-sm)] p-4 border border-[var(--border-default)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)] text-[13px]">Invoice</span>
                    <span className="font-medium text-[13px]">{pendingPayment.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)] mt-1">
                    <span className="font-bold text-[13px]">Total Amount</span>
                    <span className="font-bold text-[18px] text-[var(--accent)]">{fmt(pendingPayment.total)}</span>
                  </div>
                </div>
                {/* Payment methods */}
                <div className="flex gap-2">
                  {['UPI', 'Card', 'Net Banking', 'Wallets'].map(m => (
                    <button key={m} type="button" onClick={() => setPayMethod(m)}
                      className={`flex-1 py-2 rounded-[var(--radius-sm)] border text-[11.5px] font-medium transition-colors ${payMethod === m ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}>
                      {m}
                    </button>
                  ))}
                </div>
                {payMethod === 'UPI' && (
                  <div className="border border-[var(--border-default)] rounded-[var(--radius-sm)] p-5 flex flex-col items-center gap-3">
                    <div className="w-28 h-28 bg-white rounded-md flex items-center justify-center">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CODEVATE@upi" alt="UPI QR" className="opacity-90" />
                    </div>
                    <input className="CODEVATE-input w-full text-center text-[13px]" placeholder="Enter UPI ID (e.g. name@okhdfc)" />
                  </div>
                )}
                {payMethod === 'Card' && (
                  <div className="flex flex-col gap-3">
                    <input className="CODEVATE-input w-full" placeholder="Card Number" maxLength={16} />
                    <div className="flex gap-3">
                      <input className="CODEVATE-input flex-1" placeholder="MM/YY" />
                      <input className="CODEVATE-input flex-1" placeholder="CVV" maxLength={3} />
                    </div>
                    <input className="CODEVATE-input w-full" placeholder="Cardholder Name" />
                  </div>
                )}
                {payMethod === 'Net Banking' && (
                  <select className="CODEVATE-input w-full">
                    <option>Select your bank…</option>
                    {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                )}
                {payMethod === 'Wallets' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{ name: 'PhonePe', color: '#5f259f' }, { name: 'Google Pay', color: '#4285F4' }, { name: 'Paytm', color: '#00BAF2' }].map(w => (
                      <button key={w.name} type="button"
                        className="flex flex-col items-center gap-2 p-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: w.color }}>
                          {w.name[0]}
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)]">{w.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={handlePay} className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full text-[15px] font-semibold mt-2">
                  Pay {fmt(pendingPayment.total)}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

