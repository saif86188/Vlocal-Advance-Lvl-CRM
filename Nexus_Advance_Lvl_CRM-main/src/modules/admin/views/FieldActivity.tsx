import { MapPin, Calendar, Clock, User, Filter, Plus } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "Site Visit",
    location: "Downtown Mall, Main Street",
    campaign: "Summer Product Launch",
    assignee: "Sarah Johnson",
    date: "2026-05-11",
    time: "09:00 AM",
    status: "Completed",
    notes: "Met with store manager, product placement confirmed",
  },
  {
    id: 2,
    type: "Event Setup",
    location: "Tech Conference Center",
    campaign: "Brand Awareness Q2",
    assignee: "Mike Chen",
    date: "2026-05-12",
    time: "02:00 PM",
    status: "Scheduled",
    notes: "Prepare booth materials and demo stations",
  },
  {
    id: 3,
    type: "Client Meeting",
    location: "Acme Corp Headquarters",
    campaign: "Holiday Season Promo",
    assignee: "Emma Wilson",
    date: "2026-05-13",
    time: "10:30 AM",
    status: "Scheduled",
    notes: "Q&A session and campaign review",
  },
  {
    id: 4,
    type: "Survey",
    location: "Fashion District",
    campaign: "Social Media Boost",
    assignee: "David Lee",
    date: "2026-05-11",
    time: "01:00 PM",
    status: "In Progress",
    notes: "Customer feedback collection ongoing",
  },
  {
    id: 5,
    type: "Installation",
    location: "City Center Billboard",
    campaign: "Brand Awareness Q2",
    assignee: "Sarah Johnson",
    date: "2026-05-10",
    time: "08:00 AM",
    status: "Completed",
    notes: "Banner installed successfully",
  },
];

export function FieldActivity() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium">Field Activity Tracking</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor and manage field operations and activities</p>
        </div>
        <button className="CODEVATE-btn bg-[var(--accent)] text-neutral-900 shadow-sm hover:scale-[1.02] border border-neutral-900">
          <Plus className="w-5 h-5 mr-1" />
          Log Activity
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-[var(--card-padding)]">
        <div className="flex flex-col md:flex-row gap-4">
          <select className="px-4 py-2.5 border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all shadow-sm">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="px-4 py-2.5 border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all shadow-sm">
            <option>All Types</option>
            <option>Site Visit</option>
            <option>Event Setup</option>
            <option>Client Meeting</option>
            <option>Survey</option>
            <option>Installation</option>
          </select>
          <input
            type="date"
            className="px-4 py-2.5 border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all shadow-sm"
          />
          <button className="CODEVATE-btn border border-[var(--border-default)] hover:bg-[var(--bg-hover)] bg-white/50 text-[var(--text-primary)]">
            <Filter className="w-5 h-5 mr-1" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Total Activities</p>
          <p className="metric-number text-3xl mt-1">1,247</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Today</p>
          <p className="metric-number text-3xl mt-1 text-[var(--info)]">18</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">In Progress</p>
          <p className="metric-number text-3xl mt-1 text-[var(--warning)]">7</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Completed</p>
          <p className="metric-number text-3xl mt-1 text-[var(--success)]">1,222</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-display font-medium">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {index !== activities.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[var(--border-default)]" />
                )}
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === "Completed"
                      ? "bg-[var(--success-dim)]"
                      : activity.status === "In Progress"
                      ? "bg-[var(--warning-dim)]"
                      : "bg-[var(--info-dim)]"
                  }`}>
                    <MapPin className={`w-4 h-4 ${
                      activity.status === "Completed"
                        ? "text-[var(--success)]"
                        : activity.status === "In Progress"
                        ? "text-[var(--warning)]"
                        : "text-[var(--info)]"
                    }`} />
                  </div>
                  <div className="flex-1 border border-[var(--border-default)] bg-white/30 rounded-xl p-4 hover:border-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-glow)] transition-all cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-[14px]">{activity.type}</h3>
                        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{activity.campaign}</p>
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium self-start border ${
                          activity.status === "Completed"
                            ? "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]"
                            : activity.status === "In Progress"
                            ? "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]"
                            : "bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[13px]">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{activity.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    {activity.notes && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                        <p className="text-[13px] text-[var(--text-secondary)]">{activity.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-display font-medium">Activity Map</h2>
        </div>
        <div className="aspect-video bg-[var(--bg-hover)] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-[var(--text-secondary)]">Interactive map view</p>
            <p className="text-[13px] text-[var(--text-muted)]">Activity locations would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
