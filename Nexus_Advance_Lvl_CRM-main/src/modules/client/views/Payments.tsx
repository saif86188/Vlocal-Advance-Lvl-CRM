import { useState } from 'react';
import { useClientStore } from '@/modules/client/data/store';
import { X, Download } from 'lucide-react';
import { toast } from 'sonner';

export function Payments() {
  const { state, dispatch } = useClientStore();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [payMethod, setPayMethod] = useState('UPI');

  const paidTotal = state.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.total, 0);
  const pendingTotal = state.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.total, 0);

  const milestoneLabel = (id: string) =>
    ({ m1: 'Kickoff', m2: 'Design Delivery', m3: 'Development', m4: 'Final Launch' }[id] || id);

  const statusStyle: Record<string, string> = {
    paid: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
    pending: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
    overdue: 'bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger-dim)]',
  };

  const fmt = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

  const handlePay = () => {
    if (!selectedInvoice) return;
    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: selectedInvoice.id, updates: { status: 'paid', paidAt: new Date().toISOString() } } });
    toast.success(`Payment of ${fmt(selectedInvoice.total)} confirmed! Receipt sent to your email.`);
    setSelectedInvoice(null);
  };

  return (
    <div className="flex flex-col gap-[var(--gap-section)] relative">
      <h1>Payments & Invoices</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Total Project Value</div>
          <div className="metric-number">₹1,47,500</div>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Amount Paid</div>
          <div className="metric-number text-[var(--success)]">{fmt(paidTotal)}</div>
        </div>
        <div className="glass-card p-[var(--card-padding)] border-t-2 border-t-[var(--warning)]">
          <div className="caption mb-1">Amount Pending</div>
          <div className="metric-number text-[var(--warning)]">{fmt(pendingTotal)}</div>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <div className="caption mb-1">Overdue</div>
          <div className="metric-number text-[var(--text-muted)]">₹0</div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <th className="font-medium text-[11.5px] p-3 pl-4 uppercase tracking-wider">#</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Milestone</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Project</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Amount</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Due Date</th>
                <th className="font-medium text-[11.5px] p-3 uppercase tracking-wider">Status</th>
                <th className="font-medium text-[11.5px] p-3 pr-4 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.payments.map(inv => (
                <tr key={inv.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors" style={{ height: 'var(--row-height)' }}>
                  <td className="p-3 pl-4 font-medium text-[13px] text-[var(--text-secondary)]">{inv.invoiceNumber}</td>
                  <td className="p-3 text-[13px]">{milestoneLabel(inv.milestoneId)}</td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">Brand Identity + Website</td>
                  <td className="p-3 font-semibold text-[13px]">{fmt(inv.total)}</td>
                  <td className="p-3 text-[13px] text-[var(--text-secondary)]">
                    {new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-[10px] py-[2px] rounded-full text-[11px] font-medium capitalize border ${statusStyle[inv.status] || statusStyle.pending}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    {inv.status === 'paid' ? (
                      <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[12.5px] font-medium flex items-center gap-1 ml-auto">
                        <Download size={13} /> Receipt
                      </button>
                    ) : (
                      <button onClick={() => { setSelectedInvoice(inv); setPayMethod('UPI'); }}
                        className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11.5px] h-[28px] px-3">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoice && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <h3 className="font-semibold text-[18px]">Make Payment</h3>
                <button onClick={() => setSelectedInvoice(null)}><X size={18} /></button>
              </div>

              <div className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Invoice summary */}
                <div className="bg-[var(--bg-hover)] rounded-[var(--radius-sm)] p-4 border border-[var(--border-default)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)] text-[13px]">Invoice</span>
                    <span className="font-medium text-[13px]">{selectedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)] text-[13px]">Milestone</span>
                    <span className="font-medium text-[13px]">{milestoneLabel(selectedInvoice.milestoneId)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)] mt-1">
                    <span className="font-bold text-[13px]">Total Amount</span>
                    <span className="font-bold text-[20px] text-[var(--accent)]">{fmt(selectedInvoice.total)}</span>
                  </div>
                </div>

                {/* Payment method tabs */}
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
                  <div>
                    <label className="caption block mb-2">Select Your Bank</label>
                    <select className="CODEVATE-input w-full">
                      <option value="">Select bank…</option>
                      {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Yes Bank', 'Bank of Baroda'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {payMethod === 'Wallets' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'PhonePe', color: '#5f259f', icon: '📱' },
                      { name: 'Google Pay', color: '#4285F4', icon: '🔵' },
                      { name: 'Paytm', color: '#00BAF2', icon: '💙' },
                    ].map(w => (
                      <button key={w.name} type="button"
                        className="flex flex-col items-center gap-2 p-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[16px] text-white" style={{ background: w.color }}>
                          {w.name[0]}
                        </div>
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">{w.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={handlePay}
                  className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full text-[15px] font-semibold mt-2">
                  Pay {fmt(selectedInvoice.total)}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

