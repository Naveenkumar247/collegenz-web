'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
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
      // Fix: Clean token accurately
      const cleanToken = token?.replace(/^"|"$/g, '');

      if (!cleanToken) {
        router.push('/login');
        return;
      }

      try {
        // Fix: Absolute URL ensures no more 404s
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Data unpacking
          const parsedUser = data.user || data.data || data;
          setUserData(parsedUser);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setFetchError(`Server Error: ${response.status}`);
        }
      } catch (err: any) {
        setFetchError('Connection failed');
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchUserProfile();
  }, [isMounted, router]);

  if (!isMounted || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Data Mappings
  const profileName = userData?.name || userData?.username || 'Unknown User';
  const profileRole = userData?.zrole || userData?.role || 'user';
  const accountType = userData?.accountType || 'Public Account';
  const bioText = userData?.bio || 'No bio provided.';
  const avatarUrl = userData?.picture || userData?.avatar || 'https://placehold.co/100x100/png?text=User';

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-16">
      <div className="bg-emerald-700 h-28 w-full px-4 pt-4">
        <button onClick={() => router.push('/feed')} className="text-white text-xl">←</button>
      </div>

      <div className="px-5 relative -mt-10 mb-3">
        <img 
          src={avatarUrl} 
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-slate-100"
          onError={(e) => {
            // 🟢 CRITICAL FIX: Stops the infinite console error loop
            e.currentTarget.onerror = null; 
            e.currentTarget.src = 'https://placehold.co/100x100/png?text=User'; 
          }}
        />
      </div>

      <div className="px-5 space-y-4">
        <div>
          <h1 className="text-lg font-bold capitalize text-slate-950">{profileName}</h1>
          <p className="text-xs text-slate-400">{accountType} | {profileRole}</p>
        </div>

        {fetchError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100">
            ⚠️ {fetchError}
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">{bioText}</p>
      </div>
    </div>
  );
}
