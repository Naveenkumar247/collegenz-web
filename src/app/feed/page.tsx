'use client';

import React, { useEffect, useState } from 'react';
import { postsService } from '@/services/posts.service';
import PostCard from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  // Pull setToken to hydrate the state if needed
  const { isAuthenticated, isLoading, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState('recent');
  const [feedLoading, setFeedLoading] = useState(true);

  // 1. Sync State Hydration Shield Guard
  useEffect(() => {
    // Check if store is unauthenticated but browser has a token saved
    const backupToken = localStorage.getItem('token');
    
    if (backupToken && !isAuthenticated) {
      if (setToken && typeof setToken === 'function') {
        setToken(backupToken);
      }
    } else if (!isLoading && !isAuthenticated && !backupToken) {
      // If truly no token exists anywhere, kick back to login layout safely
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, setToken]);

  // 2. Dynamic Data Sync Execution Hook
  useEffect(() => {
    // Let the network request fire if the state is active OR a local storage key exists
    const hasAccess = isAuthenticated || !!localStorage.getItem('token');
    
    if (hasAccess) {
      const loadFeed = async () => {
        setFeedLoading(true);
        try {
          const feedData = await postsService.getFeed(filter, 1);
          // Safety fallback: Ensure feedData is always parsed as an array
          setPosts(Array.isArray(feedData) ? feedData : []);
        } catch (err) {
          console.error('Error compiling network feed:', err);
        } finally {
          setFeedLoading(false);
        }
      };
      loadFeed();
    }
  }, [filter, isAuthenticated]);

  // 3. Render Check (Bypass screen block if local storage token exists)
  const structuralLoadingCheck = (isLoading || !isAuthenticated) && !localStorage.getItem('token');

  if (structuralLoadingCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm tracking-wide">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating gateway connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-6 md:py-10">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Horizontal Navigation Filtering Hub */}
        <div className="flex space-x-2 p-1 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md">
          {['recent', 'event', 'hiring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 text-center capitalize text-xs py-2.5 rounded-lg transition-all ${
                filter === cat ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Feed Post Stream Loading Deck */}
        {feedLoading ? (
          <div className="text-center py-10 text-xs text-slate-500 animate-pulse">
            Syncing updates from network stream...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 backdrop-blur-sm bg-white/5 border border-white/5 rounded-xl text-slate-400 text-sm">
            No active listings discovered inside this selection.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((item: any) => (
              <PostCard key={item._id} post={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
