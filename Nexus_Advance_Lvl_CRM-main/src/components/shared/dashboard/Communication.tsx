import { motion } from "motion/react";
import { MessageSquare, Send, Bell, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function Communication() {
  const notifications = [
    {
      id: 1,
      type: "approval",
      title: "New approval request",
      message: "Creative assets for Q2 Product Launch require your review",
      time: "2 hours ago",
      read: false,
      icon: Clock,
      color: "text-[var(--warning)] bg-[var(--warning-dim)] border border-[var(--warning-dim)]",
    },
    {
      id: 2,
      type: "comment",
      title: "New comment from Sarah Mitchell",
      message: "Added feedback on the brand awareness campaign strategy",
      time: "5 hours ago",
      read: false,
      icon: MessageSquare,
      color: "text-[var(--info)] bg-[var(--info-dim)] border border-[var(--info-dim)]",
    },
    {
      id: 3,
      type: "update",
      title: "Campaign status updated",
      message: "Social Media Expansion is now 92% complete",
      time: "1 day ago",
      read: true,
      icon: CheckCircle2,
      color: "text-[var(--success)] bg-[var(--success-dim)] border border-[var(--success-dim)]",
    },
    {
      id: 4,
      type: "alert",
      title: "Budget alert",
      message: "Email Marketing campaign is approaching budget limit",
      time: "2 days ago",
      read: true,
      icon: AlertCircle,
      color: "text-[var(--danger)] bg-[var(--danger-dim)] border border-[var(--danger-dim)]",
    },
  ];

  const conversations = [
    {
      id: 1,
      campaign: "Q2 Product Launch Campaign",
      messages: [
        {
          id: 1,
          sender: "Sarah Mitchell",
          role: "Account Manager",
          message: "Hi John! I wanted to update you on the Q2 campaign progress. We've completed the creative development phase and are now moving into execution.",
          timestamp: "May 10, 2026 at 10:30 AM",
          isClient: false,
          avatar: "SM",
        },
        {
          id: 2,
          sender: "You",
          role: "Client",
          message: "That's great to hear! When can I expect to see the first batch of creatives?",
          timestamp: "May 10, 2026 at 11:15 AM",
          isClient: true,
          avatar: "JD",
        },
        {
          id: 3,
          sender: "Sarah Mitchell",
          role: "Account Manager",
          message: "I've uploaded them to the Files section. They're ready for your approval. Let me know if you have any feedback!",
          timestamp: "May 10, 2026 at 2:45 PM",
          isClient: false,
          avatar: "SM",
        },
        {
          id: 4,
          sender: "You",
          role: "Client",
          message: "Perfect, I'll review them today and get back to you.",
          timestamp: "May 10, 2026 at 3:20 PM",
          isClient: true,
          avatar: "JD",
        },
      ],
    },
  ];

  const activityTimeline = [
    {
      id: 1,
      action: "commented on",
      target: "Q2 Product Launch Campaign",
      user: "Sarah Mitchell",
      time: "2 hours ago",
      avatar: "SM",
    },
    {
      id: 2,
      action: "uploaded",
      target: "Brand_Video_V3.mp4",
      user: "David Chen",
      time: "5 hours ago",
      avatar: "DC",
    },
    {
      id: 3,
      action: "approved",
      target: "Social Media Graphics Pack",
      user: "You",
      time: "1 day ago",
      avatar: "JD",
    },
    {
      id: 4,
      action: "updated budget for",
      target: "Email Marketing Campaign",
      user: "Sarah Mitchell",
      time: "2 days ago",
      avatar: "SM",
    },
    {
      id: 5,
      action: "completed task in",
      target: "Brand Awareness Initiative",
      user: "Anna Smith",
      time: "3 days ago",
      avatar: "AS",
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 relative pt-2">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1.5">Communication Center</h1>
        <p className="text-sm font-medium text-neutral-500">Messages, notifications, and activity updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--gap-card)]">
        {/* Campaign Direct Conversations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card flex flex-col h-full">
            <div className="p-[var(--card-padding)] border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold">Campaign Conversations</h2>
                <p className="text-sm text-neutral-500">Direct communication with your team</p>
              </div>
              <span className="bg-[var(--info-dim)] border border-[var(--info-dim)] text-[var(--info)] font-bold px-2.5 py-0.5 rounded-md text-[10px]">
                {conversations.length} Active
              </span>
            </div>
            <div className="flex-1 p-0 flex flex-col min-h-0">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex flex-col h-full">
                  {/* Campaign Header inside chat */}
                  <div className="px-6 py-3 bg-[var(--bg-subtle)]/50 border-b border-[var(--border-subtle)] flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <h4 className="font-bold text-xs tracking-tight text-neutral-500">{conversation.campaign}</h4>
                  </div>
 
                  <ScrollArea className="flex-1 px-6 py-4 mesh-gradient relative">
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                    <div className="flex flex-col gap-6 relative z-10">
                      {conversation.messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 ${message.isClient ? "flex-row-reverse" : ""}`}
                        >
                          {/* Avatar */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm mt-1 ${message.isClient ? "bg-[var(--accent)] text-neutral-900" : "bg-neutral-900 text-white"}`}>
                            {message.avatar}
                          </div>
 
                          {/* Message Content */}
                          <div className={`flex flex-col max-w-[70%] ${message.isClient ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                              <span className="text-[11px] font-bold text-[var(--text-primary)]">{message.sender}</span>
                              <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-tighter">{message.role}</span>
                            </div>
                            <div className={`px-5 py-3 rounded-[24px] border relative transition-all duration-300 ${
                              message.isClient 
                                ? "bg-neutral-900 border-transparent text-white rounded-tr-none shadow-xl hover:scale-[1.01]" 
                                : "bg-white/90 backdrop-blur-md border-[var(--border-subtle)] rounded-tl-none shadow-md hover:shadow-lg"
                            }`}>
                              {message.isClient && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[24px]" />}
                              <p className="text-[14px] font-medium leading-relaxed tracking-tight">{message.message}</p>
                            </div>
                            <span className="text-[9px] font-medium text-[var(--text-muted)] mt-1 px-1">{message.timestamp}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
 
                  {/* Chat Input */}
                  <div className="p-4 border-t border-[var(--border-subtle)] bg-white/50 backdrop-blur-sm">
                    <div className="flex gap-2 items-center bg-[var(--bg-base)] border border-[var(--border-strong)] rounded-2xl p-1.5 focus-within:border-[var(--accent)] transition-all shadow-inner">
                      <textarea
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 bg-transparent text-[13px] font-medium focus:outline-none resize-none overflow-y-auto"
                      />
                      <button className="h-9 w-9 rounded-xl bg-neutral-900 text-white hover:bg-black flex items-center justify-center transition-all cursor-pointer shrink-0">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Notifications and Activity */}
        <div className="space-y-[var(--gap-card)] flex flex-col">
          <div className="glass-card flex flex-col">
            <div className="p-[var(--card-padding)] border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h2 className="text-lg font-display font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-[var(--accent)]" />
                Notifications
              </h2>
              <span className="bg-[var(--danger-dim)] border border-[var(--danger-dim)] text-[var(--danger)] font-bold px-2 py-0.5 rounded-md text-[10px]">
                2 New
              </span>
            </div>
            <div className="p-[var(--card-padding)]">
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      notification.read
                        ? "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                        : "bg-[var(--accent)]/5 border-[var(--accent)]/20 hover:bg-[var(--accent)]/10"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2.5 rounded-2xl flex-shrink-0 flex items-center justify-center relative ${notification.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                        <div className="absolute inset-0 rounded-2xl bg-current opacity-5" />
                        <notification.icon className="h-4 w-4 relative z-10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-xs font-bold leading-snug">{notification.title}</h4>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-[var(--accent)] ml-2 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-neutral-700 mb-1 leading-normal">{notification.message}</p>
                        <p className="text-[10px] font-bold text-neutral-500">{notification.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-dashed border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--accent)] hover:brightness-110 hover:bg-[var(--bg-hover)] transition cursor-pointer">
                View All Notifications
              </button>
            </div>
          </div>

          <div className="glass-card flex flex-col flex-1">
            <div className="p-[var(--card-padding)] border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-display font-bold">Activity Timeline</h2>
              <p className="text-sm text-neutral-500">Recent team actions</p>
            </div>
            <div className="p-[var(--card-padding)]">
              <div className="space-y-5">
                {activityTimeline.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 relative"
                  >
                    {index < activityTimeline.length - 1 && (
                      <div className="absolute left-[18px] top-9 bottom-[-20px] w-px bg-[var(--border-subtle)]" />
                    )}
                    <div className="h-9 w-9 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-xs flex items-center justify-center border border-[var(--border-default)] shadow-sm flex-shrink-0 z-10">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-600 leading-normal">
                        <span className="font-bold text-neutral-900">{activity.user}</span> {activity.action}{" "}
                        <span className="font-bold text-neutral-900">{activity.target}</span>
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
