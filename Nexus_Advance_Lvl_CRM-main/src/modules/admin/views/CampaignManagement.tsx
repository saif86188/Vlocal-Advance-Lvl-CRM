import { useState } from "react";
import { Plus, Calendar, Target, DollarSign, MoreVertical, Filter } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    client: "Acme Corp",
    type: "Product Launch",
    status: "Active",
    progress: 75,
    budget: "$25,000",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    team: 5,
  },
  {
    id: 2,
    name: "Brand Awareness Q2",
    client: "TechStart Inc",
    type: "Brand Awareness",
    status: "Active",
    progress: 45,
    budget: "$15,000",
    startDate: "2026-04-15",
    endDate: "2026-07-15",
    team: 3,
  },
  {
    id: 3,
    name: "Holiday Season Promo",
    client: "Retail Plus",
    type: "Promotional",
    status: "Planning",
    progress: 20,
    budget: "$50,000",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    team: 8,
  },
  {
    id: 4,
    name: "Social Media Boost",
    client: "Fashion Hub",
    type: "Social Media",
    status: "Active",
    progress: 60,
    budget: "$8,000",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    team: 4,
  },
  {
    id: 5,
    name: "Market Expansion",
    client: "Global Brands Ltd",
    type: "Market Research",
    status: "Completed",
    progress: 100,
    budget: "$30,000",
    startDate: "2026-01-15",
    endDate: "2026-04-30",
    team: 6,
  },
];

export function CampaignManagement() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium">Campaign Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">Create and manage marketing campaigns</p>
        </div>
        <button className="vlocal-btn bg-[var(--accent)] text-neutral-900 shadow-sm hover:scale-[1.02] border border-neutral-900">
          <Plus className="w-5 h-5 mr-1" />
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-[var(--card-padding)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-[var(--accent)] text-neutral-900 font-medium rounded-lg shadow-sm border border-neutral-900/10">All</button>
            <button className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] font-medium rounded-lg transition">Active</button>
            <button className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] font-medium rounded-lg transition">Planning</button>
            <button className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] font-medium rounded-lg transition">Completed</button>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-hover)] transition font-medium">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Total Campaigns</p>
          <p className="metric-number text-3xl mt-1">24</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Active</p>
          <p className="metric-number text-3xl mt-1 text-[var(--success)]">12</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Planning</p>
          <p className="metric-number text-3xl mt-1 text-[var(--warning)]">5</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Total Budget</p>
          <p className="metric-number text-3xl mt-1 text-[var(--info)]">$128k</p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--gap-card)]">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="glass-card hover:border-[var(--border-default)] transition-all group">
            <div className="p-[var(--card-padding)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)]">{campaign.client}</p>
                </div>
                <button className="p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Target className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{campaign.type}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{campaign.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Progress</span>
                  <span className="font-medium">{campaign.progress}%</span>
                </div>
                <div className="bg-[var(--bg-hover)] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      campaign.progress === 100 ? "bg-[var(--success)]" : "bg-[var(--accent)]"
                    }`}
                    style={{ width: `${campaign.progress}%`, boxShadow: campaign.progress < 100 ? '0 0 8px var(--accent-glow)' : 'none' }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    campaign.status === "Active"
                      ? "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]"
                      : campaign.status === "Planning"
                      ? "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]"
                      : "bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-default)]"
                  }`}
                >
                  {campaign.status}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(campaign.team, 3))].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full flex items-center justify-center z-10 relative"
                      >
                        <span className="text-[10px] font-bold text-neutral-600">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {campaign.team > 3 && (
                    <span className="text-[11px] text-[var(--text-secondary)] ml-1 font-medium">+{campaign.team - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
