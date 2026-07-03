'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? data.message ?? 'Login failed');
        return;
      }

      // Check format
      const user = data.data?.user || data.user;
      const role = user?.role;

      const redirectTo =
        searchParams.get('from') ??
        (role === 'admin' ? '/admin' : '/client');

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg-base)] p-6 relative overflow-hidden">
      {/* Floating 3D Geometric Background Shapes */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.15); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(35px) rotate(-180deg) scale(0.9); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.05); }
          50% { transform: translateY(-25px) rotate(90deg) scale(0.95); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .anim-float-1 { animation: float-1 14s infinite ease-in-out; }
        .anim-float-2 { animation: float-2 18s infinite ease-in-out; }
        .anim-float-3 { animation: float-3 22s infinite ease-in-out; }
        .gold-shimmer {
          background: linear-gradient(90deg, var(--accent), #FFEFAF, var(--accent));
          background-size: 200% 100%;
          transition: all 0.3s ease;
        }
        .gold-shimmer:hover:not(:disabled) {
          animation: shimmer 1.5s infinite linear;
          box-shadow: 0 0 25px rgba(251, 193, 58, 0.45);
        }
        .input-glow:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px rgba(251, 193, 58, 0.35) !important;
        }
      `}</style>

      {/* SVG Orbs, Hexagons, Rings */}
      <div className="absolute top-10 left-10 w-44 h-44 anim-float-1 opacity-25 pointer-events-none blur-[2px]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="url(#paint0_linear)" strokeWidth="6" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent)" />
              <stop offset="1" stopColor="#E0A92A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-10 right-10 w-52 h-52 anim-float-2 opacity-20 pointer-events-none blur-[1px]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="url(#paint1_linear)" strokeWidth="4" />
          <defs>
            <linearGradient id="paint1_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5B01B" />
              <stop offset="1" stopColor="var(--accent-light)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-1/3 right-1/4 w-32 h-32 anim-float-3 opacity-30 pointer-events-none blur-[3px]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-[var(--accent)] filter blur-md shadow-2xl" />
      </div>

      <div className="absolute bottom-1/4 left-1/5 w-24 h-24 anim-float-1 opacity-25 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="url(#paint2_radial)" />
          <defs>
            <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(30)">
              <stop stopColor="#FFEFAF" stopOpacity="0.8" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Clickable Logo above card */}
      <Link href="/" className="flex items-center gap-3 mb-6 group transition duration-300 hover:scale-[1.02] z-10">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-white border border-neutral-100">
          <Image src="/icon.png" alt="Vlocal Logo" fill className="object-cover" />
        </div>
        <span className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">
          Vlocal<span className="text-[var(--accent)] italic">Portal</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-white/60 backdrop-blur-[24px] border border-white/80 rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.06),0_4px_16px_rgba(251,193,58,0.04),0_0_80px_rgba(251,193,58,0.08)] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Back Button inside card */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition font-bold uppercase tracking-wider">
          <ArrowLeft size={14} />
          Back to Portal
        </Link>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Sign in</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Access your admin or client dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className="vlocal-input input-glow w-full pl-11"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="vlocal-input input-glow w-full pl-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            </div>
          </div>

          {error ? <p className="text-sm text-red-600 font-semibold">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="vlocal-btn gold-shimmer w-full bg-[var(--accent)] text-neutral-900 font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-sm text-[var(--text-secondary)] mt-6 text-center">
          No account?{' '}
          <Link href="/register" className="font-semibold text-[var(--accent)] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
