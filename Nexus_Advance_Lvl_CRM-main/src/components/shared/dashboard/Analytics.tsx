import { motion } from "motion/react";
import { Eye, MousePointer, Users, MapPin, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function Analytics() {
  const performanceMetrics = [
    { title: "Total Reach", value: "2.4M", change: "+18.2%", icon: Eye, color: "bg-neutral-900 text-white shadow-2xl" },
    { title: "Engagement", value: "8.7%", change: "+2.3%", icon: MousePointer, color: "bg-blue-600 text-white shadow-xl" },
    { title: "Total Clicks", value: "156K", change: "+12.5%", icon: Users, color: "bg-emerald-600 text-white shadow-xl" },
    { title: "Leads", value: "3,247", change: "+24.8%", icon: TrendingUp, color: "bg-amber-500 text-white shadow-xl" },
  ];

  const performanceTrend = [
    { date: "Apr 1", impressions: 180000, clicks: 12000, engagement: 6.7 },
    { date: "Apr 8", impressions: 220000, clicks: 15000, engagement: 6.8 },
    { date: "Apr 15", impressions: 260000, clicks: 18500, engagement: 7.1 },
    { date: "Apr 22", impressions: 310000, clicks: 24000, engagement: 7.7 },
    { date: "Apr 29", impressions: 380000, clicks: 29000, engagement: 7.6 },
    { date: "May 6", impressions: 425000, clicks: 35000, engagement: 8.2 },
    { date: "May 12", impressions: 480000, clicks: 42000, engagement: 8.7 },
  ];

  const regionalPerformance = [
    { region: "North America", reach: 850000, engagement: 9.2, leads: 1240 },
    { region: "Europe", reach: 620000, engagement: 8.5, leads: 890 },
    { region: "Asia Pacific", reach: 540000, engagement: 7.8, leads: 670 },
    { region: "Latin America", reach: 290000, engagement: 8.1, leads: 320 },
    { region: "Middle East", reach: 100000, engagement: 7.5, leads: 127 },
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-14 relative pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Intelligence Hub</h1>
          </div>
          <p className="text-sm font-bold text-neutral-500 max-w-md leading-relaxed">Multi-dimensional campaign performance tracking, audience engagement trends, and regional impact analysis.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
              Real-time Monitoring
           </div>
        </div>
      </div>

      {/* Insight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl ${metric.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500`}>
              <metric.icon size={24} />
            </div>
            <div className="space-y-1">
               <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tighter leading-none">{metric.value}</h3>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{metric.title}</span>
                  <span className="text-[10px] font-bold text-emerald-500">{metric.change}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Trend Analysis */}
        <div className="lg:col-span-8 space-y-10">
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Audience Pulse</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Trajectory Analysis</h2>
                 </div>
                 <div className="flex gap-2">
                    <div className="px-4 py-1.5 bg-neutral-50 rounded-full text-[9px] font-black text-neutral-400 uppercase tracking-widest border border-neutral-100">Daily</div>
                    <div className="px-4 py-1.5 bg-neutral-900 rounded-full text-[9px] font-black text-white uppercase tracking-widest">Weekly</div>
                 </div>
              </div>
              <ChartContainer 
                config={{ 
                  impressions: { label: "Impressions", color: "#171717" },
                  clicks: { label: "Clicks", color: "#2563eb" } 
                }} 
                className="h-[400px] w-full"
              >
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-impressions)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-impressions)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A3A3A3' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A3A3A3' }} />
                  <ChartTooltip content={<ChartTooltipContent className="bg-neutral-900 border-none text-white rounded-xl shadow-2xl p-4" />} />
                  <Area type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={4} fillOpacity={1} fill="url(#colorImpressions)" />
                  <Area type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ChartContainer>
           </div>
        </div>

        {/* Global Impact Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-xl flex flex-col gap-10">
              <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Global Coverage</h3>
                 <h2 className="text-2xl font-display font-bold text-neutral-900">Regional Impact</h2>
              </div>
              <div className="flex flex-col gap-8">
                 {regionalPerformance.map((region, idx) => (
                   <div key={idx} className="space-y-3 group/region">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:scale-150 transition-transform" />
                            <span className="text-[13px] font-bold text-neutral-900">{region.region}</span>
                         </div>
                         <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{region.leads} Leads</span>
                      </div>
                      <div className="relative h-1.5 bg-neutral-50 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(region.reach / 850000) * 100}%` }}
                           className="h-full bg-neutral-900"
                         />
                      </div>
                      <div className="flex justify-between items-center px-1">
                         <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Reach</span>
                         <span className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">{(region.reach / 1000).toFixed(0)}K</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 mt-4">
                 <MapPin size={14} />
                 <span>View Heatmap</span>
              </button>
           </div>

           {/* Insights Summary */}
           <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-neutral-900 text-white flex flex-col gap-6 relative overflow-hidden group/cta shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="space-y-1 relative z-10">
                 <h4 className="text-xl font-display font-bold">AI Performance Insight</h4>
                 <p className="text-[13px] font-medium text-white/70 leading-relaxed">Engagement in Asia Pacific is tracking 12% above benchmark. Recommend budget reallocation.</p>
              </div>
              <button className="relative z-10 w-full py-3 bg-white text-neutral-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all">
                 Apply Recommendation
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
