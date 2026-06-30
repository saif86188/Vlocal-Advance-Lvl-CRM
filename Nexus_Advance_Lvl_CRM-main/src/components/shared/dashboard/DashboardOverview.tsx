import { motion } from "motion/react";
import { TrendingUp, DollarSign, Target, Clock, AlertCircle, CheckCircle2, Play } from "lucide-react";
import { Progress } from "../ui/progress";

export function DashboardOverview() {
  const stats = [
    {
      title: "My Campaigns",
      value: "8",
      change: "+2 this month",
      icon: Play,
      gradient: "from-[var(--accent)] to-[var(--accent-hover)] shadow-md",
    },
    {
      title: "Total Budget",
      value: "$245,000",
      change: "Across all campaigns",
      icon: DollarSign,
      gradient: "from-[var(--info)] to-blue-600 shadow-md",
    },
    {
      title: "Avg. Performance",
      value: "87%",
      change: "+5% from last month",
      icon: Target,
      gradient: "from-[var(--success)] to-emerald-600 shadow-md",
    },
    {
      title: "Pending Approvals",
      value: "3",
      change: "Requires attention",
      icon: Clock,
      gradient: "from-[var(--warning)] to-amber-600 shadow-md",
    },
  ];

  const activeCampaigns = [
    {
      name: "Q2 Product Launch Campaign",
      progress: 75,
      budget: "$50,000",
      spent: "$37,500",
      status: "On Track",
      dueDate: "Jun 30, 2026",
      statusColor: "text-[var(--success)] bg-[var(--success-dim)] border-[var(--success-dim)]",
    },
    {
      name: "Brand Awareness Initiative",
      progress: 45,
      budget: "$75,000",
      spent: "$33,750",
      status: "In Progress",
      dueDate: "Aug 15, 2026",
      statusColor: "text-[var(--info)] bg-[var(--info-dim)] border-[var(--info-dim)]",
    },
    {
      name: "Social Media Expansion",
      progress: 92,
      budget: "$35,000",
      spent: "$32,200",
      status: "Near Completion",
      dueDate: "May 31, 2026",
      statusColor: "text-[var(--info)] bg-[var(--info-dim)] border-[var(--info-dim)]",
    },
    {
      name: "Email Marketing Campaign",
      progress: 30,
      budget: "$25,000",
      spent: "$7,500",
      status: "Delayed",
      dueDate: "Jul 10, 2026",
      statusColor: "text-[var(--warning)] bg-[var(--warning-dim)] border-[var(--warning-dim)]",
    },
  ];

  const recentActivity = [
    {
      action: "Campaign Report Uploaded",
      campaign: "Q2 Product Launch",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-[var(--success)] bg-[var(--success-dim)] border border-[var(--success-dim)]",
    },
    {
      action: "Approval Required",
      campaign: "Brand Awareness Initiative",
      time: "5 hours ago",
      icon: AlertCircle,
      color: "text-[var(--warning)] bg-[var(--warning-dim)] border border-[var(--warning-dim)]",
    },
    {
      action: "Budget Updated",
      campaign: "Social Media Expansion",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-[var(--info)] bg-[var(--info-dim)] border border-[var(--info-dim)]",
    },
    {
      action: "New Comment Added",
      campaign: "Email Marketing Campaign",
      time: "2 days ago",
      icon: TrendingUp,
      color: "text-[var(--info)] bg-[var(--info-dim)] border border-[var(--info-dim)]",
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 relative pt-2">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1.5">Welcome back, John!</h1>
        <p className="text-sm font-medium text-neutral-500">Here's what's happening with your campaigns today.</p>
      </div>

      {/* Grid displaying statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-card)]">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="glass-card group hover:scale-[1.02] transition-transform duration-300">
              <div className="p-[var(--card-padding)]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{stat.title}</p>
                    <h3 className="text-2xl font-extrabold leading-none">{stat.value}</h3>
                    <p className="text-xs font-semibold text-neutral-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--gap-card)]">
        {/* Active Campaigns Column */}
        <div className="lg:col-span-2">
          <div className="glass-card flex flex-col h-full">
            <div className="p-[var(--card-padding)] border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-display font-bold">My Campaigns</h2>
              <p className="text-sm text-neutral-500">Track your ongoing campaign progress</p>
            </div>
            <div className="p-[var(--card-padding)] space-y-5 flex-1">
              {activeCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="space-y-3 p-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm leading-tight">{campaign.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-medium">
                        <span>Budget: <span className="font-bold text-neutral-900">{campaign.budget}</span></span>
                        <span className="text-neutral-300">•</span>
                        <span>Spent: <span className="font-bold text-neutral-900">{campaign.spent}</span></span>
                        <span className="text-neutral-300">•</span>
                        <span>Due: <span className="font-bold text-neutral-900">{campaign.dueDate}</span></span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${campaign.statusColor}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-neutral-500">Completion rate</span>
                      <span className="text-neutral-900 font-bold">{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Column */}
        <div>
          <div className="glass-card flex flex-col h-full">
            <div className="p-[var(--card-padding)] border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-display font-bold">Recent Activity</h2>
              <p className="text-sm text-neutral-500">Latest updates across campaigns</p>
            </div>
            <div className="p-[var(--card-padding)] space-y-4 flex-1">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex gap-3.5 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className={`mt-0.5 p-2.5 rounded-2xl flex-shrink-0 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 ${activity.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                    <div className="absolute inset-0 rounded-2xl bg-current opacity-5" />
                    <activity.icon className="h-4 w-4 relative z-10" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-[13px] font-bold text-neutral-900 truncate leading-snug">{activity.action}</h4>
                    <p className="text-[11px] font-medium text-neutral-600 truncate">{activity.campaign}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={10} className="text-neutral-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
