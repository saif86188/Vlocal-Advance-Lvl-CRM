'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-10 text-center space-y-8 shadow-2xl"
      >
        <div className="space-y-2">
          <h1 className="text-8xl font-display font-black text-neutral-900 tracking-tighter">404</h1>
          <div className="w-12 h-1.5 bg-[var(--accent)] mx-auto rounded-full" />
          <h2 className="text-2xl font-bold text-neutral-900 mt-4">Page Not Found</h2>
          <p className="text-sm font-medium text-neutral-500">
            The tactical data you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            <Home size={16} />
            Return to Base
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-50 transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
