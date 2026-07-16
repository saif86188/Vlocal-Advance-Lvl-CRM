import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { Download, Bell, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Payments() {
  const { state, dispatch } = useAdminStore();
  const [showInvoicePanel, setShowInvoicePanel] = useState(false);
  const [invoiceLines, setInvoiceLines] = useState([
    { id: 1, desc: 'Design Milestone', amount: 40000 },
  ]);

  const totalRevenue = state.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.total, 0);
  const pendingRevenue = state.payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.total, 0);

  const handleReminder = (inv: any) => {
    toast.info(`Reminder sent to Apex Corp for ${inv.invoiceNumber}`);
  };

  const handleMarkPaid = (payId: string, invoiceNum: string) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: payId, updates: { status: 'paid', paidAt: new Date().toISOString() } } });
    toast.success(`${invoiceNum} marked as Paid!`);
  };

  const handleSendInvoice = () => {
    toast.success('Invoice INV-2025-004 generated and sent to client!');
    setShowInvoicePanel(false);
  };

  const milestoneLabel = (id: string) => ({ m1: 'Kickoff', m2: 'Design Delivery', m3: 'Development', m4: 'Final Launch' }[id] || id);

  const statusStyle: Record<string, string> = {
    paid: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
    pending: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
    overdue: 'bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger-dim)]',
  };

  return (
    <div className="flex flex-col gap-[var(--gap-section)] relative h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1>Payments & Invoices</h1>
        <div className="flex flex-wrap gap-2">
          <button className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] flex items-center gap-2">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setShowInvoicePanel(true)}
            className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
            Generate Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Revenue (All Time)</div>
          <div className="metric-number text-[var(--success)]">₹4,20,000</div>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Revenue (This Month)</div>
          <div className="metric-number">₹{new Intl.NumberFormat('en-IN').format(totalRevenue)}</div>
        </div>
        <div className="glass-card p-[var(--card-padding)] border-t-2 border-t-[var(--warning)]">
          <div className="caption mb-1">Pending Invoices</div>
          <div className="metric-number text-[var(--warning)]">₹{new Intl.NumberFormat('en-IN').format(pendingRevenue)}</div>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Overdue</div>
          <div className="metric-number text-[var(--text-muted)]">₹0</div>
        </div>
      </div>

      <div className="glass-card overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
              <th className="font-medium text-[11.5px] p-3 pl-4 uppercase tracking-wider">Invoice #</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Client</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Project / Milestone</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Amount</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Due</th>
              <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Status</th>
              <th className="font-medium text-[11.5px] p-3 pr-4 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.payments.map(inv => (
              <tr key={inv.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors" style={{ height: 'var(--row-height)' }}>
                <td className="p-3 pl-4 font-medium text-[13px] text-[var(--text-secondary)]">{inv.invoiceNumber}</td>
                <td className="p-3 text-[13px]">Apex Corp</td>
                <td className="p-3 text-[13px] text-[var(--text-secondary)]">Brand Identity • {milestoneLabel(inv.milestoneId)}</td>
                <td className="p-3 font-semibold text-[13px]">₹{new Intl.NumberFormat('en-IN').format(inv.total)}</td>
                <td className="p-3 text-[13px] text-[var(--text-secondary)]">
                  {new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </td>
                <td className="p-3">
                  <span className={`inline-block px-[10px] py-[2px] rounded-full text-[11px] font-medium capitalize border ${statusStyle[inv.status] || statusStyle.pending}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-3 pr-4 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    {inv.status !== 'paid' && (
                      <>
                        <button onClick={() => handleReminder(inv)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" title="Send Reminder">
                          <Bell size={15} />
                        </button>
                        <button onClick={() => handleMarkPaid(inv.id, inv.invoiceNumber)}
                          className="CODEVATE-btn-sm bg-[var(--success-dim)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white border border-[var(--success-dim)] transition-all text-[11.5px]">
                          Mark Paid
                        </button>
                      </>
                    )}
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Download PDF">
                      <Download size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Invoice Panel */}
      {showInvoicePanel && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowInvoicePanel(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[520px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h3 className="font-semibold text-[18px]">Generate Invoice</h3>
                <p className="text-[11.5px] text-[var(--text-secondary)]">Auto-filled from proposal milestone</p>
              </div>
              <button onClick={() => setShowInvoicePanel(false)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="caption block mb-2">Invoice Number</label>
                  <input className="CODEVATE-input w-full" defaultValue="INV-2025-004" readOnly />
                </div>
                <div>
                  <label className="caption block mb-2">Client</label>
                  <input className="CODEVATE-input w-full" defaultValue="Apex Corp" readOnly />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="caption">Line Items</label>
                  <button onClick={() => setInvoiceLines(l => [...l, { id: Date.now(), desc: '', amount: 0 }])}
                    className="text-[var(--accent)] text-[12px] flex items-center gap-1">
                    <Plus size={13} /> Add Item
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {invoiceLines.map((line, i) => (
                    <div key={line.id} className="flex gap-2 items-center">
                      <input className="CODEVATE-input flex-1" placeholder="Description" defaultValue={line.desc} />
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-[13px]">₹</span>
                        <input type="number" className="CODEVATE-input w-full pl-7" defaultValue={line.amount} />
                      </div>
                      <button onClick={() => setInvoiceLines(l => l.filter((_, idx) => idx !== i))}
                        className="text-[var(--text-secondary)] hover:text-[var(--danger)]"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="caption block mb-2">Tax %</label>
                  <input type="number" className="CODEVATE-input w-full" defaultValue="18" />
                </div>
                <div>
                  <label className="caption block mb-2">Due Date</label>
                  <input type="date" className="CODEVATE-input w-full" />
                </div>
              </div>
              <div>
                <label className="caption block mb-2">Notes</label>
                <textarea className="CODEVATE-input w-full py-2 min-h-[60px] resize-none"
                  placeholder="Any special notes for this invoice..." />
              </div>
            </div>
            <div className="p-5 border-t border-[var(--border-subtle)] flex gap-3">
              <button onClick={() => setShowInvoicePanel(false)}
                className="CODEVATE-btn flex-1 border border-[var(--border-default)] hover:bg-[var(--bg-hover)]">
                Cancel
              </button>
              <button onClick={handleSendInvoice}
                className="CODEVATE-btn flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
                Preview & Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

