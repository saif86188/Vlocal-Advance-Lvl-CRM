import { BarChart, Download, Calendar, TrendingUp, PieChart, Activity } from "lucide-react";

const performanceData = [
  { month: "Jan", campaigns: 12, revenue: 42000, activities: 234 },
  { month: "Feb", campaigns: 15, revenue: 48000, activities: 289 },
  { month: "Mar", campaigns: 18, revenue: 52000, activities: 312 },
  { month: "Apr", campaigns: 20, revenue: 58000, activities: 345 },
  { month: "May", campaigns: 24, revenue: 48200, activities: 298 },
];

const topCampaigns = [
  { name: "Summer Product Launch", roi: "245%", revenue: "$25,000", status: "Active" },
  { name: "Brand Awareness Q2", roi: "198%", revenue: "$18,500", status: "Active" },
  { name: "Holiday Season Promo", roi: "187%", revenue: "$32,000", status: "Planning" },
  { name: "Social Media Boost", roi: "156%", revenue: "$12,400", status: "Active" },
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium">Reports & Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="vlocal-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] bg-white/50 text-[var(--text-primary)]">
            <Calendar className="w-5 h-5 mr-1" />
            Date Range
          </button>
          <button className="vlocal-btn bg-[var(--accent)] text-neutral-900 shadow-sm hover:scale-[1.02] border border-neutral-900">
            <Download className="w-5 h-5 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <div className="flex items-center justify-between mb-2">
            <p className="caption">Total Revenue</p>
            <div className="w-10 h-10 bg-[var(--success-dim)] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--success)]" />
            </div>
          </div>
          <p className="metric-number text-3xl">$248.7k</p>
          <p className="text-[13px] text-[var(--success)] font-medium mt-1">+18.2% from last month</p>
        </div>

        <div className="glass-card p-[var(--card-padding)]">
          <div className="flex items-center justify-between mb-2">
            <p className="caption">Avg ROI</p>
            <div className="w-10 h-10 bg-[var(--info-dim)] rounded-lg flex items-center justify-center">
              <BarChart className="w-5 h-5 text-[var(--info)]" />
            </div>
          </div>
          <p className="metric-number text-3xl">196.5%</p>
          <p className="text-[13px] text-[var(--info)] font-medium mt-1">+12.3% improvement</p>
        </div>

        <div className="glass-card p-[var(--card-padding)]">
          <div className="flex items-center justify-between mb-2">
            <p className="caption">Campaign Success</p>
            <div className="w-10 h-10 bg-purple-100/50 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="metric-number text-3xl">87.5%</p>
          <p className="text-[13px] text-purple-600 font-medium mt-1">Above target</p>
        </div>

        <div className="glass-card p-[var(--card-padding)]">
          <div className="flex items-center justify-between mb-2">
            <p className="caption">Field Activities</p>
            <div className="w-10 h-10 bg-[var(--warning-dim)] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--warning)]" />
            </div>
          </div>
          <p className="metric-number text-3xl">1,478</p>
          <p className="text-[13px] text-[var(--warning)] font-medium mt-1">+23% increase</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--gap-card)]">
        {/* Revenue Chart */}
        <div className="glass-card">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-lg font-display font-medium">Revenue Trend</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between gap-3">
              {performanceData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[var(--bg-hover)] rounded-t-lg hover:bg-[var(--border-default)] transition cursor-pointer relative group">
                    <div
                      className="w-full bg-[var(--accent)] rounded-t-lg"
                      style={{ height: `${(data.revenue / 60000) * 240}px`, boxShadow: '0 0 8px var(--accent-glow)' }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      ${(data.revenue / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="glass-card">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-lg font-display font-medium">Campaign Activity</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between gap-3">
              {performanceData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-[var(--info)] rounded-t-lg hover:bg-blue-600 transition cursor-pointer"
                      style={{ height: `${(data.campaigns / 25) * 100}px` }}
                    />
                    <div
                      className="w-full bg-[var(--success)] rounded-t-lg hover:bg-green-600 transition cursor-pointer"
                      style={{ height: `${(data.activities / 350) * 100}px` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--info)] rounded"></div>
                <span className="text-sm text-[var(--text-secondary)]">Campaigns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--success)] rounded"></div>
                <span className="text-sm text-[var(--text-secondary)]">Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Campaigns */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-display font-medium">Top Performing Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {topCampaigns.map((campaign, index) => (
                <tr key={index} className="hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--accent-glow)] rounded-lg flex items-center justify-center">
                        <span className="text-[var(--accent)] font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium text-[14px]">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--success)] font-semibold">{campaign.roi}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{campaign.revenue}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      campaign.status === "Active" ? "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]" : "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]"
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
