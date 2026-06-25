'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// Next.js requires useSearchParams to run inside a Suspense barrier for static optimization safety
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state: any) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🟢 ROUTING UPGRADE: Grab the target value out of the URL string parameters, fallback to generic /feed
  const redirectTo = searchParams.get('redirectTo') || '/feed';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid authorization credentials provided.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (setToken && typeof setToken === 'function') {
          setToken(data.token);
        }
        
        // 🟢 ROUTING UPGRADE: Securely drop user into their tracked personal view path target
        router.push(redirectTo);
      } else {
        throw new Error('Authentication did not return a valid data handshake payload.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection lost to validation gateways.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
      {/* LinkedIn/Instagram Glassmorphic Styling Card wrapper container layout element */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl space-y-5 shadow-2xl">
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">Welcome to CollegenZ</h1>
          <p className="text-xs text-slate-400">Enter your credentials to unlock your profile</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-[11px] text-red-400 text-center font-medium">
            🚨 {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-0.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-all text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-0.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-all text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium text-xs py-2.5 rounded-xl transition-all shadow-md mt-2 border-0 cursor-pointer"
          >
            {loading ? 'Authenticating Gateway Pipeline...' : 'Secure Secure Login'}
          </button>
        </form>

      </div>
    </div>
  );
}

// Global default export wrapped in standard Next.js suspense threshold bounds
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white text-xs font-mono bg-slate-950 min-h-screen">Loading Gateway...</div>}>
      <LoginContent />
    </Suspense>
  );
}
