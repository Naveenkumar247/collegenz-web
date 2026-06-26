'use client';

import React, { useEffect, useState, useRef } from 'react';
import PostCard from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  // Layout States
  const [posts, setPosts] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync token back up from storage securely to state trees
  useEffect(() => {
    if (!isMounted) return;
    const backupToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (backupToken && !isAuthenticated) {
      if (setToken && typeof setToken === 'function') {
        setToken(backupToken);
      }
    }
  }, [isAuthenticated, isMounted, setToken]);

  useEffect(() => {
    if (!isMounted) return;

    const loadDataPools = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      setFeedLoading(true);
      
      try {
        let backupToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const cleanToken = backupToken?.startsWith('"') && backupToken?.endsWith('"') 
          ? backupToken.slice(1, -1) 
          : backupToken;

        const authHeaders: Record<string, string> = {};
        if (cleanToken) {
          authHeaders['Authorization'] = `Bearer ${cleanToken}`;
        }

        // 1. Fetch Featured Panel Cards
        const featuredRes = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts/featured', {
          headers: authHeaders
        });
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setFeaturedPosts(Array.isArray(featuredData) ? featuredData : []);
        }

        // 2. Fetch General Scroll Feed Posts
        const feedRes = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts/feed', {
          headers: authHeaders
        });
        if (feedRes.ok) {
          const feedData = await feedRes.json();
          setPosts(Array.isArray(feedData) ? feedData : []);
        }
      } catch (err) {
        console.error('Data pool connection failed:', err);
      } finally {
        setFeedLoading(false);
      }
    };

    loadDataPools();
  }, [isMounted]);

  const handlePersonalizedRoute = (targetPath: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(targetPath)}`);
    } else {
      router.push(targetPath);
    }
  };

  if (!isMounted) return <div className="p-6 text-slate-500 text-xs font-mono">Connecting Gateway...</div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 px-2 sm:px-4 py-4 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-8 gap-5">

        {/* ================= MAIN COLUMN: CENTER TIMELINE CONTENT ================= */}
        <main className="col-span-1 lg:col-span-5 space-y-4">
          
          {/* Featured Post Card Row */}
          {featuredPosts.length > 0 && (
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-4 shadow-sm">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
                Featured Post
              </h2>
              <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none snap-x overflow-y-hidden">
                {featuredPosts.map((feat: any) => (
                  <div 
                    key={feat._id} 
                    onClick={() => handlePersonalizedRoute(`/posts/${feat._id}`)}
                    className="flex-shrink-0 w-28 h-44 sm:w-[110px] sm:h-[170px] rounded-xl relative overflow-hidden snap-start group border border-slate-200/60 bg-cover bg-center shadow-sm cursor-pointer"
                    style={{ backgroundImage: `url(${feat.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/20 backdrop-blur-sm py-0.5 px-1.5 rounded-full border border-white/10 max-w-[90%]">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white/20" />
                      <span className="text-[8px] text-white font-medium truncate">User</span>
                    </div>
                    <div className="absolute bottom-2 inset-x-2">
                      <p className="text-[9px] sm:text-[10px] text-white font-semibold line-clamp-2 leading-snug">
                        {feat.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Posts or Skeleton Loaders */}
          <div className="space-y-4">
            {feedLoading ? (
              // 🎰 🟢 THE SKELETON: Renders responsive cards during active API loading cycles
              <div className="space-y-4 animate-pulse">
                {[1, 2].map((skeletonIndex) => (
                  <div key={skeletonIndex} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-slate-200 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-slate-200 rounded w-28" />
                        <div className="h-2.5 bg-slate-200 rounded w-16" />
                      </div>
                    </div>
                    <div className="w-full h-56 bg-slate-200 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-slate-400 text-xs">
                No recent feed content found.
              </div>
            ) : (
              // 🟢 Renders real data perfectly using your modular component
              posts.map((item: any) => <PostCard key={item._id} post={item} />)
            )}
          </div>
        </main>

        {/* ================= SIDEBAR COLUMN: RIGHT BANNER LAYOUT ================= */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-4 h-fit">
          <div 
            onClick={() => handlePersonalizedRoute('/personalized-hub')}
            className="bg-[#eefbf4] border border-emerald-100 p-5 rounded-2xl text-center space-y-3 shadow-sm cursor-pointer hover:border-emerald-200 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <span className="text-sm text-emerald-600 font-bold">❓</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-emerald-800">
                Do you know what is going on?
              </h3>
              <p className="text-[11px] text-emerald-700/80 leading-relaxed px-1">
                Connect globally with college networks, trace ongoing placement seasons, and trade info metrics seamlessly.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
