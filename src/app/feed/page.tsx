'use client';

import React, { useEffect, useState } from 'react';
import { postsService } from '@/services/posts.service';
import PostCard from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, isLoading, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState('recent');
  const [feedLoading, setFeedLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // 🐛 Phone Debugging States
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const backupToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (backupToken && !isAuthenticated) {
      if (setToken && typeof setToken === 'function') {
        setToken(backupToken);
      }
    } else if (!isLoading && !isAuthenticated && !backupToken) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, setToken, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const backupToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const hasAccess = isAuthenticated || !!backupToken;
    
    if (hasAccess) {
      const loadFeed = async () => {
        setFeedLoading(true);
        setDebugError(null); // Clear previous errors
        try {
          const feedData = await postsService.getFeed(filter, 1);
          setPosts(Array.isArray(feedData) ? feedData : []);
        } catch (err: any) {
          // 🐛 Capture exact error details to print on your mobile screen
          setDebugError(
            err.response 
              ? `Status ${err.response.status}: ${JSON.stringify(err.response.data)}` 
              : err.message || 'Unknown Network Error'
          );
          console.error('Error compiling network feed:', err);
        } finally {
          setFeedLoading(false);
        }
      };
      loadFeed();
    }
  }, [filter, isAuthenticated, isMounted]);

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950 text-white p-6">Connecting workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* 🐛 LIVE MOBILE DEBUGGER PANEL */}
        {debugError && (
          <div className="bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono p-4 rounded-xl break-all">
            <p className="font-bold border-b border-red-500/30 pb-1 mb-2">🚨 Mobile Network Diagnostic Log:</p>
            {debugError}
          </div>
        )}

        {/* Horizontal Navigation Filtering Hub */}
        <div className="flex space-x-2 p-1 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md">
          {['recent', 'event', 'hiring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 text-center capitalize text-xs py-2.5 rounded-lg transition-all ${
                filter === cat ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-white bg-transparent border-0'
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
        ) : posts.length === 0 && !debugError ? (
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
