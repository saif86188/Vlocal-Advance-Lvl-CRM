'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { Plus, Trash2, X, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Phase { id: string; name: string; description: string; durationDays: number; }
interface Milestone { id: string; name: string; dueDate: string; amount: number; }
const SCOPE_OPTIONS = ['UI Design', 'Development', 'SEO', 'Branding', 'Content', 'Marketing'];
const DELIVERABLE_SUGGESTIONS = ['Figma source files', 'Source code repo', 'SEO audit report', 'Production deployment', 'Brand guidelines'];

let idCounter = 1000;
const uid = () => `gen-${++idCounter}`;

export function ProposalBuilder() {
  const { state, dispatch } = useAdminStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reqId = searchParams.get('req');
  const req = state.requirements.find(r => r.id === reqId);
  
  const clientName = req?.clientId === 'u-1' ? 'Apex Corp' : req?.clientId === 'u-2' ? 'Nova Tech' : 'Client';

  // Form state
  const [scope, setScope] = useState<string[]>(['UI Design', 'Development', 'SEO', 'Branding']);
  const [otherScope, setOtherScope] = useState('');
  const [showOther, setShowOther] = useState(false);
  const [phases, setPhases] = useState<Phase[]>([
    { id: uid(), name: 'Discovery', description: 'Initial research and scoping', durationDays: 7 },
    { id: uid(), name: 'Design', description: 'Figma prototypes and brand identity', durationDays: 14 },
    { id: uid(), name: 'Development', description: 'React implementation', durationDays: 21 },
    { id: uid(), name: 'QA', description: 'Testing and bug fixes', durationDays: 5 },
    { id: uid(), name: 'Launch', description: 'Deployment', durationDays: 2 },
  ]);
  const [startDate, setStartDate] = useState('2025-05-10');
  const [deliverables, setDeliverables] = useState<string[]>(['Figma source files', 'Source code repo', 'SEO audit report', 'Production deployment']);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: uid(), name: 'Kickoff', dueDate: '2025-05-10', amount: 25000 },
    { id: uid(), name: 'Design Delivery', dueDate: '2025-06-20', amount: 40000 },
    { id: uid(), name: 'Development', dueDate: '2025-07-15', amount: 45000 },
    { id: uid(), name: 'Final Launch', dueDate: '2025-07-25', amount: 15000 },
  ]);
  const [taxPercent, setTaxPercent] = useState(18);
  const [assumptions, setAssumptions] = useState('Client provides all copy and raw images. 3 revision rounds included.');
  const [exclusions, setExclusions] = useState('Hosting, domains, and paid fonts are excluded.');
  const [supportDuration, setSupportDuration] = useState('30 days post-launch');
  const [sent, setSent] = useState(false);

  const totalDays = phases.reduce((s, p) => s + p.durationDays, 0);
  const estimatedEnd = useMemo(() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + totalDays);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [startDate, totalDays]);

  const subtotal = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const taxAmount = Math.round(subtotal * taxPercent / 100);
  const grandTotal = subtotal + taxAmount;

  const fmt = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

  const addPhase = () => setPhases(p => [...p, { id: uid(), name: '', description: '', durationDays: 7 }]);
  const removePhase = (id: string) => setPhases(p => p.filter(ph => ph.id !== id));
  const updatePhase = (id: string, key: keyof Phase, val: any) =>
    setPhases(p => p.map(ph => ph.id === id ? { ...ph, [key]: val } : ph));

  const addMilestone = () => setMilestones(m => [...m, { id: uid(), name: '', dueDate: '', amount: 0 }]);
  const removeMilestone = (id: string) => setMilestones(m => m.filter(ms => ms.id !== id));
  const updateMilestone = (id: string, key: keyof Milestone, val: any) =>
    setMilestones(m => m.map(ms => ms.id === id ? { ...ms, [key]: val } : ms));

  const addDeliverable = (val: string) => {
    if (val.trim() && !deliverables.includes(val.trim())) {
      setDeliverables(d => [...d, val.trim()]);
    }
    setDeliverableInput('');
  };

  const existingPropsForReq = state.proposals.filter(p => p.requirementId === reqId).length;
  const nextVersion = existingPropsForReq + 1;

  const handleSend = () => {
    const newProp: any = {
      id: `prop-${reqId || 'new'}-v${nextVersion}-${Date.now()}`,
      requirementId: reqId || 'req-new',
      clientId: req?.clientId || 'u-1',
      version: nextVersion,
      scope: [...scope, ...(showOther && otherScope ? [otherScope] : [])],
      phases: phases.map((p, i) => ({ ...p, order: i + 1 })),
      deliverables,
      milestones: milestones.map(m => ({ ...m, status: 'pending' })),
      subtotal,
      taxPercent,
      taxAmount,
      totalCost: grandTotal,
      assumptions,
      exclusions,
      supportDuration,
      status: 'awaiting_approval',
      sentAt: new Date().toISOString(),
      teamMembers: [],
    };
    dispatch({ type: 'ADD_PROPOSAL', payload: newProp });
    setSent(true);
    toast.success(`Proposal V${nextVersion} sent to ${clientName}! Previous versions archived.`);
    setTimeout(() => router.push('/proposals'), 2000);
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved successfully.');
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 py-24">
        <div className="w-16 h-16 rounded-full bg-[var(--success-dim)] border border-[var(--success)] flex items-center justify-center">
          <CheckCircle size={32} className="text-[var(--success)]" />
        </div>
        <h2 className="text-[22px] font-semibold">Proposal Sent!</h2>
        <p className="text-[var(--text-secondary)] text-[13px]">Redirecting to proposals list…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--gap-section)] pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1>Proposal Builder</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {req ? `Client: ${clientName} • Requirement: ${req.title}` : 'New Proposal'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#F5A62333] text-[#F5A623]">Draft V{nextVersion}</span>
        </div>
      </div>

      <form className="flex flex-col gap-[var(--gap-section)] max-w-[800px] mx-auto w-full">
        {/* 1. Scope */}
        <div className="glass-card p-6">
          <h2 className="section-heading mb-4">1. Scope</h2>
          <div className="grid grid-cols-3 gap-3">
            {SCOPE_OPTIONS.map(s => (
              <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer hover:text-[var(--accent)] transition-colors">
                <input type="checkbox" checked={scope.includes(s)}
                  onChange={e => setScope(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s))}
                  className="accent-[var(--accent)]" />
                {s}
              </label>
            ))}
            <label className="flex items-center gap-2 text-[13px] cursor-pointer hover:text-[var(--accent)] transition-colors">
              <input type="checkbox" checked={showOther} onChange={e => setShowOther(e.target.checked)} className="accent-[var(--accent)]" />
              Other
            </label>
          </div>
          {showOther && (
            <input type="text" className="CODEVATE-input w-full mt-3" placeholder="Specify other scope..."
              value={otherScope} onChange={e => setOtherScope(e.target.value)} />
          )}
        </div>

        {/* 2. Phases */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-heading">2. Phases</h2>
            <button type="button" onClick={addPhase}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-[12px] font-medium flex items-center gap-1">
              <Plus size={14} /> Add Phase
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {phases.map((p, i) => (
              <div key={p.id} className="flex gap-3 items-center bg-[var(--bg-elevated)] p-3 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                <span className="text-[11px] text-[var(--text-muted)] w-5 shrink-0">{i + 1}</span>
                <input type="text" value={p.name} onChange={e => updatePhase(p.id, 'name', e.target.value)}
                  className="CODEVATE-input flex-1" placeholder="Phase name" />
                <input type="text" value={p.description} onChange={e => updatePhase(p.id, 'description', e.target.value)}
                  className="CODEVATE-input flex-1" placeholder="Description" />
                <div className="flex items-center gap-1">
                  <input type="number" value={p.durationDays} onChange={e => updatePhase(p.id, 'durationDays', Number(e.target.value))}
                    className="CODEVATE-input w-16 text-center" placeholder="Days" />
                  <span className="text-[11px] text-[var(--text-muted)]">d</span>
                </div>
                <button type="button" onClick={() => removePhase(p.id)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Timeline */}
        <div className="glass-card p-6">
          <h2 className="section-heading mb-4">3. Timeline</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="caption block mb-2">Project Start Date</label>
              <input type="date" className="CODEVATE-input w-full" value={startDate}
                onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col justify-center bg-[var(--info-dim)] border border-[var(--info)] rounded-[var(--radius-sm)] p-4">
              <div className="text-[13px] text-[var(--info)]">Total duration: {totalDays} days</div>
              <div className="font-bold text-[15px] text-[var(--info)] mt-1">Estimated delivery: {estimatedEnd}</div>
            </div>
          </div>
        </div>

        {/* 4. Deliverables */}
        <div className="glass-card p-6">
          <h2 className="section-heading mb-4">4. Deliverables</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" className="CODEVATE-input flex-1" placeholder="Type and press Enter to add..."
              value={deliverableInput}
              onChange={e => setDeliverableInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(deliverableInput); } }}
            />
            <button type="button" onClick={() => addDeliverable(deliverableInput)}
              className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {deliverables.map(d => (
              <div key={d} className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-hover)] border border-[var(--border-strong)] text-[13px] flex items-center gap-2">
                {d}
                <button type="button" onClick={() => setDeliverables(prev => prev.filter(x => x !== d))}>
                  <X size={12} className="text-[var(--text-muted)] hover:text-[var(--danger)]" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {DELIVERABLE_SUGGESTIONS.filter(s => !deliverables.includes(s)).map(s => (
              <button key={s} type="button" onClick={() => addDeliverable(s)}
                className="px-2.5 py-1 text-[11px] border border-dashed border-[var(--border-strong)] rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Milestones & Pricing */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-heading">5. Milestones & Pricing</h2>
            <button type="button" onClick={addMilestone}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-[12px] font-medium flex items-center gap-1">
              <Plus size={14} /> Add Milestone
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-6">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex gap-3 items-center bg-[var(--bg-elevated)] p-3 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                <span className="text-[11px] text-[var(--text-muted)] w-5 shrink-0">M{i+1}</span>
                <input type="text" value={m.name} onChange={e => updateMilestone(m.id, 'name', e.target.value)}
                  className="CODEVATE-input flex-1" placeholder="Milestone name" />
                <input type="date" value={m.dueDate} onChange={e => updateMilestone(m.id, 'dueDate', e.target.value)}
                  className="CODEVATE-input w-36" />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-[13px]">₹</span>
                  <input type="number" value={m.amount} onChange={e => updateMilestone(m.id, 'amount', Number(e.target.value))}
                    className="CODEVATE-input w-full pl-7" />
                </div>
                <button type="button" onClick={() => removeMilestone(m.id)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
            <div className="w-64">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[var(--text-secondary)]">Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[var(--text-secondary)] flex items-center gap-2">
                  Tax
                  <input type="number" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))}
                    className="w-12 h-6 bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-center text-[12px] rounded" />
                  %
                </span>
                <span className="font-medium">{fmt(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-[var(--border-subtle)]">
                <span className="font-bold">Grand Total</span>
                <span className="font-bold text-[18px] text-[var(--accent)]">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Notes */}
        <div className="glass-card p-6">
          <h2 className="section-heading mb-4">6. Notes</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="caption block mb-1">Assumptions</label>
              <textarea className="CODEVATE-input py-2 min-h-[60px] resize-none w-full" value={assumptions}
                onChange={e => setAssumptions(e.target.value)} />
            </div>
            <div>
              <label className="caption block mb-1">Exclusions</label>
              <textarea className="CODEVATE-input py-2 min-h-[60px] resize-none w-full" value={exclusions}
                onChange={e => setExclusions(e.target.value)} />
            </div>
            <div>
              <label className="caption block mb-1">Support Duration</label>
              <input type="text" className="CODEVATE-input w-full" value={supportDuration}
                onChange={e => setSupportDuration(e.target.value)} />
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Tactical Dock */}
      <div className="fixed bottom-10 left-0 right-0 px-10 z-50 pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto h-24 bg-white/60 backdrop-blur-3xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.15)] rounded-[32px] px-10 flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">System State</span>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-bold text-neutral-900">Proposal Version: <span className="text-amber-600">V{nextVersion}</span></span>
               </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSaveDraft} 
              type="button"
              className="px-8 py-4 border border-neutral-200 rounded-2xl text-xs font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
            >
              Save Draft
            </button>
            <button 
              onClick={handleSend} 
              type="button"
              className="px-10 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Send to Client
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

