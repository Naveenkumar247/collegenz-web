'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('grid');
  
  const hasFetched = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserProfile = async (token: string) => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("DEBUG: API Profile Data Received:", data); // 🟢 VERIFY THIS IN CONSOLE
          setUserData(data);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to retrieve profile:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanToken = token?.replace(/"/g, '');

    if (cleanToken) {
      fetchUserProfile(cleanToken);
    } else {
      router.push('/login');
    }
  }, [isMounted, router]);

  if (!isMounted || checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-xs">Syncing profile...</div>;
  }

  // 🟢 FIXED: Removed hard-coded 'Naveen Kumar' defaults.
  // Now if the API data is missing, it shows 'Unknown User'
  const profileName = userData?.name || 'Unknown User';
  const profileRole = userData?.zrole || 'user';
  const accountType = userData?.accountType || 'Public Account';
  const bioText = userData?.bio || 'No bio provided.';
  const avatarUrl = userData?.picture || 'https://collegenz.in/uploads/profilepic.jpg';
  
  const followersCount = userData?.followers?.length ?? 0;
  const followingCount = userData?.following?.length ?? 0;
  const pointsCount = userData?.points ?? 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative pb-16">
      <div className="bg-emerald-700 h-28 w-full px-4 pt-4 flex items-start justify-between">
        <button onClick={() => router.push('/feed')} className="text-white">←</button>
      </div>

      <div className="px-5 relative -mt-10 mb-3">
        <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white object-cover" />
      </div>

      <div className="px-5 space-y-4">
        <h1 className="text-lg font-bold capitalize">{profileName}</h1>
        <p className="text-xs text-slate-500">{accountType} | {profileRole}</p>
        <p className="text-xs text-slate-600">{bioText}</p>

        <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-slate-100">
          <div><p className="font-bold">{followersCount}</p><p className="text-[10px] text-slate-400">followers</p></div>
          <div><p className="font-bold">{followingCount}</p><p className="text-[10px] text-slate-400">following</p></div>
          <div><p className="font-bold">{pointsCount}</p><p className="text-[10px] text-slate-400">Points</p></div>
        </div>
        
        {/* Rest of your UI... */}
      </div>
    </div>
  );
}
