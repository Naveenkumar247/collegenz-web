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

  // Auth Protection Shield Check
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

  // Dynamic Data Sync Execution Hook
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
          
          if (Array.isArray(feedData) && feedData.length > 0) {
            setPosts(feedData);
          } else {
            // 🟢 Fallback Stream: Shows if your MongoDB table array comes back empty []
            setPosts([
              {
                _id: "demo1",
                caption: "Welcome to the all-new optimized CollegenZ ecosystem! Your core data sync pipeline is live and active.",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
                createdAt: new Date().toISOString(),
                likesCount: 12,
                author: {
                  username: "Naveen Kumar (Founder)",
                  picture: "https://www.svgrepo.com/show/532362/user.svg"
                }
              },
              {
                _id: "demo2",
                caption: "National AI Student Hackathon registrations are officially kicking off next week. Stay tuned to the Event tab!",
                image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
                createdAt: new Date().toISOString(),
                likesCount: 45,
                author: {
                  username: "CollegenZ Admin",
                  picture: "https://www.svgrepo.com/show/532362/user.svg"
                }
              }
            ]);
          }
        } catch (err: any) {
          // 🐛 Capture exact error details to print on your mobile screen if network crashes
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
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 text-sm flex items-center justify-center">
        Connecting workspace...
      </div>
    );
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
                filter === cat 
                  ? 'bg-indigo-600 text-white font-medium shadow-md' 
                  : 'text-slate-400 hover:text-white bg-transparent border-0'
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
