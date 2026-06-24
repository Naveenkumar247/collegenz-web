'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// 1. Move the interactive hook logic to a sub-component inside the Suspense shield
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state: any) => state.setToken);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      router.replace('/feed');
    }
  }, [searchParams, router, setToken]);

  const handleGoogleLogin = () => {
    window.location.href = 'https://collegenz-api.onrender.com/api/v1/auth/google';
  };

  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/feed');
  };

  return (
    <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">CollegenZ</h1>
        <p className="text-sm text-slate-400">The AI-Powered Student Ecosystem</p>
      </div>

      {/* Google Authentication */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center my-4 before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10 text-xs text-slate-500 text-center px-2">
        <span className="px-3">Or regular credentials</span>
      </div>

      {/* Regular Credentials */}
      <form onSubmit={handleRegularLogin} className="space-y-4">
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
  );
}

// 2. Default export page component wraps everything in Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <Suspense fallback={
        <div className="text-center text-xs text-slate-500 animate-pulse">
          Loading authentication components...
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}
