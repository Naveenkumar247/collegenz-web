'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { setToken, isAuthenticated } = useAuthStore((state: any) => state);

  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🟢 1. AUTOMATED HANDSHAKE: Intercept token parameters arriving via Google OAuth URLs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        // Normalize token syntax structures
        const cleanToken = urlToken.startsWith('"') && urlToken.endsWith('"') 
          ? urlToken.slice(1, -1) 
          : urlToken;

        // Persist session parameters to local engines
        localStorage.setItem('token', cleanToken);
        
        if (setToken) {
          setToken(cleanToken);
        }

        // Pull previous route target configuration, falling back securely to profile layout
        const targetRedirect = sessionStorage.getItem('authRedirectTarget') || '/profile';
        sessionStorage.removeItem('authRedirectTarget');
        
        // Dispatch instant routing forward redirection
        router.push(targetRedirect);
      }
    }
  }, [router, setToken]);

  // 🟢 2. STANDARD INLINE AUTHENTICATION: Email/Password credential submit pipeline
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password credentials.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (setToken) {
          setToken(data.token);
        }

        // Forward safely to intended target or default main feed
        const targetRedirect = sessionStorage.getItem('authRedirectTarget') || '/profile';
        sessionStorage.removeItem('authRedirectTarget');
        router.push(targetRedirect);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected connection failure occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 3. GOOGLE INTERACTIVE TRIGGER: Redirects client route window towards OAuth gateway stream
  const handleGoogleOAuthRedirect = () => {
    window.location.href = 'https://collegenz-api.onrender.com/api/v1/auth/google';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6">
        
        {/* Branding header metadata matching UI styles */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400">Sign in to your CollegenZ student profile</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Credentials Form Element block */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none active:scale-[0.98]"
          >
            {loading ? 'Verifying parameters...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center text-slate-300">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* OAuth Stream trigger component wrapper */}
        <button
          onClick={handleGoogleOAuthRedirect}
          type="button"
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer focus:outline-none active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

      </div>
    </div>
  );
}
