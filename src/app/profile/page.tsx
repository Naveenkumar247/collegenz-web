'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// Dynamic API base URL with custom domain fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.collegenz.in/api/v1';

export default function ProfilePage() {
  const router = useRouter();
  const { setUser } = useAuthStore((state: any) => state);
  
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
      const cleanToken = token?.replace(/^"|"$/g, '');

      // 1. Unauthenticated Guard
      if (!cleanToken) {
        sessionStorage.setItem('authRedirectTarget', '/profile');
        router.push('/login');
        return;
      }

      try {
        // 2. Query active API endpoint using environment variable / custom domain
        let response = await window.fetch(`${API_BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        });

        // Fallback check if route is registered under /auth/profile
        if (response.status === 404) {
          response = await window.fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${cleanToken}`,
              'Content-Type': 'application/json',
            },
          });
        }
        
        if (response.ok) {
          const data = await response.json();
          const parsedUser = data.user || data.data || data;
          setUserData(parsedUser);
          if (setUser) setUser(parsedUser);
        } else if (response.status === 401 || response.status === 404) {
          // Clear invalid/expired session and redirect to login
          localStorage.removeItem('token');
          sessionStorage.setItem('authRedirectTarget', '/profile');
          router.push('/login');
        } else {
          setFetchError(`Server Error: ${response.status}`);
        }
      } catch (err: any) {
        setFetchError('Connection failed. Please check network connectivity.');
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchUserProfile();
  }, [isMounted, router, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    router.push('/login');
  };

  if (!isMounted || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Fallback Data Mappings
  const profileName = userData?.name || userData?.username || 'Unknown User';
  const profileRole = userData?.zrole || userData?.role || 'user';
  const accountType = userData?.accountType || 'Public Account';
  const bioText = userData?.bio || 'No bio provided.';
  const avatarUrl = userData?.picture || userData?.avatar || 'https://placehold.co/100x100/png?text=User';

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-16 font-sans">
      <div className="bg-emerald-700 h-28 w-full px-4 pt-4 flex justify-between items-start">
        <button onClick={() => router.push('/feed')} className="text-white text-xl cursor-pointer">←</button>
        <button 
          onClick={handleLogout} 
          className="text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      <div className="px-5 relative -mt-10 mb-3">
        <img 
          src={avatarUrl} 
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-slate-100"
          onError={(e) => {
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
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 font-medium">
            ⚠️ {fetchError}
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">{bioText}</p>
      </div>
    </div>
  );
}
