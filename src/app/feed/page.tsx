'use client';

import React, { useEffect, useState, useRef } from 'react';
import PostCard from './PostCard'; 
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { isAuthenticated, setToken } = useAuthStore((state: any) => state);
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [featuredposts, setFeaturedposts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const isFetchingRef = useRef(false);

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
    }
  }, [isAuthenticated, isMounted, setToken]);

  useEffect(() => {
    if (!isMounted) return;

    const loadDataPools = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
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

        // Fetch featuredposts
        const featuredRes = await window.fetch('https://collegenz-api.onrender.com/api/v1/featuredposts', {
          headers: authHeaders
        });

        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          const list = Array.isArray(featuredData) 
            ? featuredData 
            : featuredData?.featuredposts || featuredData?.data || featuredData?.posts || featuredData?.result || [];
          setFeaturedposts(list);
        }

        // Fetch Feed
        const feedRes = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts/feed', {
          headers: authHeaders
        });

        if (feedRes.ok) {
          const feedData = await feedRes.json();
          const feedList = Array.isArray(feedData) 
            ? feedData 
            : feedData?.posts || feedData?.data || [];
          setPosts(feedList);
        }
      } catch (err) {
        console.error('Data pool connection failed:', err);
      } finally {
        setFeedLoading(false);
        isFetchingRef.current = false;
      }
    };

    loadDataPools();
  }, [isMounted]);

  const handlePostStateRefresh = (updatedPost: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

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
        <main className="col-span-1 lg:col-span-5 space-y-4">
          
          {/* Always Rendered Featured Posts Section */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
                Featured Post
              </h2>
              {featuredposts.length > 0 && (
                <span className="text-[10px] font-medium text-slate-400">
                  {featuredposts.length} available
                </span>
              )}
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none snap-x overflow-y-hidden">
              {feedLoading ? (
                // Horizontal Skeleton Cards during loading state
                [1, 2, 3].map((skeletonIndex) => (
                  <div
                    key={skeletonIndex}
                    className="flex-shrink-0 w-28 h-44 sm:w-[110px] sm:h-[170px] rounded-xl bg-slate-100 border border-slate-200/60 animate-pulse"
                  />
                ))
              ) : featuredposts.length > 0 ? (
                featuredposts.map((feat: any) => {
                  const targetPostId = feat.postId?._id || (typeof feat.postId === 'string' ? feat.postId : feat._id);
                  const imageUrl = feat.images?.[0] || feat.image || feat.postId?.images?.[0] || feat.postId?.imageUrl || feat.postId?.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe';
                  const authorName = feat.author?.name || feat.postId?.author?.name || 'User';
                  const postContent = feat.content || feat.caption || feat.description || feat.postId?.content || feat.postId?.title || 'Featured';

                  return (
                    <div 
                      key={feat._id} 
                      onClick={() => handlePersonalizedRoute(`/posts/${targetPostId}`)}
                      className="flex-shrink-0 w-28 h-44 sm:w-[110px] sm:h-[170px] rounded-xl relative overflow-hidden snap-start group border border-slate-200/60 bg-cover bg-center shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/20 backdrop-blur-sm py-0.5 px-1.5 rounded-full border border-white/10 max-w-[90%]">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white/20" />
                        <span className="text-[8px] text-white font-medium truncate">{authorName}</span>
                      </div>
                      <div className="absolute bottom-2 inset-x-2">
                        <p className="text-[9px] sm:text-[10px] text-white font-semibold line-clamp-2 leading-snug">
                          {postContent}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Empty Layout Placeholder Box
                <div className="w-full flex flex-col items-center justify-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 space-y-1">
                  <span className="text-xs font-medium text-slate-500">No active featured posts</span>
                  <span className="text-[10px] text-slate-400">Check back later for highlighted announcements</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {feedLoading ? (
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
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-slate-400 text-xs">
                No recent feed content found.
              </div>
            ) : (
              posts.map((item: any) => {
                const CardComponent = PostCard as any;
                return (
                  <CardComponent 
                    key={item._id} 
                    post={item} 
                    onPostUpdate={handlePostStateRefresh}
                  />
                );
              })
            )}
          </div>
        </main>

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

