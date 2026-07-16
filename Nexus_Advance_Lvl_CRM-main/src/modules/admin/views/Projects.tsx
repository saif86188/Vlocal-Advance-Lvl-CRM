import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { Download, CheckCircle, Circle, Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export function Projects() {
  const { state, dispatch } = useAdminStore();
  const [uploadPanel, setUploadPanel] = useState<{ projectId: string } | null>(null);
  const [uploadName, setUploadName] = useState('');

  const handleMarkMilestone = (projectId: string, milestoneId: string, label: string) => {
    dispatch({ type: 'MARK_MILESTONE_DONE', payload: { projectId, milestoneId } });
    toast.success(`Milestone "${label}" marked complete!`);
  };

  const handleUpload = (projectId: string) => {
    if (!uploadName.trim()) return;
    dispatch({
      type: 'ADD_DELIVERABLE',
      payload: {
        projectId,
        deliverable: {
          id: `d-${Date.now()}`,
          label: uploadName,
          fileUrl: '#',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Admin',
        },
      },
    });
    toast.success(`Deliverable "${uploadName}" uploaded!`);
    setUploadPanel(null);
    setUploadName('');
  };

  return (
    <div className="flex flex-col gap-[var(--gap-section)] @container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-gray-900">Active Campaigns</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.projects.map(project => {
          const spent = project.milestoneChecklist?.reduce((s: number, m: any) => m?.status === 'paid' ? s + (m.amount || 0) : s, 0) ?? 65000;
          const total = 125000;
          const spentPercent = Math.round((spent / total) * 100);
          const activePhase = project.phases[project.currentPhaseIndex];
          const completedMilestones = project.milestoneChecklist.filter(m => m.completedAt).length;
          const totalMilestones = project.milestoneChecklist.length;

          return (
            <div key={project.id} className="glass-card overflow-hidden shadow-sm">
              {/* Project Header */}
              <div className="p-5 border-b border-[var(--border-subtle)] bg-white/50 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-display font-semibold mb-2">
                    Brand Identity + Website
                    <span className="text-sm font-normal text-[var(--text-secondary)] ml-3 bg-gray-100 px-2 py-1 rounded-md">Apex Corp</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--accent)] font-medium bg-[var(--accent-glow)] px-2 py-1 rounded-md">Phase: {activePhase?.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-28 h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--accent)] transition-all duration-700"
                          style={{ width: `${activePhase?.progressPercent || 0}%`, boxShadow: '0 0 8px var(--accent-glow)' }} />
                      </div>
                      <span className="font-semibold text-gray-700">{activePhase?.progressPercent}%</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Est. end: <span className="font-semibold text-gray-700">{new Date(project.estimatedEnd).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</span></span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-[var(--success)] font-medium">{completedMilestones}/{totalMilestones} milestones done</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setUploadPanel({ projectId: project.id })}
                    className="CODEVATE-btn-sm border border-[var(--border-default)] hover:bg-[var(--bg-hover)] flex items-center gap-1.5 shadow-sm bg-white">
                    <Upload size={14} /> Upload
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
                {/* Phase Tracker */}
                <div className="p-5 lg:p-6 bg-white/30">
                  <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4">Phase Tracker</h3>
                  <div className="flex flex-col gap-4">
                    {project.phases.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-24 text-sm font-medium text-[var(--text-secondary)] shrink-0 truncate" title={p.name}>{p.name}</div>
                        <div className="flex-1 h-2.5 bg-[var(--bg-hover)] rounded-full overflow-hidden relative shadow-inner">
                          {p.status === 'done' && <div className="absolute inset-0 bg-[var(--success)]" style={{ transition: 'width 0.6s ease' }} />}
                          {p.status === 'active' && (
                            <div className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-700"
                              style={{ width: `${p.progressPercent}%`, boxShadow: '0 0 12px var(--accent-glow)' }} />
                          )}
                        </div>
                        <div className="w-12 text-right text-xs font-semibold text-[var(--text-secondary)]">
                          {p.status === 'done' ? '100%' : p.status === 'active' ? `${p.progressPercent}%` : '0%'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Budget */}
                  <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
                    <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-3">Budget</h3>
                    <div className="text-sm text-[var(--text-secondary)] mb-2 font-medium">
                      <span className="text-gray-900 font-bold">₹{new Intl.NumberFormat('en-IN').format(spent)}</span> spent of ₹{new Intl.NumberFormat('en-IN').format(total)}
                    </div>
                    <div className="w-full h-2.5 bg-[var(--bg-hover)] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[var(--warning)] transition-all duration-700"
                        style={{ width: `${spentPercent}%` }} />
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">{spentPercent}% utilized</div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="p-5 lg:p-6 bg-white/20">
                  <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4">Milestones</h3>
                  <div className="flex flex-col gap-4">
                    {project.milestoneChecklist.map((m, i) => (
                      <div key={m.id} className="flex items-start gap-3 group cursor-pointer"
                        onClick={() => !m.completedAt && handleMarkMilestone(project.id, m.id, m.label)}>
                        {m.completedAt ? (
                          <CheckCircle size={18} className="text-[var(--success)] shrink-0 mt-0.5" />
                        ) : i === project.currentPhaseIndex + 1 ? (
                          <div className="w-4.5 h-4.5 rounded-full border-2 border-[var(--accent)] shrink-0 mt-0.5 group-hover:bg-[var(--accent)] transition-colors animate-pulse" />
                        ) : (
                          <Circle size={18} className="text-[var(--border-strong)] shrink-0 mt-0.5 group-hover:text-[var(--success)] transition-colors" />
                        )}
                        <div>
                          <div className={`text-sm transition-colors ${
                            m.completedAt ? 'text-[var(--text-primary)] font-medium line-through decoration-gray-300' :
                            i === project.currentPhaseIndex + 1 ? 'text-[var(--accent)] font-semibold' :
                            'text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)]'
                          }`}>
                            {m.label}
                            {!m.completedAt && <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 ml-2 transition-opacity inline-block">Click to complete</span>}
                          </div>
                          {m.completedAt && (
                            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                              {new Date(m.completedAt).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="p-5 lg:p-6 bg-white/30">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Deliverables</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {project.deliverables.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-default)] bg-white hover:border-[var(--border-strong)] hover:shadow-sm transition-all group">
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold truncate text-gray-800">{d.label}</div>
                          <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                            {new Date(d.uploadedAt).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}
                          </div>
                        </div>
                        <button className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors ml-3 shrink-0 p-2 rounded-lg hover:bg-gray-50">
                          <Download size={18} />
                        </button>
                      </div>
                    ))}
                    {project.deliverables.length === 0 && (
                      <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No deliverables yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {state.projects.length === 0 && (
          <div className="glass-card p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚀</span>
            </div>
            <div className="font-semibold text-lg text-gray-900">No active projects yet</div>
            <div className="text-sm text-[var(--text-muted)] mt-2">Projects appear after a proposal is approved</div>
          </div>
        )}
      </div>

      {/* Upload Slide-over */}
      {uploadPanel && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setUploadPanel(null)}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] w-full max-w-[420px] shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <h3 className="font-display font-semibold text-lg">Upload Deliverable</h3>
                <button onClick={() => setUploadPanel(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="caption block mb-2 font-semibold">File Name / Label</label>
                  <input className="CODEVATE-input w-full shadow-sm" placeholder="e.g. logo-final-v3.fig" value={uploadName} onChange={e => setUploadName(e.target.value)} />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent)] cursor-pointer transition-all">
                  <Upload size={32} className="mb-3 text-gray-400" />
                  <span className="text-sm font-medium">Drop file or click to browse</span>
                </div>
                <button onClick={() => handleUpload(uploadPanel.projectId)}
                  className="CODEVATE-btn bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full h-12 text-base font-semibold shadow-md shadow-[var(--accent-glow)] mt-2">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

