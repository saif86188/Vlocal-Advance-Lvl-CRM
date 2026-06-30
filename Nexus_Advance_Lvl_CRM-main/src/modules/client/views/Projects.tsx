import { useClientStore } from '@/modules/client/data/store';
import { Download, CheckCircle, Circle } from 'lucide-react';

export function Projects() {
  const { state } = useClientStore();

  if (state.projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center">
        <div className="text-[32px] mb-2">🚀</div>
        <h2 className="text-[18px] font-semibold">No active projects yet</h2>
        <p className="text-[var(--text-secondary)] text-[13px] mt-1">Projects appear once a proposal is approved and work begins.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--gap-section)] @container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-gray-900">My Projects</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.projects.map(project => {
          const spent = 65000;
          const total = 125000;
          const spentPct = Math.round((spent / total) * 100);
          const activePhase = project.phases[project.currentPhaseIndex];

          return (
            <div key={project.id} className="glass-card overflow-hidden shadow-sm">
              {/* Header */}
              <div className="p-5 border-b border-[var(--border-subtle)] bg-white/50 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-display font-semibold mb-2">Brand Identity + Website</h2>
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
                    <span>Est. end: <span className="font-semibold text-gray-700">{new Date(project.estimatedEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></span>
                  </div>
                </div>
                <div className="text-left sm:text-right bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Start Date</div>
                  <div className="font-medium text-sm text-gray-900">{new Date(project.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
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
                          {p.status === 'done' && <div className="absolute inset-0 bg-[var(--success)] transition-all duration-700" />}
                          {p.status === 'active' && (
                            <div className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-700"
                              style={{ width: `${p.progressPercent}%`, boxShadow: '0 0 10px var(--accent-glow)' }} />
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
                    <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-3">Budget Used</h3>
                    <div className="text-sm text-[var(--text-secondary)] mb-2 font-medium">
                      <span className="text-gray-900 font-bold">₹{new Intl.NumberFormat('en-IN').format(spent)}</span> of ₹{new Intl.NumberFormat('en-IN').format(total)}
                    </div>
                    <div className="w-full h-2.5 bg-[var(--bg-hover)] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[var(--warning)] transition-all duration-700" style={{ width: `${spentPct}%` }} />
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">{spentPct}% utilized</div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="p-5 lg:p-6 bg-white/20">
                  <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4">Milestones</h3>
                  <div className="flex flex-col gap-4">
                    {project.milestoneChecklist.map((m, i) => (
                      <div key={m.id} className="flex items-start gap-3">
                        {m.completedAt
                          ? <CheckCircle size={18} className="text-[var(--success)] shrink-0 mt-0.5" />
                          : i === project.currentPhaseIndex + 1
                            ? <div className="w-4.5 h-4.5 rounded-full border-2 border-[var(--accent)] shrink-0 mt-0.5 animate-pulse" />
                            : <Circle size={18} className="text-[var(--border-strong)] shrink-0 mt-0.5" />
                        }
                        <div>
                          <div className={`text-sm transition-colors ${
                            m.completedAt ? 'text-[var(--text-primary)] font-medium line-through decoration-gray-300' :
                            i === project.currentPhaseIndex + 1 ? 'text-[var(--accent)] font-semibold' :
                            'text-[var(--text-secondary)] font-medium'
                          }`}>
                            {m.label}
                            {!m.completedAt && i === project.currentPhaseIndex + 1 && <span className="text-xs text-[var(--accent)] ml-2 inline-block">← In Progress</span>}
                          </div>
                          {m.completedAt && <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{new Date(m.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="p-5 lg:p-6 bg-white/30">
                  <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4">Deliverables</h3>
                  <div className="flex flex-col gap-3">
                    {project.deliverables.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-default)] bg-white hover:border-[var(--border-strong)] hover:shadow-sm transition-all group">
                        <div className="overflow-hidden pr-2">
                          <div className="text-sm font-semibold truncate text-gray-800">{d.label}</div>
                          <div className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">Uploaded by VLOCAL • {new Date(d.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        </div>
                        <button className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors ml-2 shrink-0 p-2 rounded-lg hover:bg-gray-50">
                          <Download size={18} />
                        </button>
                      </div>
                    ))}
                    {project.deliverables.length === 0 && (
                      <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No deliverables uploaded yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

