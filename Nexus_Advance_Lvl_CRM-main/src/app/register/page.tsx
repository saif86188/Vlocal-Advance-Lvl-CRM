'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Mail, Lock, Building2, Phone, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('saif');
  const [email, setEmail] = useState('saif@vlocal.com');
  const [password, setPassword] = useState('saifpassword123');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [company, setCompany] = useState('saif Corp');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          company: company || undefined,
          phone: phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? data.message ?? 'Registration failed');
        return;
      }

      // Read correctly based on api response shape
      const user = data.data?.user || data.user;
      const userRole = user?.role;

      router.push(userRole === 'admin' ? '/admin' : '/client');
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

      {/* SVG Background Elements */}
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

      {/* Clickable Logo above card */}
      <Link href="/" className="flex items-center gap-3 mb-6 group transition duration-300 hover:scale-[1.02] z-10">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-white border border-neutral-100">
          <Image src="/icon.png" alt="Vlocal Logo" fill className="object-cover" />
        </div>
        <span className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">
          Vlocal<span className="text-[var(--accent)] italic">Portal</span>
        </span>
      </Link>

      <div className="w-full max-w-lg bg-white/60 backdrop-blur-[24px] border border-white/80 rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.06),0_4px_16px_rgba(251,193,58,0.04),0_0_80px_rgba(251,193,58,0.08)] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Back Button inside card */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition font-bold uppercase tracking-wider">
          <ArrowLeft size={14} />
          Back to Portal
        </Link>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create account</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Register as an admin or client user.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  className="vlocal-input input-glow w-full pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="vlocal-input input-glow w-full pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="vlocal-input input-glow w-full pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Role
              </label>
              <select
                id="role"
                className="vlocal-input input-glow w-full"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Company (optional)
              </label>
              <div className="relative">
                <input
                  id="company"
                  type="text"
                  className="vlocal-input input-glow w-full pl-11"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Phone (optional)
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  className="vlocal-input input-glow w-full pl-11"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600 font-semibold">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="vlocal-btn gold-shimmer w-full bg-[var(--accent)] text-neutral-900 font-bold flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-sm text-[var(--text-secondary)] mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
