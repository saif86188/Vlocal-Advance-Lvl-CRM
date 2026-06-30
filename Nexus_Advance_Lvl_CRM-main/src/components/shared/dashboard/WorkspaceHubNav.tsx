'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FolderOpen, 
  MessageSquare, 
  Wallet, 
  BarChart3, 
  AlertCircle 
} from 'lucide-react';

const hubItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/client/campaign-dashboard' },
  { id: 'status', label: 'Status', icon: TrendingUp, to: '/client/campaign-status' },
  { id: 'files', label: 'Files', icon: FolderOpen, to: '/client/campaign-files' },
  { id: 'communication', label: 'Chat', icon: MessageSquare, to: '/client/campaign-communication' },
  { id: 'budget', label: 'Finance', icon: Wallet, to: '/client/campaign-budget' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, to: '/client/campaign-analytics' },
  { id: 'support', label: 'Escalations', icon: AlertCircle, to: '/client/support' },
];

export function WorkspaceHubNav() {
  const pathname = usePathname();

  return (
    <div className="mb-12 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      <nav className="flex items-center gap-1.5 bg-white/40 backdrop-blur-2xl rounded-[24px] p-2 w-max md:w-full max-w-5xl mx-auto border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative">
        {hubItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.id}
              href={item.to}
              className={`relative flex items-center gap-2.5 px-5 md:px-7 py-3 rounded-[18px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] transition-all duration-500 group whitespace-nowrap ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="hub-pill-v2"
                  className="absolute inset-0 bg-neutral-900 rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.2)] z-0"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                <item.icon size={15} className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-neutral-900'}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </span>
              
              {/* Subtle status dot for specific items (mocked) */}
              {['status', 'communication', 'support'].includes(item.id) && !isActive && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
