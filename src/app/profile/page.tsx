'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuthStore((state: any) => state);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    // 🟢 INTERCEPTION GATEWAY: If not logged in, pass redirect tracking parameter to login page
    if (!isAuthenticated) {
      router.push('/login?redirectTo=/profile');
    }
  }, [isAuthenticated, isLoading, isMounted, router]);

  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans text-xs text-slate-500">
        Verifying secure profile profile validation stream...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Profile Card Header Layout */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-emerald-500 overflow-hidden flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Your Personalized Hub</h1>
            <p className="text-xs text-slate-400 font-mono">Authenticated Member Session</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Placeholder Info Grid layout block element */}
        <div className="space-y-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40">
            <span className="font-semibold text-slate-500 block mb-0.5">Account Privileges</span>
            <span className="text-slate-800">Verified Full-Access Student Core</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40">
            <span className="font-semibold text-slate-500 block mb-0.5">Connected Nodes</span>
            <span className="text-slate-800">CollegenZ Primary Database Infrastructure</span>
          </div>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/feed';
          }}
          className="w-full bg-red-50 border-0 hover:bg-red-100/80 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
        >
          Disconnect Account Session
        </button>
      </div>
    </div>
  );
}
