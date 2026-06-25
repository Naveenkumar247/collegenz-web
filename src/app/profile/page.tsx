'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state: any) => state.setToken);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirectTo') || '/feed';

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailOrUsername, // Backend verification match point
          password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password credentials.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (setToken) setToken(data.token);
        router.push(redirectTo);
      } else {
        throw new Error('Authentication payload missing token parameters.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to contact authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Forward directly to your NestJS backend Passport Google Strategy endpoint
    window.location.href = 'https://collegenz-api.onrender.com/api/v1/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      
      {/* 🟢 Clean Light Panel Container (Matches Image 2 Layout Spec Exactly) */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-5 text-center">
        
        {/* Centralized Avatar Block */}
        <div className="space-y-2">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto flex items-center justify-center overflow-hidden border border-slate-100">
            <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Login</h1>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-[11px] text-red-600 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Input Interactive Form Layer */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-3 text-left">
          
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">✉️</span>
            <input 
              type="text" 
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email or Username" 
              required
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition-all placeholder-slate-400"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔒</span>
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              required
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition-all placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 text-xs bg-transparent border-0 cursor-pointer"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm border-0 cursor-pointer mt-1"
          >
            {loading ? 'Authenticating Access...' : 'Login'}
          </button>
        </form>

        {/* Decorative Divider Element Block */}
        <div className="relative flex py-1 items-center justify-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-medium">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* 🟢 GOOGLE SIGN IN IDENTITY BUTTON WIDGET */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          {/* SVG Google Identity Vector Graphics Markup Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.973 0 12 0 7.354 0 3.307 2.673 1.243 6.582l4.023 3.183z" />
            <path fill="#4285F4" d="M23.455 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.418a5.485 5.485 0 0 1-2.382 3.591l3.718 2.882c2.173-2.009 3.427-4.964 3.427-8.609z" />
            <path fill="#FBBC05" d="M5.266 14.235A7.024 7.024 0 0 1 4.909 12c0-.791.137-1.555.357-2.265L1.243 6.582A11.933 11.933 0 0 0 0 12c0 1.927.455 3.745 1.243 5.382l4.023-3.147z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.955-1.073 7.945-2.909l-3.718-2.882c-1.036.691-2.355 1.118-4.227 1.118-3.636 0-6.718-2.455-7.818-5.755L1.16 16.718A11.947 11.947 0 0 0 12 24z" />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Footer Navigation Link */}
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <span 
            onClick={() => router.push('/signup')} 
            className="text-emerald-600 hover:underline font-semibold cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-xs font-mono bg-[#f3f4f6] min-h-screen">Loading Gateway...</div>}>
      <LoginContent />
    </Suspense>
  );
}
