'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
        setError(data.error ?? 'Login failed');
        return;
      }

      const redirectTo =
        searchParams.get('from') ??
        (data.user.role === 'admin' ? '/admin' : '/client');

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg-base)] p-6">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Sign in</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Access your admin or client dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="vlocal-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="vlocal-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="vlocal-btn w-full bg-[var(--accent)] text-neutral-900 font-bold"
          >
            {loading ? 'Signing in...' : 'Sign in'}
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
