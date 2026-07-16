'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Settings } from 'lucide-react';

export default function PortalPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_80%_10%,rgba(251,193,58,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_10%_90%,rgba(251,193,58,0.08)_0%,transparent_50%),linear-gradient(160deg,#F2EDE3_0%,#F5EDD5_40%,#FCEAB0_75%,#F8E090_100%)] bg-fixed p-6 md:p-10 lg:p-20 overflow-x-hidden font-sans">
      
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden shadow-xl flex items-center justify-center bg-white border border-neutral-100">
          <Image src="/icon.png" alt="CODEVATE Logo" fill className="object-cover" priority />
        </div>
        <span className="font-display text-xl md:text-2xl font-bold text-[#171717] tracking-tight">
          CODEVATE<span className="text-[var(--accent)] italic">Portal</span>
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 flex flex-col items-center">
        <h1 className="font-display text-3xl md:text-4xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-4 max-w-[15ch] md:max-w-none">
          Choose your workspace
        </h1>
        <p className="text-base md:text-lg text-[#737373] font-medium max-w-[30ch] md:max-w-none">Select a portal to continue to your dashboard</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-[750px]">
        
        {/* Client Card */}
        <Link 
          href="/client" 
          className="group relative flex flex-col p-8 md:p-10 rounded-[28px] md:rounded-[32px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_rgba(251,193,58,0.15)] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200"
        >
          {/* Top Right Highlight Badge */}
          <span className="absolute top-6 right-6 md:top-8 md:right-8 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-600/30 text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
            Client Portal
          </span>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[22px] bg-[#FDF6E2] border border-[#FBE09C] flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg transition-all duration-500">
            <Monitor className="w-7 h-7 md:w-8 md:h-8 text-neutral-900 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#171717] mb-3">CODEVATEOS</h2>
          <p className="text-sm text-[#737373] leading-relaxed mb-6 md:mb-8 flex-1">
            Access your projects, proposals, payments, and support from one place.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#1a1a1a] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest self-start group-hover:gap-5 transition-all">
            Open Dashboard
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:-rotate-45 transition-transform">→</span>
          </div>
        </Link>

        {/* Admin Card */}
        <Link 
          href="/admin" 
          className="group relative flex flex-col p-8 md:p-10 rounded-[28px] md:rounded-[32px] bg-[#1a1a1a] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--accent)]/10 rounded-full blur-[60px]"></div>
          
          {/* Top Right Highlight Badge */}
          <span className="absolute top-6 right-6 md:top-8 md:right-8 px-3.5 py-1.5 rounded-full bg-[#FBC13A]/15 border border-[#FBC13A]/30 text-[10px] font-black text-[#FBC13A] uppercase tracking-[0.2em] shadow-sm group-hover:bg-[#FBC13A] group-hover:text-[#1a1a1a] group-hover:border-[#FBC13A] transition-all duration-300">
            Admin Panel
          </span>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[22px] bg-white/10 border border-white/15 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg transition-all duration-500">
            <Settings className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">CODEVATECore</h2>
          <p className="text-sm text-white/40 leading-relaxed mb-6 md:mb-8 flex-1">
            Manage clients, campaigns, invoices and all platform operations.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--accent)] text-[#1a1a1a] text-[10px] md:text-xs font-bold uppercase tracking-widest self-start group-hover:gap-5 transition-all">
            Open Panel
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:-rotate-45 transition-transform">→</span>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <p className="mt-12 md:mt-16 text-[10px] md:text-xs text-[#A3A3A3] animate-in fade-in duration-1000 delay-500">
        © 2026 CODEVATE Platform &nbsp;·&nbsp; All rights reserved
      </p>

    </div>
  );
}
