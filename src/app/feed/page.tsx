'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchFeedData = async (token: string) => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const fallbackPosts = [
        {
          id: 'default-1',
          authorName: 'naveenkumar247',
          avatarUrl: 'https://collegenz.in/uploads/profilepic.jpg',
          dateString: '4/21/2026',
          postMedia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vodafone_Idea_Logo.svg/1200px-Vodafone_Idea_Logo.svg.png',
          textContent: 'Vodafone Idea Limited (Vi) is one of India\'s leading telecom providers, delivering reliable mobile connectivity, high-speed internet, and digital services to millions of users across the country.'
        }
      ];

      try {
        console.log('📡 Fetching feed from backend with token:', token ? 'Token Exists' : 'No Token');
        
        // 🟢 PATH DIRECTORY FIXES:
        // Try changing '/api/v1/posts' to your exact backend route name if it is different (e.g., '/api/v1/feed')
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📊 Backend response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 Raw data payload received from backend:', data);

          // Map either an array directly or a nested property layout
          const rawPostsArray = Array.isArray(data) ? data : (data.posts || data.data || []);
          
          if (rawPostsArray.length === 0) {
            console.warn('⚠️ Backend returned an empty posts array. Showing fallback.');
            setPosts(fallbackPosts);
            return;
          }

          const normalizedPosts = rawPostsArray.map((p: any) => ({
            id: p._id || p.id,
            authorName: p.author?.name || p.username || p.author || 'Anonymous Student',
            avatarUrl: p.author?.picture || p.avatar || 'https://collegenz.in/uploads/profilepic.jpg',
            dateString: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : p.date || 'Recently',
            postMedia: p.image || p.imageUrl || p.mediaUrl || null,
            textContent: p.content || p.text || p.textContent || ''
          }));

          setPosts(normalizedPosts);
        } else {
          console.error('❌ Server error response:', await response.text());
          if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.setItem('authRedirectTarget', '/feed');
            router.push('/login');
          } else {
            setPosts(fallbackPosts);
          }
        }
      } catch (err) {
        console.error('🚨 Network connection failure hitting backend endpoint:', err);
        setPosts(fallbackPosts);
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

  if (!isMounted || loadingFeed) {
    return (
      <div className="max-w-[1200px] mx-auto flex gap-6 pt-4 px-4 animate-pulse pb-16">
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-100 rounded-2xl p-4 space-y-4 h-fit">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 py-1">
              <div className="h-4 w-4 bg-slate-200 rounded" />
              <div className="h-3 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
        <div className="flex-1 max-w-2xl space-y-4 w-full mx-auto">
          {[1, 2].map((post) => (
            <div key={post} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-slate-200 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-28" />
                  <div className="h-2.5 bg-slate-200 rounded w-14" />
                </div>
              </div>
              <div className="w-full h-48 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto flex gap-6 pt-4 px-4 pb-20 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 space-y-2 h-fit shadow-xs">
        {['Home', 'Community Hubs', 'Courses', 'Internships', 'Placements', 'Events', 'Settings'].map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${item === 'Home' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <span>🏠</span>
            <span>{item}</span>
          </div>
        ))}
      </aside>

      {/* CORE CONTENT MIDDLE COLUMN */}
      <main className="flex-1 max-w-2xl space-y-4 w-full mx-auto">
        
        {/* FEATURED POST SLIDER */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 tracking-tight">Featured Post</h3>
          <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none">
            {[
              { title: 'Palantir', desc: 'Exploring the impact of data-driven intelligence...', color: 'bg-black text-white' },
              { title: 'Ollama', desc: 'Ollama is an open-source platform that...', color: 'bg-slate-50 text-slate-800' },
              { title: 'Anduril', desc: 'Anduril Industries is a modern defense...', color: 'bg-neutral-800 text-white' }
            ].map((fCard, i) => (
              <div key={i} className={`w-[115px] h-[175px] shrink-0 rounded-xl p-3 flex flex-col justify-between border border-slate-100 shadow-2xs cursor-pointer ${fCard.color}`}>
                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full w-fit">● User</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold truncate">{fCard.title}</h4>
                  <p className="text-[8px] line-clamp-2 opacity-80">{fCard.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVE POST CARD TIMELINE */}
        {posts.map((post) => (
          <article key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar with Broken Image Fallback Handling */}
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                  <img 
                    src={post.avatarUrl} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{post.authorName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{post.dateString}</p>
                </div>
              </div>
              <span className="text-slate-400 font-bold cursor-pointer">•••</span>
            </div>
            
            {/* Post Attachment Media Image Handling */}
            {post.postMedia && (
              <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-2 flex justify-center items-center">
                <img 
                  src={post.postMedia} 
                  alt="" 
                  className="max-w-full h-auto max-h-72 object-contain rounded-lg" 
                  onError={(e) => {
                    // Hide parent containing wrapper elements if image link triggers an execution crash
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.style.display = 'none';
                  }}
                />
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">{post.textContent}</p>
            
            <div className="flex items-center space-x-4 pt-2 border-t border-slate-50 text-[11px] font-semibold text-slate-400">
              <button className="flex items-center space-x-1 hover:text-slate-600"><span>♡</span><span>1</span></button>
              <button className="flex items-center space-x-1 hover:text-slate-600"><span>💬</span><span>Share</span></button>
            </div>
          </article>
        ))}
      </main>

      {/* RIGHT SIDEBAR WIDGET */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 h-fit shadow-xs text-center space-y-2">
        <h4 className="text-xs font-bold text-emerald-700">Do you know what is going on?</h4>
        <p className="text-[10px] text-slate-400 leading-normal">Connect globally with college networks, trace ongoing placement seasons, and trade info metrics seamlessly.</p>
      </aside>

    </div>
  );
}
