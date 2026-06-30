'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [company, setCompany] = useState('');
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Registration failed');
        return;
      }

      router.push(data.user.role === 'admin' ? '/admin' : '/client');
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create account</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Register as an admin or client user.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="vlocal-input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Role
            </label>
            <select
              id="role"
              className="vlocal-input w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Company (optional)
            </label>
            <input
              id="company"
              type="text"
              className="vlocal-input w-full"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="vlocal-btn w-full bg-[var(--accent)] text-neutral-900 font-bold"
          >
            {loading ? 'Creating account...' : 'Register'}
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
