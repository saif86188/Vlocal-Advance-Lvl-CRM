import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] shadow-xl border border-[var(--border-subtle)] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">SIAF <span className="text-[var(--accent)]">ADMIN</span></h1>
            <p className="text-[var(--text-secondary)] font-medium">Sign in to your professional dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@siaf.com"
                  className="vlocal-input w-full pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="vlocal-input w-full pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="vlocal-btn w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-lg shadow-blue-900/10 font-bold text-base h-12"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-[var(--accent)] hover:underline">
                Contact Administrator
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-medium text-[var(--text-muted)] mt-8 uppercase tracking-widest">
          © 2026 SIAF TECHNOLOGY GROUP
        </p>
      </div>
    </div>
  );
}
