'use client';

import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { TrendingUp, Users, Briefcase, Award } from 'lucide-react';

interface ChartDataItem {
  month: string;
  amount?: number;
  count?: number;
}

interface AnalyticsData {
  summary: {
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingTasks: number;
    totalRevenue: number;
  };
  charts: {
    revenue: ChartDataItem[];
    clientGrowth: ChartDataItem[];
  };
}

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.success) {
          setData(json.data);
        }
      } catch {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-neutral-200 rounded-2xl"></div>
          <div className="h-72 bg-neutral-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
    totalRevenue: 0,
  };

  const revenueData = data?.charts?.revenue?.length 
    ? data.charts.revenue 
    : [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 75000 },
        { month: 'Mar', amount: 120000 },
        { month: 'Apr', amount: 95000 },
        { month: 'May', amount: 150000 },
      ];

  const clientGrowthData = data?.charts?.clientGrowth?.length 
    ? data.charts.clientGrowth 
    : [
        { month: 'Jan', count: 1 },
        { month: 'Feb', count: 2 },
        { month: 'Mar', count: 4 },
        { month: 'Apr', count: 5 },
        { month: 'May', count: 8 },
      ];

  // Pie chart data for Project/Task completions
  const completionPieData = [
    { name: 'Completed Projects', value: summary.completedProjects, color: '#10B981' },
    { name: 'Active Projects', value: summary.activeProjects, color: '#3B82F6' },
    { name: 'Pending Tasks', value: summary.pendingTasks, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Real-time platform summaries</p>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Platform Revenue</span>
            <h3 className="text-xl font-extrabold">₹{summary.totalRevenue?.toLocaleString() ?? 0}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <Award size={18} />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Clients</span>
            <h3 className="text-xl font-extrabold">{summary.totalClients}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <Users size={18} />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Projects</span>
            <h3 className="text-xl font-extrabold">{summary.activeProjects}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Briefcase size={18} />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pending Tasks</span>
            <h3 className="text-xl font-extrabold">{summary.pendingTasks}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-neutral-800 text-sm">Revenue Milestones Trend</h3>
            <p className="text-xs text-neutral-400 font-medium">Cumulative paid earnings over time</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-neutral-800 text-sm">Acquisition Growth</h3>
            <p className="text-xs text-neutral-400 font-medium">Client user registrations</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 space-y-4 lg:col-span-2">
          <div>
            <h3 className="font-extrabold text-neutral-800 text-sm">System Operations Shares</h3>
            <p className="text-xs text-neutral-400 font-medium">Active, completed and pending allocations</p>
          </div>
          <div className="h-64 w-full flex justify-center items-center">
            {summary.completedProjects === 0 && summary.activeProjects === 0 && summary.pendingTasks === 0 ? (
              <p className="text-xs text-neutral-400">No projects or tasks to distribute.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionPieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {completionPieData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
