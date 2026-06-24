'use client';

import React, { useEffect, useState } from 'react';
import { postsService } from '@/services/posts.service';
import PostCard from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('recent');
  const [feedLoading, setFeedLoading] = useState(true);

  // Auth Protection Shield Check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Dynamic Data Sync Execution Hook
  useEffect(() => {
    if (isAuthenticated) {
      const loadFeed = async () => {
        setFeedLoading(true);
        try {
          const feedData = await postsService.getFeed(filter, 1);
          setPosts(feedData);
        } catch (err) {
          console.error('Error compiling network feed:', err);
        } finally {
          setFeedLoading(false);
        }
      };
      loadFeed();
    }
  }, [filter, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Authenticating gateway connection...
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
