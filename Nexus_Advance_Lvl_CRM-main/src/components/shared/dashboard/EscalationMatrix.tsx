'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Mail, Phone, Clock, ArrowUpRight, 
  CheckCircle, MessageSquare, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  level: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  sla: string;
  scope: string[];
  color: string;
  borderColor: string;
}

const escalationPath: Contact[] = [
  {
    level: "Level 1: Incident Coordinator",
    name: "David Chen",
    role: "Campaign Support Lead",
    email: "david.chen@CODEVATE.com",
    phone: "+1 (555) 234-5678",
    avatar: "DC",
    sla: "2 Hours SLA",
    scope: ["Campaign delivery issues", "Creative asset updates", "Reporting discrepancies"],
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600",
    borderColor: "border-blue-100",
  },
  {
    level: "Level 2: Operations Lead",
    name: "Priya Shah",
    role: "Senior Operations Director",
    email: "priya@CODEVATE.com",
    phone: "+1 (555) 345-6789",
    avatar: "PS",
    sla: "4 Hours SLA",
    scope: ["Budget re-allocation", "Timeline delays", "Resource conflicts"],
    color: "from-amber-500/10 to-orange-500/10 text-amber-600",
    borderColor: "border-amber-100",
  },
  {
    level: "Level 3: Executive Sponsor",
    name: "saif",
    role: "VP of Client Operations",
    email: "saif@CODEVATE.com",
    phone: "+1 (555) 456-7890",
    avatar: "S",
    sla: "8 Hours SLA",
    scope: ["Strategic misalignment", "Contract negotiations", "System outages"],
    color: "from-rose-500/10 to-red-500/10 text-rose-600",
    borderColor: "border-rose-100",
  }
];

export function EscalationMatrix() {
  const [selectedLevel, setSelectedLevel] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({
    subject: '',
    description: '',
    level: 'Level 1: Incident Coordinator',
  });

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.subject.trim() || !issueForm.description.trim()) {
      toast.error('Please fill in all details');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedIssue(true);
      toast.success('Escalation Request Lodged Successfully!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 pb-16 relative">
      {/* Immersive Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="space-y-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-900 rounded-[16px] flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">
            Escalation Matrix
          </h1>
        </div>
        <p className="text-sm font-bold text-neutral-400 max-w-2xl leading-relaxed uppercase tracking-widest">
          Transparent SLA paths and executive touchpoints. Click on any contact level to view details.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        
        {/* Left Side: Levels list */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {escalationPath.map((item, idx) => {
            const isSelected = selectedLevel?.level === item.level;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedLevel(item)}
                className={`glass-card p-6 md:p-8 rounded-[32px] border ${
                  isSelected ? 'border-neutral-900 shadow-2xl bg-white/80' : `${item.borderColor} shadow-lg hover:shadow-xl bg-white/40`
                } cursor-pointer transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center font-display font-black text-xl shadow-inner shrink-0`}>
                    {item.avatar}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{item.level}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-950 text-[var(--accent)] tracking-wider">
                        {item.sla}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-neutral-900 leading-tight">{item.name}</h3>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">View SLA Scope</span>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:scale-110 transition">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Active Level Details & Form */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {selectedLevel ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-8 rounded-[40px] border border-white bg-white/80 shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-500">SLA Scope Details</span>
                    <h3 className="text-2xl font-display font-bold text-neutral-900 leading-tight">{selectedLevel.name}</h3>
                    <p className="text-xs font-semibold text-neutral-400 uppercase">{selectedLevel.role}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedLevel(null)}
                    className="text-[10px] font-bold text-neutral-400 hover:text-neutral-900 uppercase tracking-widest"
                  >
                    Clear
                  </button>
                </div>

                <div className="h-px bg-neutral-200/50" />

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Responsible Area</h4>
                  <ul className="space-y-2">
                    {selectedLevel.scope.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px bg-neutral-200/50" />

                <div className="flex flex-col gap-3">
                  <a 
                    href={`mailto:${selectedLevel.email}`} 
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition text-xs font-bold text-neutral-700"
                  >
                    <Mail size={16} className="text-rose-500" />
                    {selectedLevel.email}
                  </a>
                  <a 
                    href={`tel:${selectedLevel.phone}`} 
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition text-xs font-bold text-neutral-700"
                  >
                    <Phone size={16} className="text-blue-500" />
                    {selectedLevel.phone}
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 rounded-[40px] border border-white bg-white/40 shadow-xl text-center py-12 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-900 uppercase">Operational Safety</h3>
                <p className="text-xs font-semibold text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Select an escalation contact level from the left to view active SLAs, contacts, and responsibilities.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SLA Lodging Form */}
          <div className="glass-card p-8 rounded-[40px] border border-white bg-white/60 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-neutral-900 uppercase tracking-tight">Escalate Issue</h3>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Lodge an official SLA intervention request</p>
            </div>

            {submittedIssue ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 text-center space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <CheckCircle size={20} />
                </div>
                <h4 className="text-sm font-display font-bold text-emerald-900 uppercase">Escalation Lodged</h4>
                <p className="text-[10px] font-bold text-emerald-700/80 leading-relaxed uppercase">
                  Our systems have auto-routed this query to the selected support team. Response will be logged under the Support tab.
                </p>
                <button 
                  onClick={() => {
                    setSubmittedIssue(false);
                    setIssueForm({ subject: '', description: '', level: 'Level 1: Incident Coordinator' });
                  }}
                  className="text-[9px] font-black text-emerald-800 uppercase hover:underline"
                >
                  Lodge another escalation
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleEscalationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Escalation Level</label>
                  <select 
                    value={issueForm.level}
                    onChange={(e) => setIssueForm({ ...issueForm, level: e.target.value })}
                    className="CODEVATE-input w-full bg-white/80 border-neutral-100 rounded-xl"
                  >
                    {escalationPath.map((item, idx) => (
                      <option key={idx} value={item.level}>{item.level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Short description of emergency..."
                    value={issueForm.subject}
                    onChange={(e) => setIssueForm({ ...issueForm, subject: e.target.value })}
                    className="CODEVATE-input w-full bg-white/80 border-neutral-100 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Issue Description</label>
                  <textarea 
                    placeholder="Provide details on the timeline, budget impact, or technical roadblocks..."
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    className="CODEVATE-input w-full bg-white/80 border-neutral-100 rounded-xl min-h-[90px] py-3.5"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="CODEVATE-btn w-full bg-neutral-900 text-white font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Lodging Request...' : 'Trigger Escalation'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
