'use client';

import React, { useState } from 'react';

export default function PostCard({ post, onPostUpdate }: { post: any, onPostUpdate: any }) {
  // 1. Image Slider State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // 2. Optimistic UI States
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSavedByCurrentUser);
  
  const images = Array.isArray(post.images) && post.images.length > 0 ? post.images : [];

  // Format the date (Fallback to current date if missing)
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : '';

  const getAuthHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) token = token.replace(/"/g, ''); 
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // --- ACTIONS ---
  
  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${post._id}/like`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const updatedPost = await res.json();
        onPostUpdate(updatedPost); 
      }
    } catch (err) {
      console.error('Like failed', err);
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    try {
      const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${post._id}/save`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const updatedPost = await res.json();
        onPostUpdate(updatedPost);
      }
    } catch (err) {
      setIsSaved(isSaved);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIdx = Math.round(scrollLeft / width);
    setCurrentImageIdx(newIdx);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden shadow-sm">
      
      {/* 1. Header (Avatar, Name, Date) */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.author?.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
            onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'; }}
          />
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 leading-tight">{post.author?.name}</h3>
            {formattedDate && <span className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</span>}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      {/* 2. Image Carousel */}
      {images.length > 0 && (
        <div className="relative w-full bg-slate-50 border-y border-slate-100">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            onScroll={handleScroll}
          >
            {images.map((imgUrl: string, idx: number) => (
              <img 
                key={idx}
                src={imgUrl} 
                alt={`Post content ${idx + 1}`}
                className="w-full h-auto max-h-[500px] flex-shrink-0 snap-center object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hides broken image links gracefully
              />
            ))}
          </div>
          
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
              {currentImageIdx + 1}/{images.length}
            </div>
          )}
        </div>
      )}

      {/* 3. Text Context (Moved BELOW images) */}
      {post.content && (
        <div className="px-4 py-3 pt-4">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* 4. Action Bar (Moved to the VERY BOTTOM) */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center space-x-6">
          
          {/* Like Button */}
          <button onClick={handleLike} className="flex items-center space-x-1.5 group transition-transform active:scale-95">
            <svg className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-500 group-hover:text-slate-700 fill-transparent'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-slate-500'}`}>
              {likesCount}
            </span>
          </button>

          {/* Share/Comment Button */}
          <button className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-700 transition-transform active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>

        </div>

        {/* Save/Bookmark Button */}
        <button onClick={handleSave} className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-transform active:scale-95">
          <svg className={`w-5 h-5 ${isSaved ? 'text-emerald-600 fill-emerald-600' : 'fill-transparent'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {post.savesCount > 0 && (
            <span className={`text-sm font-medium ${isSaved ? 'text-emerald-600' : 'text-slate-500'}`}>
              {post.savesCount}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
