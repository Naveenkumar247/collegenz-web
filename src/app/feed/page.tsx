'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { postsService } from '@/services/posts.service';
import PostCard from '@/components/feed/PostCard';

function FeedContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState('recent');
  const [feedLoading, setFeedLoading] = useState(true);

  // Mock array to map out your Instagram style stories
  const dummyStories = [
    { title: 'Palantir Tech', text: 'Exploring data impacts...', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', bg: 'bg-slate-950' },
    { title: 'Anduril Corp', text: 'Anduril Industries is an...', img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150', bg: 'bg-indigo-900' },
    { title: 'Ollama AI', text: 'Ollama is an open-source...', img: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150', bg: 'bg-zinc-800' },
    { title: 'Bloomberg', text: 'Bloomberg is a global...', img: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=150', bg: 'bg-blue-950' },
  ];

  useEffect(() => {
    const loadFeed = async () => {
      setFeedLoading(true);
      try {
        const feedData = await postsService.getFeed(filter, 1);
        setPosts(Array.isArray(feedData) ? feedData : []);
      } catch (err) {
        console.error('Error fetching stream data:', err);
      } finally {
        setFeedLoading(false);
      }
    };
    loadFeed();
  }, [filter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 💎 1. Featured Content Horizontal Reels Container */}
      <section className="bg-white rounded-xl p-4 border border-[#cbd5e1]">
        <h2 className="font-['Poppins'] font-semibold text-sm text-[#334155] mb-3">Featured Post</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
          {dummyStories.map((story, i) => (
            <div 
              key={i} 
              className={`w-[110px] h-[175px] rounded-xl flex flex-col justify-between p-2 flex-shrink-0 snap-start text-white bg-cover bg-center relative overflow-hidden shadow-sm before:absolute before:inset-0 before:bg-black/40`}
              style={{ backgroundImage: `url(${story.img})` }}
            >
              <div className="relative z-10 flex items-center gap-1.5 bg-black/30 w-fit px-1.5 py-0.5 rounded-full text-[9px]">
                <div className="w-2 h-2 rounded-full bg-green-500 border border-white" />
                <span className="font-medium opacity-90">User</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-xs font-bold font-['Poppins'] truncate mb-0.5">{story.title}</h4>
                <p className="text-[9px] opacity-75 line-clamp-2 leading-tight m-0">{story.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 👥 2. Two Column Main Dashboard Workspace Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Core Post Timeline Collection Deck */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Feed Quick Filter Headers */}
          <div className="flex space-x-2 p-1 bg-white border border-[#cbd5e1] rounded-xl shadow-sm mb-4">
            {['recent', 'event', 'hiring'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-1 text-center capitalize text-xs py-2.5 rounded-lg transition-all ${
                  filter === cat 
                    ? 'bg-[#228B22] text-white font-medium shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {feedLoading ? (
            <div className="text-center py-10 text-xs text-slate-400 animate-pulse">
              Syncing live network matrix updates...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#cbd5e1] rounded-xl text-slate-500 text-sm">
              No active listings found in this cluster.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((item: any) => (
                <PostCard key={item._id} post={item} />
              ))}
            </div>
          )}
        </div>

        {/* 📊 3. Sticky Contextual Sidebar Widgets Frame */}
        <div className="hidden lg:block sticky top-6 space-y-4">
          <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0] border-t-4 border-t-[#228B22] rounded-xl p-5 text-center shadow-sm">
            <div className="text-4xl text-[#228B22] mb-3">
              <i className="bi bi-question-circle"></i>
            </div>
            <h3 className="font-['Poppins'] font-semibold text-base text-[#14532d] mb-2">Do you know what is going on?</h3>
            <p className="text-xs text-[#14532d]/80 leading-relaxed m-0">
              Connect globally with college networks, trace ongoing placement seasons, and trade info metrics seamlessly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs text-slate-400">Loading workspace components...</div>}>
      <FeedContent />
    </Suspense>
  );
}
