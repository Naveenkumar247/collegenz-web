'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface PostCardProps {
  post: any;
  onPostUpdate?: (updatedPost: any) => void;
}

export default function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { isAuthenticated } = useAuthStore((state: any) => state);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Safely extract images array out of schema permutations (string, array of strings, or object arrays)
  const images: string[] = Array.isArray(post.images) 
    ? post.images 
    : post.image || post.postMedia 
      ? [post.image || post.postMedia] 
      : [];

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const cleanToken = token?.startsWith('"') && token?.endsWith('"') ? token.slice(1, -1) : token;

  // 1. Handle Like Toggle Event
  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return;
    setIsLiking(true);
    try {
      const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const updatedPost = await res.json();
        if (onPostUpdate) onPostUpdate(updatedPost);
      }
    } catch (err) {
      console.error('Like tracking synchronization failed:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // 2. Handle Bookmark Save Toggle Event
  const handleSave = async () => {
    if (!isAuthenticated || isSaving) return;
    setIsSaving(true);
    try {
      const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${post._id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const updatedPost = await res.json();
        if (onPostUpdate) onPostUpdate(updatedPost);
      }
    } catch (err) {
      console.error('Save tracking synchronization failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handle Share Event Using Web Share API API native layers
  const handleShare = async () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author?.name || 'CollegenZ User'}`,
          text: post.caption || post.content,
          url: postUrl,
        });
      } catch (err) {
        console.log('Share canceled or dismissed');
      }
    } else {
      // Fallback: Copy link text string directly to user device clipboard
      navigator.clipboard.writeText(postUrl);
      alert('Post link copied to clipboard!');
    }
  };

  // Carousel Navigation Helpers
  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
      {/* Post Owner Header Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={post.author?.picture || post.avatar || 'https://collegenz.in/uploads/profilepic.jpg'} 
            alt="" 
            className="w-9 h-9 rounded-full object-cover border border-slate-100" 
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900">{post.author?.name || post.username || 'Anonymous Student'}</h4>
            <p className="text-[10px] text-slate-400 font-medium">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>
        <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-600 px-1">•••</span>
      </div>

      {/* 🟢 MULTI-IMAGE SLIDING CAROUSEL CORE COMPONENT WRAPPER */}
      {images.length > 0 && (
        <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative group aspect-square sm:max-h-96 flex items-center justify-center">
          
          {/* Active Image Render */}
          <img 
            src={images[currentImageIndex]} 
            alt={`Slide ${currentImageIndex + 1}`} 
            className="w-full h-full object-contain select-none"
          />

          {/* Carousel Control Arrows (Only visible if multi-image array targets exist) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
              >
                ‹
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
              >
                ›
              </button>

              {/* Instagram Style Slider Indicator Dots Row */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/20 backdrop-blur-xs px-2 py-1 rounded-full">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-emerald-500 scale-110' : 'bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Text Description Box */}
      <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap px-0.5">
        {post.content || post.caption || post.text}
      </p>
      
      {/* 🟢 INTERACTIVE ACTION BUTTON FOOTER ROW */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] font-semibold text-slate-400 px-0.5">
        <div className="flex items-center space-x-4">
          
          {/* Like Button Trigger element */}
          <button 
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center space-x-1 focus:outline-none transition-colors ${post.isLikedByCurrentUser ? 'text-rose-500' : 'hover:text-slate-600'}`}
          >
            <span className="text-sm">{post.isLikedByCurrentUser ? '❤️' : '♡'}</span>
            <span>{post.likesCount || post.likes?.length || 0}</span>
          </button>

          {/* Share Action trigger */}
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 hover:text-slate-600 focus:outline-none"
          >
            <span className="text-sm">💬</span>
            <span>Share</span>
          </button>
        </div>

        {/* Bookmark Save Action trigger */}
        <button 
          onClick={handleSave}
          disabled={!isAuthenticated}
          className={`flex items-center space-x-1 focus:outline-none transition-colors ${post.isSavedByCurrentUser ? 'text-amber-500' : 'hover:text-slate-600'}`}
        >
          <span className="text-sm">{post.isSavedByCurrentUser ? '🔖' : '🗂️'}</span>
          <span>{post.isSavedByCurrentUser ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </article>
  );
}
