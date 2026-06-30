import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-[var(--bg-base)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
