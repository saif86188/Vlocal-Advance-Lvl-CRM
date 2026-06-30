import { motion } from "motion/react";
import { FileText, Download, Image, Video, FileSpreadsheet, Upload, FolderOpen, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function FileManagement() {
  const fileStats = [
    { title: "Total Library", value: "234", icon: FolderOpen, color: "bg-neutral-900 text-white shadow-2xl" },
    { title: "In Review", value: "8", icon: Clock, color: "bg-amber-500 text-white shadow-xl" },
    { title: "Approved", value: "156", icon: CheckCircle2, color: "bg-emerald-600 text-white shadow-xl" },
    { title: "Total Payload", value: "12.4 GB", icon: FileText, color: "bg-blue-600 text-white shadow-xl" },
  ];

  const recentFiles = [
    { id: 1, name: "Q2_Campaign_Report_Final.pdf", type: "PDF Document", size: "2.4 MB", campaign: "Q2 Product Launch", uploadedBy: "Sarah Mitchell", uploadDate: "May 12, 2026", status: "approved", icon: FileText },
    { id: 2, name: "Brand_Video_V3.mp4", type: "Video", size: "124.8 MB", campaign: "Brand Awareness", uploadedBy: "David Chen", uploadDate: "May 11, 2026", status: "pending", icon: Video },
    { id: 3, name: "Social_Media_Graphics_Pack.zip", type: "Archive", size: "45.2 MB", campaign: "Social Media", uploadedBy: "Emma Watson", uploadDate: "May 10, 2026", status: "approved", icon: Image },
    { id: 4, name: "Analytics_Dashboard_April.xlsx", type: "Spreadsheet", size: "1.8 MB", campaign: "Email Marketing", uploadedBy: "Mike Ross", uploadDate: "May 9, 2026", status: "approved", icon: FileSpreadsheet },
    { id: 5, name: "Campaign_Creative_Mockups.pdf", type: "PDF Document", size: "8.6 MB", campaign: "Q2 Product Launch", uploadedBy: "Sarah Mitchell", uploadDate: "May 8, 2026", status: "rejected", icon: FileText },
  ];

  const approvalQueue = [
    { id: 1, name: "Final_Brand_Guidelines_v2.pdf", campaign: "Brand Awareness", uploadedBy: "David Chen", uploadDate: "May 12, 2026", size: "5.2 MB" },
    { id: 2, name: "Video_Ad_30sec_v1.mp4", campaign: "Social Media", uploadedBy: "Anna Smith", uploadDate: "May 11, 2026", size: "89.4 MB" },
    { id: 3, name: "Email_Template_Design.html", campaign: "Email Marketing", uploadedBy: "Mike Ross", uploadDate: "May 10, 2026", size: "0.3 MB" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      rejected: "bg-red-50 text-red-600 border-red-100",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14 relative pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Asset Studio</h1>
          </div>
          <p className="text-sm font-bold text-neutral-500 max-w-md leading-relaxed">Centralized campaign file management, high-fidelity asset tracking, and streamlined approval flow.</p>
        </div>
        <button className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center gap-3">
           <Upload size={16} />
           <span>Upload Creative</span>
        </button>
      </div>

      {/* Asset Gems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {fileStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-8 rounded-[40px] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500`}>
              <stat.icon size={24} />
            </div>
            <div className="space-y-1">
               <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tighter leading-none">{stat.value}</h3>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{stat.title}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Activity Table */}
        <div className="lg:col-span-8 space-y-10">
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Recent Assets</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Campaign Documents</h2>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl hover:bg-neutral-900 hover:text-white transition-all"><Eye size={16} /></button>
                    <button className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl hover:bg-neutral-900 hover:text-white transition-all"><Download size={16} /></button>
                 </div>
              </div>

              <div className="overflow-x-auto w-full">
                 <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                       <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                          <th className="px-6 pb-2">Asset Name</th>
                          <th className="px-6 pb-2">Category</th>
                          <th className="px-6 pb-2">Status</th>
                          <th className="px-6 pb-2 text-right pr-6">Size</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y-0">
                       {recentFiles.map((file, idx) => (
                         <tr key={idx} className="group/row hover:translate-x-1 transition-transform">
                            <td className="px-6 py-4 bg-neutral-50/50 rounded-l-3xl border-y border-l border-neutral-100 group-hover/row:bg-white transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                     <file.icon size={18} />
                                  </div>
                                  <div className="space-y-0.5">
                                     <p className="text-[13px] font-bold text-neutral-900 line-clamp-1">{file.name}</p>
                                     <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{file.uploadDate}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                               <p className="text-xs font-bold text-neutral-600">{file.campaign}</p>
                            </td>
                            <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(file.status)}`}>
                                  {file.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 bg-neutral-50/50 rounded-r-3xl border-y border-r border-neutral-100 group-hover/row:bg-white transition-colors text-right pr-6">
                               <span className="text-xs font-black text-neutral-900 uppercase">{file.size}</span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           {/* Approval Queue Sidebar */}
           <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-xl flex flex-col gap-10">
              <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Review Required</h3>
                 <h2 className="text-2xl font-display font-bold text-neutral-900">Priority Queue</h2>
              </div>
              <div className="flex flex-col gap-6">
                 {approvalQueue.map((file, idx) => (
                   <div key={idx} className="p-6 rounded-[32px] border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group/q">
                      <div className="flex items-start justify-between mb-4">
                         <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-neutral-900 line-clamp-1">{file.name}</h4>
                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{file.size} • {file.uploadedBy}</p>
                         </div>
                         <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock size={14} />
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-neutral-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">Approve</button>
                         <button className="flex-1 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-red-600 transition-all">Reject</button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-4 border border-dashed border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-all">
                 View History
              </button>
           </div>

           {/* Cloud Status */}
           <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-neutral-900 text-white flex flex-col gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="space-y-2 relative z-10">
                 <h4 className="text-lg font-bold">Cloud Sync Active</h4>
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/70">
                    <span>Usage</span>
                    <span className="text-white">12.4GB / 50GB</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="h-full bg-white" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
