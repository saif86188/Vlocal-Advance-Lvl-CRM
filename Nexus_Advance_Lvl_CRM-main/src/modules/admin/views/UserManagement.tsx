import { Plus, Search, MoreVertical, Mail, Shield, User } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@campaignhub.com",
    role: "Administrator",
    status: "Active",
    lastActive: "2 hours ago",
    campaigns: 8,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@campaignhub.com",
    role: "Campaign Manager",
    status: "Active",
    lastActive: "5 hours ago",
    campaigns: 5,
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@campaignhub.com",
    role: "Field Agent",
    status: "Active",
    lastActive: "1 day ago",
    campaigns: 3,
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@campaignhub.com",
    role: "Campaign Manager",
    status: "Active",
    lastActive: "3 hours ago",
    campaigns: 6,
  },
  {
    id: 5,
    name: "Lisa Brown",
    email: "lisa@campaignhub.com",
    role: "Field Agent",
    status: "Inactive",
    lastActive: "1 week ago",
    campaigns: 2,
  },
];

const roles = [
  {
    name: "Administrator",
    description: "Full system access and user management",
    count: 2,
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Campaign Manager",
    description: "Create and manage campaigns",
    count: 5,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Field Agent",
    description: "Log field activities and updates",
    count: 12,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Analyst",
    description: "View reports and analytics",
    count: 3,
    color: "bg-purple-100 text-purple-700",
  },
];

export function UserManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium">User Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage team members and permissions</p>
        </div>
        <button className="vlocal-btn bg-[var(--accent)] text-neutral-900 shadow-sm hover:scale-[1.02] border border-neutral-900">
          <Plus className="w-5 h-5 mr-1" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-[var(--gap-card)]">
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Total Users</p>
          <p className="metric-number text-3xl mt-1">22</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Active Users</p>
          <p className="metric-number text-3xl mt-1 text-[var(--success)]">20</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Pending Invites</p>
          <p className="metric-number text-3xl mt-1 text-[var(--warning)]">3</p>
        </div>
        <div className="glass-card p-[var(--card-padding)]">
          <p className="caption">Roles</p>
          <p className="metric-number text-3xl mt-1 text-[var(--info)]">4</p>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-display font-medium">Roles & Permissions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="border border-[var(--border-default)] rounded-xl p-4 hover:border-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-glow)] transition-all cursor-pointer bg-white/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="font-semibold">{role.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-[var(--border-default)] bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                  {role.count} users
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)]">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-[var(--card-padding)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="search"
            placeholder="Search users by name, email, or role..."
            className="w-full pl-12 pr-4 py-3 border border-[var(--border-default)] rounded-xl bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Campaigns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--accent-glow)] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[14px]">{user.name}</p>
                        <p className="text-[12px] text-[var(--text-secondary)] md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      user.role === "Administrator"
                        ? "bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger-dim)]"
                        : user.role === "Campaign Manager"
                        ? "bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]"
                        : "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className="text-[13px] font-medium">{user.campaigns}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className="text-[13px] text-[var(--text-secondary)]">{user.lastActive}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      user.status === "Active" ? "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]" : "bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-default)]"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <p className="text-[13px] text-[var(--text-secondary)]">Showing 1 to 5 of 22 users</p>
          <div className="flex gap-2">
            <button className="vlocal-btn-sm border border-[var(--border-default)] hover:bg-[var(--bg-hover)] bg-white text-[var(--text-primary)]">
              Previous
            </button>
            <button className="vlocal-btn-sm bg-[var(--accent)] text-neutral-900 shadow-sm hover:scale-[1.02] border border-neutral-900/10">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
