'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const cleanToken = token?.replace(/"/g, '');

      if (!cleanToken) {
        console.warn("[Profile] Access denied: No token discovered in localStorage.");
        router.push('/login');
        return;
      }

      try {
        console.log("[Profile] Dispatching profile lookup to Core API Instance...");
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("[Profile] Production payload parsed successfully:", data);
          
          // 🟢 CRITICAL: Unpack nested architecture safely if wrapped by NestJS intercepts
          const parsedUser = data.user || data.data || data;
          setUserData(parsedUser);
        } else {
          console.error(`[Profile] Target endpoint rejected requests with status: ${response.status}`);
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
          } else {
            setFetchError(`Server Error: ${response.statusText} (${response.status})`);
          }
        }
      } catch (err: any) {
        console.error('[Profile] Critical network exceptions caught:', err);
        setFetchError(err.message || 'Network connectivity fault detected.');
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchUserProfile();
  }, [isMounted, router]);

  if (!isMounted || checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 space-y-3">
        <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs tracking-wide text-slate-400 font-medium">Syncing profile identity...</div>
      </div>
    );
  }

  // Exhaustive state mappings targeting schema structural changes
  const profileName = userData?.name || userData?.username || 'Unknown User';
  const profileRole = userData?.zrole || userData?.role || 'user';
  const accountType = userData?.accountType || 'Public Account';
  const bioText = userData?.bio || 'No bio provided.';
  const avatarUrl = userData?.picture || userData?.avatar || 'https://collegenz.in/uploads/profilepic.jpg';
  
  const followersCount = userData?.followers?.length ?? 0;
  const followingCount = userData?.following?.length ?? 0;
  const pointsCount = userData?.points ?? 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative pb-16">
      {/* Dynamic Header Assembly */}
      <div className="bg-emerald-700 h-28 w-full px-4 pt-4 flex items-start justify-between">
        <button 
          onClick={() => router.push('/feed')} 
          className="text-white text-xl font-bold p-1 hover:opacity-80 transition-opacity"
          aria-label="Back to feed"
        >
          ←
        </button>
      </div>

      {/* Profile Picture Frame */}
      <div className="px-5 relative -mt-10 mb-3">
        <img 
          src={avatarUrl} 
          alt={`${profileName}'s profile card`} 
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-slate-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://collegenz.in/uploads/profilepic.jpg';
          }}
        />
      </div>

      {/* Identity Content Area */}
      <div className="px-5 space-y-4">
        <div>
          <h1 className="text-lg font-bold capitalize text-slate-950">{profileName}</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {accountType} <span className="text-slate-200 mx-1">|</span> <span className="capitalize text-slate-500">{profileRole}</span>
          </p>
        </div>

        {/* Runtime API Alert Box */}
        {fetchError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100 shadow-sm">
            ⚠️ {fetchError}. Verify pipeline configurations or cycle authentication.
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed max-w-sm">{bioText}</p>

        {/* User Interaction Metrics Dashboard */}
        <div className="grid grid-cols-3 gap-2 py-3 text-center border-y border-slate-100 my-2">
          <div className="p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer">
            <p className="font-bold text-slate-950 text-base">{followersCount}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">followers</p>
          </div>
          <div className="p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer">
            <p className="font-bold text-slate-950 text-base">{followingCount}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">following</p>
          </div>
          <div className="p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer">
            <p className="font-bold text-emerald-700 text-base">{pointsCount}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">Points</p>
          </div>
        </div>
        
        {/* Context Feed Injection Container */}
        <div className="mt-4 text-center py-10 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Activity metrics and shared history modules will initialize below.
        </div>
      </div>
    </div>
  );
}
