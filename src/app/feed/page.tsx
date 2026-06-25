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
        const response = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Fallback mockup items matching your posts if backend arrays are empty
          setPosts(data.posts || [
            {
              id: '1',
              author: 'naveenkumar247',
              avatar: 'https://collegenz.in/uploads/profilepic.jpg',
              date: '4/21/2026',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vodafone_Idea_Logo.svg/1200px-Vodafone_Idea_Logo.svg.png',
              content: 'Vodafone Idea Limited (Vi) is one of India\'s leading telecom providers, delivering reliable mobile connectivity, high-speed internet, and digital services...'
            }
          ]);
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

  // 🎰 1. LOADING STATE: Responsive Animated Skeleton Screen 
  if (!isMounted || loadingFeed) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans animate-pulse pb-16">
        <div className="bg-[#15803d] h-14 w-full sticky top-0 z-50 flex items-center justify-between px-4 shadow-sm">
          <div className="h-5 bg-emerald-600/50 rounded w-28" />
          <div className="flex space-x-3">
            <div className="h-6 w-6 rounded-full bg-emerald-600/50" />
            <div className="h-6 w-6 rounded-full bg-emerald-600/50" />
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex gap-6 pt-4 px-4">
          <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-100 rounded-2xl p-4 space-y-4 h-fit shadow-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 py-1">
                <div className="h-4 w-4 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
          <div className="flex-1 max-w-2xl space-y-4 w-full mx-auto">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="flex space-x-3 overflow-hidden">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="w-[105px] h-[165px] shrink-0 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
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
                  <div className="h-3 bg-slate-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🟢 2. LIVE ACTIVE STATE: The Real Interactive UI Feed
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans pb-20">
      
      {/* HEADER NAVBAR */}
      <header className="bg-[#1e88e5] text-white h-14 sticky top-0 z-50 flex items-center justify-between px-4 shadow-sm" style={{ backgroundColor: '#15803d' }}>
        <h1 className="text-lg font-bold tracking-tight">CollegenZ</h1>
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1.5 bg-red-600 text-[9px] text-white font-bold h-4 w-4 rounded-full flex items-center justify-center">5</span>
          </div>
          <span className="text-xl cursor-pointer">💬</span>
          <span className="text-xl cursor-pointer" onClick={() => router.push('/profile')}>👤</span>
        </div>
      </header>

      {/* BODY CONTEXT STRUCTURE */}
      <div className="max-w-[1200px] mx-auto flex gap-6 pt-4 px-4">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 space-y-2 h-fit shadow-xs">
          {['Home', 'Community Hubs', 'Courses', 'Internships', 'Placements', 'Events', 'Crypto Wallet', 'Settings'].map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${item === 'Home' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{item === 'Home' ? '🏠' : '📁'}</span>
              <span>{item}</span>
            </div>
          ))}
        </aside>

        {/* MAIN FEED TIMELINE STREAM */}
        <main className="flex-1 max-w-2xl space-y-4 w-full mx-auto">
          
          {/* FEATURED POST SLIDER WRAPPER */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">Featured Post</h3>
            <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none">
              {[
                { title: 'Palantir', desc: 'Exploring the impact of data-driven intelligence...', color: 'bg-black text-white' },
                { title: 'Ollama', desc: 'Ollama is an open-source platform that...', color: 'bg-slate-100 text-slate-800' },
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

          {/* ACTIVE POST LIST ITERATOR LOOP */}
          {posts.map((post) => (
            <article key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{post.author}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{post.date}</p>
                  </div>
                </div>
                <span className="text-slate-400 font-bold cursor-pointer">•••</span>
              </div>
              
              {post.image && (
                <div className="w-full bg-white rounded-xl overflow-hidden border border-slate-100 p-4 flex justify-center items-center max-h-72">
                  <img src={post.image} alt="Post Attachment" className="max-w-full max-h-64 object-contain" />
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex items-center space-x-4 pt-2 border-t border-slate-50 text-[11px] font-semibold text-slate-400">
                <button className="flex items-center space-x-1 hover:text-slate-600"><span>♡</span><span>1</span></button>
                <button className="flex items-center space-x-1 hover:text-slate-600"><span>💬</span><span>Share</span></button>
              </div>
            </article>
          ))}
        </main>

        {/* RIGHT DESKTOP SIDEBAR WIDGET */}
        <aside className="hidden lg:block w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 h-fit shadow-xs text-center space-y-2">
          <h4 className="text-xs font-bold text-emerald-700">Do you know what is going on?</h4>
          <p className="text-[10px] text-slate-400 leading-normal">Connect globally with college networks, track ongoing placement updates, and share info metrics seamlessly.</p>
        </aside>

      </div>

      {/* FLOATING MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex justify-around items-center px-2 z-50 shadow-lg">
        <div className="flex flex-col items-center cursor-pointer text-emerald-600">
          <span className="text-lg">🏠</span>
          <span className="text-[9px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-slate-400" onClick={() => router.push('/internships')}>
          <span className="text-lg">💼</span>
          <span className="text-[9px] font-bold">Internship</span>
        </div>
        <div className="relative -top-4 bg-emerald-600 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md cursor-pointer border-4 border-white transform active:scale-95 transition-transform">
          <span className="text-xl font-bold">+</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-slate-400" onClick={() => router.push('/events')}>
          <span className="text-lg">📅</span>
          <span className="text-[9px] font-bold">Event</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-slate-400" onClick={() => router.push('/settings')}>
          <span className="text-lg">⚙️</span>
          <span className="text-[9px] font-bold">Settings</span>
        </div>
      </nav>

    </div>
  );
}
