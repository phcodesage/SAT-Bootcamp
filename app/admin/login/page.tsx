'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e1f3e] flex flex-col items-center justify-center px-4">
      {/* Return to home link */}
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#f7e0e0] hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Home
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#0e1f3e] px-8 py-6 text-center border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/exceed-logo.png" alt="Exceed Learning" className="h-12 w-auto mx-auto mb-3" />
          <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-[#f7e0e0] text-sm mt-1">Sign in to manage registrations</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-bold text-[#0e1f3e] uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text" required autoComplete="username"
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#ca3433] focus:ring-1 focus:ring-[#ca3433]"
              placeholder="admin"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[#0e1f3e] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#ca3433] focus:ring-1 focus:ring-[#ca3433]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#ca3433] hover:bg-[#ac2c2a] disabled:bg-[#e8a0a0] text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
