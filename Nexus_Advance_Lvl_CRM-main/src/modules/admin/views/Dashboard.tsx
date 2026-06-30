import { TrendingUp, TrendingDown, Users, Megaphone, MapPin, DollarSign, ArrowUpRight } from "lucide-react";

const stats = [
  {
    name: "Total Campaigns",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Megaphone,
    color: "bg-primary text-white",
  },
  {
    name: "Active Clients",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "bg-accent text-primary",
  },
  {
    name: "Field Activities",
    value: "1,247",
    change: "+23%",
    trend: "up",
    icon: MapPin,
    color: "bg-white text-primary",
  },
  {
    name: "Monthly Revenue",
    value: "$48.2k",
    change: "-3%",
    trend: "down",
    icon: DollarSign,
    color: "bg-primary text-white",
  },
];

const recentCampaigns = [
  { id: 1, name: "Summer Product Launch", client: "Acme Corp", status: "Active", progress: 75 },
  { id: 2, name: "Brand Awareness Q2", client: "TechStart Inc", status: "Active", progress: 45 },
  { id: 3, name: "Holiday Season Promo", client: "Retail Plus", status: "Planning", progress: 20 },
  { id: 4, name: "Social Media Boost", client: "Fashion Hub", status: "Active", progress: 60 },
];

const recentActivities = [
  { id: 1, user: "Sarah Johnson", action: "completed field visit", target: "Downtown Mall", time: "2 hours ago" },
  { id: 2, user: "Mike Chen", action: "updated campaign", target: "Summer Launch", time: "4 hours ago" },
  { id: 3, user: "Emma Wilson", action: "added new client", target: "Global Brands Ltd", time: "5 hours ago" },
  { id: 4, user: "David Lee", action: "generated report", target: "Q2 Performance", time: "1 day ago" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Section - Profile Card & Stats */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Profile Card */}
        <div className="w-full xl:w-1/3 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-sm p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-bold text-primary leading-tight">
              Welcome in, <br /> Saif
            </h1>
            <p className="text-foreground/70">Here is your daily campaign summary and field activity overview.</p>
          </div>
          
          <div className="relative z-10 mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                 <img src="https://avatar.iran.liara.run/public/boy?username=saif" alt="Saif" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="font-bold text-primary text-lg">Saif</p>
                 <p className="text-sm text-foreground/60">Administrator</p>
               </div>
            </div>
            <button className="px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full font-medium transition-colors">
              View Profile
            </button>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>

        {/* Stats Grid */}
        <div className="w-full xl:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex flex-col justify-between relative group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-foreground/60 font-medium mb-1">{stat.name}</p>
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                </div>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                 <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    stat.trend === "up" ? "bg-accent/20 text-primary" : "bg-red-500/10 text-red-600"
                 }`}>
                   {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                   {stat.change}
                 </div>
                 <span className="text-sm text-foreground/50">vs last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Recent Campaigns</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="p-8 space-y-6">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-border">
                      <Megaphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-base">{campaign.name}</p>
                      <p className="text-sm text-foreground/60">{campaign.client}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    campaign.status === "Active"
                      ? "bg-accent/20 text-primary"
                      : "bg-muted text-foreground/70"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 pl-16">
                  <div className="flex-1 bg-border rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary min-w-[3ch]">{campaign.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Recent Activity</h2>
          </div>
          <div className="p-8 space-y-6 flex-1">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                  <span className="text-primary font-bold text-sm">
                    {activity.user.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-base text-primary">
                    <span className="font-bold">{activity.user}</span>{" "}
                    <span className="text-foreground/70">{activity.action}</span>{" "}
                    <span className="font-bold">{activity.target}</span>
                  </p>
                  <p className="text-sm text-foreground/50 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
