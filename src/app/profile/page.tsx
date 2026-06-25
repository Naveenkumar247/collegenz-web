'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  // Layout states
  const [isMounted, setIsMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('grid');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserProfile = async (token: string) => {
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
          setUserData(data);
        }
      } catch (err) {
        console.error('Failed to retrieve core profile metrics:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanToken = token?.startsWith('"') && token?.endsWith('"') ? token.slice(1, -1) : token;

    if (cleanToken) {
      if (!isAuthenticated && setToken) {
        setToken(cleanToken);
      }
      fetchUserProfile(cleanToken);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authRedirectTarget', '/profile');
      }
      router.push('/login');
    }
  }, [isAuthenticated, isMounted, router, setToken]);

  if (!isMounted || checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans text-xs text-slate-400">
        Syncing user cluster parameters...
      </div>
    );
  }

  // Fallback defaults mapping to your mockup data criteria exactly
  const profileName = userData?.name || 'Naveen kumar';
  const profileRole = userData?.zrole || 'admin';
  const accountType = userData?.accountType || 'Public Account';
  const bioText = userData?.bio || 'Developer of the CollegenZ';
  const avatarUrl = userData?.picture || 'https://collegenz.in/uploads/profilepic.jpg';
  
  const followersCount = userData?.followers?.length || 8;
  const followingCount = userData?.following?.length || 4;
  const pointsCount = userData?.points || 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative pb-16">
      
      {/* 🟢 TOP ACCENT HEADER BLOCK (Matches Reference Layout Height perfectly) */}
      <div className="bg-emerald-700 h-28 w-full relative px-4 pt-4 flex items-start justify-between">
        <button 
          onClick={() => router.push('/feed')}
          className="bg-transparent border-0 text-white text-lg p-1 cursor-pointer focus:outline-none"
        >
          ←
        </button>
        <div className="bg-emerald-800/60 border border-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-medium tracking-wide">
          Public
        </div>
      </div>

      {/* AVATAR OVERLAY WRAPPER */}
      <div className="px-5 relative -mt-10 mb-3 flex items-end justify-between">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
          <img 
            src={avatarUrl} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* MAIN IDENTITY DATA METRICS BLOCK */}
      <div className="px-5 space-y-4">
        
        {/* Name and Title Metadata */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{profileName}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {accountType} | <span className="text-slate-400 font-mono text-[11px]">{profileRole}</span>
            </p>
            <p className="text-xs text-slate-600 font-normal pt-1">{bioText}</p>
          </div>
          
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 cursor-pointer">
            <span>📝</span>
            <span>Edit</span>
          </button>
        </div>

        {/* 📊 NUMERICAL ENGAGEMENT MATRIX ROW */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center border-t border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">{followersCount}</p>
            <p className="text-[10px] text-slate-400 font-medium">followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{followingCount}</p>
            <p className="text-[10px] text-slate-400 font-medium">following</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{pointsCount}</p>
            <p className="text-[10px] text-slate-400 font-medium">Points</p>
          </div>
        </div>

        {/* 🗂️ ICON TAB SEGMENTATION HEADER */}
        <div className="flex justify-around items-center pt-1 border-b border-slate-100">
          {[
            { id: 'grid', icon: '🎰' },
            { id: 'brain', icon: '🧠' },
            { id: 'chart', icon: '📈' },
            { id: 'wallet', icon: '🪙' },
            { id: 'bookmark', icon: '🔖' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-lg bg-transparent border-0 cursor-pointer transition-all border-b-2 px-4 ${
                activeTab === tab.id 
                  ? 'border-emerald-600 filter-none opacity-100' 
                  : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* LOWER GRID LAYOUT PORTFOLIO FEED */}
        <div className="pt-2 animate-fadeIn">
          {activeTab === 'grid' ? (
            <div className="grid grid-cols-1 gap-4">
              {/* Target Image Showcase Block element matching your uploaded view */}
              <div className="w-full max-w-[280px] p-2 rounded-xl bg-white border border-slate-100">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vodafone_Idea_Logo.svg/1200px-Vodafone_Idea_Logo.svg.png" 
                  alt="Post content visualization" 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400 font-mono">
              Empty repository branch dataset.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
