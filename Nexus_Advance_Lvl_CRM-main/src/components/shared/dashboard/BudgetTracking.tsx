import { motion } from "motion/react";
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Receipt, Download } from "lucide-react";
import { Progress } from "../ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function BudgetTracking() {
  const budgetOverview = [
    {
      title: "Total Budget",
      value: "$245,000",
      change: "+12% vs last quarter",
      icon: Wallet,
      color: "bg-neutral-900 text-white shadow-2xl",
      trend: "up",
    },
    {
      title: "Total Spent",
      value: "$163,450",
      change: "66.7% of budget",
      icon: CreditCard,
      color: "bg-blue-600 text-white shadow-xl",
      trend: "neutral",
    },
    {
      title: "Remaining",
      value: "$81,550",
      change: "33.3% available",
      icon: DollarSign,
      color: "bg-emerald-600 text-white shadow-xl",
      trend: "neutral",
    },
    {
      title: "Avg. ROI",
      value: "287%",
      change: "+23% improvement",
      icon: TrendingUp,
      color: "bg-amber-500 text-white shadow-xl",
      trend: "up",
    },
  ];

  const campaignBudgets = [
    { name: "Q2 Product Launch", allocated: 50000, spent: 37500, remaining: 12500, percentage: 75, status: "on-track" },
    { name: "Brand Awareness", allocated: 75000, spent: 33750, remaining: 41250, percentage: 45, status: "under-budget" },
    { name: "Social Media", allocated: 35000, spent: 32200, remaining: 2800, percentage: 92, status: "near-limit" },
    { name: "Email Marketing", allocated: 25000, spent: 7500, remaining: 17500, percentage: 30, status: "under-budget" },
    { name: "Content Creation", allocated: 60000, spent: 52500, remaining: 7500, percentage: 87.5, status: "on-track" },
  ];

  const monthlySpending = [
    { month: "Jan", spending: 25000 },
    { month: "Feb", spending: 32000 },
    { month: "Mar", spending: 28000 },
    { month: "Apr", spending: 42000 },
    { month: "May", spending: 36450 },
  ];

  const budgetDistribution = [
    { name: "Creative Production", value: 35, color: "#171717" },
    { name: "Media Buying", value: 30, color: "#2563eb" },
    { name: "Content Creation", value: 20, color: "#10b981" },
    { name: "Analytics & Tools", value: 10, color: "#f59e0b" },
    { name: "Miscellaneous", value: 5, color: "#ef4444" },
  ];

  const invoices = [
    { id: "INV-001", campaign: "Q2 Product Launch", amount: "$15,000", date: "May 1, 2026", status: "paid" },
    { id: "INV-002", campaign: "Brand Awareness", amount: "$22,500", date: "May 5, 2026", status: "paid" },
    { id: "INV-003", campaign: "Social Media", amount: "$8,750", date: "May 8, 2026", status: "pending" },
    { id: "INV-004", campaign: "Email Marketing", amount: "$5,200", date: "May 10, 2026", status: "pending" },
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-14 relative pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Wallet className="h-5 w-5" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Capital Hub</h1>
        </div>
        <p className="text-sm font-bold text-neutral-500 max-w-md leading-relaxed">Advanced campaign spending analysis, allocation management, and financial health monitoring.</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {budgetOverview.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-8 rounded-[40px] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500`}>
              <item.icon size={24} />
            </div>
            <div className="space-y-1">
               <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tighter leading-none">{item.value}</h3>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{item.title}</span>
                  <span className="text-[10px] font-bold text-emerald-500">{item.change.split(' ')[0]}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Expenditure Analysis */}
        <div className="lg:col-span-8 space-y-10">
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Spending Velocity</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Financial Trend Analysis</h2>
                 </div>
                 <button className="px-6 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all">5 Month View</button>
              </div>
              <ChartContainer config={{ spending: { label: "Monthly Spending", color: "#171717" } }} className="h-[350px] w-full">
                <BarChart data={monthlySpending}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A3A3A3' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A3A3A3' }} />
                  <ChartTooltip content={<ChartTooltipContent className="bg-neutral-900 border-none text-white rounded-xl shadow-2xl p-4" />} />
                  <Bar dataKey="spending" fill="var(--color-spending)" radius={[12, 12, 12, 12]} barSize={40} />
                </BarChart>
              </ChartContainer>
           </div>

           {/* Detailed Allocation Breakdown */}
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-10">
              <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Campaign-Specifics</h3>
                 <h2 className="text-2xl font-display font-bold text-neutral-900">Allocation Performance</h2>
              </div>
              <div className="flex flex-col gap-6">
                 {campaignBudgets.map((campaign, idx) => (
                   <div key={idx} className="p-6 rounded-[32px] border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:shadow-2xl hover:border-neutral-200 transition-all duration-500 group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                         <div className="space-y-1">
                            <h4 className="text-base font-bold text-neutral-900">{campaign.name}</h4>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{campaign.status.replace('-', ' ')}</p>
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Spent</p>
                               <p className="text-sm font-bold text-neutral-900">${campaign.spent.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Remaining</p>
                               <p className="text-sm font-bold text-emerald-600">${campaign.remaining.toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                      <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${campaign.percentage}%` }}
                           className={`h-full ${campaign.percentage > 90 ? 'bg-amber-500' : 'bg-neutral-900'}`}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Distribution & Invoices Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           {/* Distribution Pie */}
           <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-xl flex flex-col gap-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Budget Split</h3>
              <ChartContainer config={{ value: { label: "Allocation" } }} className="h-[250px] w-full">
                <PieChart>
                  <Pie data={budgetDistribution} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                    {budgetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900, paddingTop: 20 }} />
                </PieChart>
              </ChartContainer>
           </div>

           {/* Recent Ledger */}
           <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-xl flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Recent Ledger</h3>
                 <Download size={14} className="text-neutral-400" />
              </div>
              <div className="flex flex-col gap-4">
                 {invoices.map((inv, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group/inv hover:bg-white hover:shadow-lg transition-all">
                      <div className="space-y-0.5">
                         <p className="text-[11px] font-bold text-neutral-900">{inv.id}</p>
                         <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{inv.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold text-neutral-900">{inv.amount}</p>
                         <p className={`text-[8px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{inv.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-4 border border-dashed border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all">
                 Download All Invoices
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
