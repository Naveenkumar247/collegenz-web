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
  
  // Mobile Network Debug Logs
  const [diagnosticLog, setDiagnosticLog] = useState<string>('Initializing network stream...');
  const [rawPayload, setRawPayload] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle User Session Hydration from LocalStorage safely on mobile viewports
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

  // Execute Core Feed Data Fetching Loop
  useEffect(() => {
    if (!isMounted) return;

    const loadFeed = async () => {
      setFeedLoading(true);
      setDiagnosticLog('Sending API Request to Render...');
      setRawPayload(null);
      
      try {
        const feedData = await postsService.getFeed(filter, 1);
        
        setDiagnosticLog(`API Status: 200 OK. Received ${Array.isArray(feedData) ? feedData.length : 0} items from the database.`);
        setRawPayload(JSON.stringify(feedData));

        if (Array.isArray(feedData)) {
          setPosts(feedData);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        const errorMsg = err.response 
          ? `Error Status ${err.response.status}: ${JSON.stringify(err.response.data)}` 
          : err.message || 'Network Failure reaching Render App cluster Gateway';
        setDiagnosticLog(`🚨 Request Failed: ${errorMsg}`);
        console.error(err);
      } finally {
        setFeedLoading(false);
      }
    };

    loadFeed();
  }, [filter, isAuthenticated, isMounted]);

  if (!isMounted) return <div className="p-6 text-white text-xs font-mono">Connecting Gateway...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 font-sans">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* 📱 LIVE MOBILE CONSOLE DIAGNOSTIC PANEL */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs space-y-2">
          <p className="text-indigo-400 font-bold">📡 Mobile API Network Console:</p>
          <div className="p-2 bg-black/40 rounded border border-white/5 text-slate-300 break-all">
            {diagnosticLog}
          </div>
          {rawPayload && (
            <div>
              <p className="text-emerald-400 font-bold mt-2">📦 Raw Server Response Payload:</p>
              <pre className="p-2 bg-black/40 rounded border border-white/5 text-slate-400 overflow-x-auto max-h-40 text-[10px]">
                {rawPayload}
              </pre>
            </div>
          )}
        </div>

        {/* Tab Selection Navigation Header Layout Row */}
        <div className="flex space-x-2 p-1 bg-white/5 rounded-xl">
          {['recent', 'event', 'hiring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 text-center capitalize text-xs py-2 rounded-lg transition-all ${
                filter === cat ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 bg-transparent border-0'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Rendering System Engine */}
        {feedLoading ? (
          <div className="text-center py-6 text-xs text-slate-500 animate-pulse">Querying database pool...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-xs">
            Query returned no renderable posts.
          </div>
        ) : (
          <div className="space-y-4">
            {posts
              // 🟢 FIX: Allows documents with type "general" to pass safely onto your "Recent" main display tab pipeline
              .filter((item: any) => {
                if (filter === 'recent') return true; 
                return String(item.type).toLowerCase() === filter.toLowerCase();
              })
              .map((item: any) => (
                <PostCard key={item._id} post={item} />
              ))}
          </div>
        )}

      </div>
    </div>
  );
}
