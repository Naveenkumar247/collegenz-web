'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  // Layout states
  const [isMounted, setIsMounted] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchFeedData = async (token: string) => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        // Fetch posts from your backend API engine endpoints
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
          setFeaturedPosts(data.featured || []);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.setItem('authRedirectTarget', '/feed');
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to compile feed metrics stream:', err);
      } finally {
        setLoadingFeed(false);
      }
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanToken = token?.startsWith('"') && token?.endsWith('"') ? token.slice(1, -1) : token;

    if (cleanToken) {
      if (!isAuthenticated && setToken) {
        setToken(cleanToken);
      }
      fetchFeedData(cleanToken);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authRedirectTarget', '/feed');
      }
      router.push('/login');
    }
  }, [isMounted, router]);

  // 🎰 🟢 RESPONSIVE SKELETON LAYOUT (Matches 1000149444.jpg & 1000149445.jpg perfectly)
  if (!isMounted || loadingFeed) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans animate-pulse pb-16">
        
        {/* Top App Header Banner */}
        <div className="bg-[#15803d] h-14 w-full sticky top-0 z-50 flex items-center justify-between px-4 shadow-sm">
          <div className="h-5 bg-emerald-600/50 rounded w-24" />
          <div className="flex space-x-4">
            <div className="h-5 w-5 rounded-full bg-emerald-600/50" />
            <div className="h-5 w-5 rounded-full bg-emerald-600/50" />
            <div className="h-5 w-5 rounded-full bg-emerald-600/50" />
          </div>
        </div>

        {/* Outer Grid Splitting Frame */}
        <div className="max-w-[1200px] mx-auto flex gap-6 pt-4 px-4">
          
          {/* Left Navigation Sidebar - Hidden on mobile, flex on desktop */}
          <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-100 rounded-2xl p-4 space-y-4 h-fit shadow-xs">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-3 py-1">
                <div className="h-4 w-4 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>

          {/* Main Core Content Center Column */}
          <div className="flex-1 max-w-2xl space-y-4 w-full mx-auto">
            
            {/* Featured Cards Slider Box Container */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="flex space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((card) => (
                  <div key={card} className="w-[105px] h-[165px] shrink-0 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Vertical Infinite Scrolling Cards List */}
            {[1, 2].map((post) => (
              <div key={post} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-slate-200 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-28" />
                    <div className="h-2.5 bg-slate-200 rounded w-14" />
                  </div>
                </div>
                <div className="w-full h-60 bg-slate-200 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Desktop Info Widget Frame */}
          <div className="hidden lg:block w-72 shrink-0 bg-white border border-slate-100 rounded-2xl p-4 h-32 shadow-xs" />

        </div>

        {/* Sticky Lower Navigation Strip - Mobile Exclusive viewports */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-100 flex justify-around items-center px-2 z-50 shadow-md">
          <div className="h-5 w-5 bg-slate-200 rounded" />
          <div className="h-5 w-5 bg-slate-200 rounded" />
          <div className="h-8 w-8 bg-slate-200 rounded-full" />
          <div className="h-5 w-5 bg-slate-200 rounded" />
          <div className="h-5 w-5 bg-slate-200 rounded" />
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans pb-16">
      {/* 🟢 Live Data Formats Render Here When Fetch Completes Successfully */}
      <div className="p-4 text-center text-xs text-slate-400 font-mono">
        CollegenZ Live Feed Active Workspace Stream.
      </div>
    </div>
  );
}
