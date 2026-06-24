'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore'; // Assumed Zustand store name

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state: any) => state.setToken); // Your store mutation

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Save the token to local storage/state and redirect to feed
      setToken(token);
      router.replace('/feed');
    }
  }, [searchParams, router, setToken]);

  const handleGoogleLogin = () => {
    // Redirect browser directly to the live backend Google trigger endpoint
    window.location.href = 'https://collegenz-api.onrender.com/api/v1/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">CollegenZ</h1>
          <p className="text-sm text-slate-400">The AI-Powered Student Ecosystem</p>
        </div>

        {/* Brand New Google Authentication Option Button */}
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

        {/* Your standard login form fields remain here below... */}

      </div>
    </div>
  );
}
