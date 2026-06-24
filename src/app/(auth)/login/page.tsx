'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      router.push('/feed'); // Redirects directly to the student networking feed
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials verified.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      {/* Glassmorphic Container Card */}
      <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">CollegenZ</h1>
          <p className="text-slate-300 text-sm mt-2">The AI-Powered Student Ecosystem</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-200 text-xs font-semibold mb-2 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="you@college.edu"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
