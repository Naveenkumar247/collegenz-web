'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Your authentication trigger logic will go here
    router.push('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      {/* Premium Glassmorphic Card Container */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">CollegenZ</h1>
          <p className="text-sm text-slate-400">The AI-Powered Student Ecosystem</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 mt-2 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
