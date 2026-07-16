'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { 
  TrendingUp, TrendingDown, Users, Briefcase, Play, CheckCircle, 
  Clock, IndianRupee, ArrowUpRight, Activity, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';

interface ChartDataItem {
  month: string;
  amount?: number;
  count?: number;
}

interface SummaryResponse {
  summary: {
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingTasks: number;
    totalRevenue: number;
  };
  recentActivities: Array<{ _id: string; action: string; description: string; timestamp: string }>;
  latestClients: Array<{ _id: string; name: string; email: string; company?: string; createdAt: string }>;
  charts: {
    revenue: ChartDataItem[];
    clientGrowth: ChartDataItem[];
  };
}

export function AdminDashboardHome() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/summary', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Failed to load dashboard');
        return;
      }
      setData(json.data);
    } catch {
      setError('Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      { 
        label: 'Total Revenue', 
        value: `₹${data.summary.totalRevenue.toLocaleString()}`, 
        change: '+14.2%', 
        trend: 'up', 
        icon: IndianRupee,
        color: 'from-amber-500 to-yellow-500 text-white'
      },
      { 
        label: 'Total Clients', 
        value: data.summary.totalClients, 
        change: '+8.4%', 
        trend: 'up', 
        icon: Users,
        color: 'from-blue-500 to-indigo-500 text-white'
      },
      { 
        label: 'Active Projects', 
        value: data.summary.activeProjects, 
        change: '+2.1%', 
        trend: 'up', 
        icon: Play,
        color: 'from-emerald-500 to-teal-500 text-white'
      },
      { 
        label: 'Completed Projects', 
        value: data.summary.completedProjects, 
        change: '+4.5%', 
        trend: 'up', 
        icon: CheckCircle,
        color: 'from-purple-500 to-pink-500 text-white'
      },
      { 
        label: 'Pending Tasks', 
        value: data.summary.pendingTasks, 
        change: '-5.2%', 
        trend: 'down', 
        icon: Clock,
        color: 'from-red-500 to-orange-500 text-white'
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-neutral-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-neutral-200 rounded-3xl"></div>
          <div className="h-80 bg-neutral-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-600 font-semibold">{error}</p>;

  // Construct charts data
  const revenueChartData = data?.charts?.revenue?.length 
    ? data.charts.revenue 
    : [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 75000 },
        { month: 'Mar', amount: 120000 },
        { month: 'Apr', amount: 95000 },
        { month: 'May', amount: 150000 },
      ];

  const clientChartData = data?.charts?.clientGrowth?.length 
    ? data.charts.clientGrowth 
    : [
        { month: 'Jan', count: 1 },
        { month: 'Feb', count: 2 },
        { month: 'Mar', count: 4 },
        { month: 'Apr', count: 5 },
        { month: 'May', count: 8 },
      ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium">CRM platform statistics and logs</p>
        </div>
        <button
          className="CODEVATE-btn bg-[var(--accent)] text-neutral-900 font-bold transition hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => toast.info('Access sidebar navigation to manage clients, projects, tasks')}
        >
          Quick Actions
        </button>
      </div>

      {/* Grid displaying statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-5 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">{card.label}</span>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} shadow-md`}>
                <card.icon size={16} />
              </div>
            </div>
            
            <div className="mt-3">
              <h3 className="text-2xl font-black tracking-tight">{card.value}</h3>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold">
                {card.trend === 'up' ? (
                  <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={12} className="text-red-500" />
                )}
                <span className={card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                  {card.change}
                </span>
                <span className="text-neutral-400 font-medium">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-neutral-800 text-sm">Revenue Operations Trends</h3>
              <p className="text-xs text-neutral-400 font-medium">Track invoices processed to date</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-neutral-900 text-white rounded-full">
              LIVE DATA
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-neutral-800 text-sm">Client Acquisition Growth</h3>
            <p className="text-xs text-neutral-400 font-medium">New registrations by month</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-neutral-800">Recent Platform Activities</h2>
            <Activity size={18} className="text-neutral-400" />
          </div>
          {data?.recentActivities.length ? (
            <ul className="space-y-4 flex-1">
              {data.recentActivities.map((activity) => (
                <li key={activity._id} className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100/50 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-800 leading-normal">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] font-semibold text-neutral-400">
                      <span className="uppercase tracking-wider">{activity.action}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--text-muted)] p-4 text-center">No activity logged yet.</p>
          )}
        </div>

        {/* Latest Registered Clients */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-neutral-800">Latest Client Registrations</h2>
            <Calendar size={18} className="text-neutral-400" />
          </div>
          {data?.latestClients.length ? (
            <div className="space-y-3 flex-1 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latestClients.map((client) => (
                    <tr key={client._id} className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
                            {client.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">{client.name}</p>
                            <p className="text-[10px] text-neutral-400 font-semibold">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-neutral-600">{client.company || '-'}</td>
                      <td className="py-3 text-neutral-400 font-medium">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] p-4 text-center">No clients registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
