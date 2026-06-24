'use client';

import React, { useEffect, useState } from 'react';
import PostCard from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, isLoading, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Mobile Network Debug Logs
  const [diagnosticLog, setDiagnosticLog] = useState<string>('Initializing network stream...');
  const [targetUrl, setTargetUrl] = useState<string>('Detecting outbound path...');
  const [rawPayload, setRawPayload] = useState<string | null>(null);

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

    const loadFeed = async () => {
      setFeedLoading(true);
      setRawPayload(null);
      
      // 🟢 FIXED: Kept securely as https:// to prevent Mixed Content security rejections
      const hardcodedUrl = 'https://collegenz-api.onrender.com/api/v1/posts/feed';
      setTargetUrl(`NATIVE FETCH SYSTEM | URL: ${hardcodedUrl}`);
      
      try {
        let backupToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const cleanToken = backupToken?.startsWith('"') && backupToken?.endsWith('"') 
          ? backupToken.slice(1, -1) 
          : backupToken;

        const response = await window.fetch(hardcodedUrl, {
          method: 'GET',
          headers: cleanToken ? { 
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        
        const feedData = await response.json();
        
        setDiagnosticLog(`API Status: 200 OK. Received ${Array.isArray(feedData) ? feedData.length : 0} items from direct stream.`);
        setRawPayload(JSON.stringify(feedData));

        if (Array.isArray(feedData)) {
          setPosts(feedData);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        setDiagnosticLog(`🚨 Native Fetch Failed: ${err.message || 'Unknown Network Error'}`);
        console.error(err);
      } finally {
        setFeedLoading(false);
      }
    };

    loadFeed();
  }, [isMounted]);

  if (!isMounted) return <div className="p-6 text-white text-xs font-mono">Connecting Gateway...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 font-sans">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* 📱 DIAGNOSTIC TRACE PANEL */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs space-y-2">
          <p className="text-indigo-400 font-bold">📡 Mobile API Network Console:</p>
          <div className="p-2 bg-black/40 rounded border border-white/5 text-slate-300 break-all">
            {diagnosticLog}
          </div>
          
          <p className="text-amber-400 font-bold text-[11px] pt-1">🔍 Outbound Network Target Path:</p>
          <div className="p-2 bg-black/60 rounded border border-amber-500/20 text-amber-200 text-[11px] break-all">
            {targetUrl}
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

        {/* Post Rendering System */}
        {feedLoading ? (
          <div className="text-center py-6 text-xs text-slate-500 animate-pulse">Querying database pool...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-xs">
            Query returned no renderable posts.
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
