'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// 🟢 PERFECT DEFINITION AT THE CORRECT FILE PATH
interface PostCardProps {
  post: any;
  onPostUpdate?: (updatedPost: any) => void;
}

export default function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { isAuthenticated } = useAuthStore((state: any) => state);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const images: string[] = Array.isArray(post.images) 
    ? post.images 
    : post.image || post.postMedia 
      ? [post.image || post.postMedia] 
      : [];

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const cleanToken = token?.startsWith('"') && token?.endsWith('"') ? token.slice(1, -1) : token;

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
      console.error('Like sync failed:', err);
    } finally {
      setIsLiking(false);
    }
  };

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
      console.error('Save sync failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

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
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      alert('Link copied to clipboard!');
    }
  };

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

      {images.length > 0 && (
        <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative group aspect-square flex items-center justify-center">
          <img src={images[currentImageIndex]} alt="" className="w-full h-full object-contain select-none"/>
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10">‹</button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/20 px-2 py-1 rounded-full">
                {images.map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-emerald-500 scale-110' : 'bg-white/60'}`}/>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
        {post.content || post.caption || post.text}
      </p>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] font-semibold text-slate-400">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} disabled={!isAuthenticated} className={`flex items-center space-x-1 focus:outline-none ${post.isLikedByCurrentUser ? 'text-rose-500' : ''}`}>
            <span className="text-sm">{post.isLikedByCurrentUser ? '❤️' : '♡'}</span>
            <span>{post.likesCount ?? 0}</span>
          </button>
          <button onClick={handleShare} className="flex items-center space-x-1 hover:text-slate-600">
            <span className="text-sm">💬</span>
            <span>Share</span>
          </button>
        </div>
        <button onClick={handleSave} disabled={!isAuthenticated} className={`flex items-center space-x-1 focus:outline-none ${post.isSavedByCurrentUser ? 'text-amber-500' : ''}`}>
          <span className="text-sm">{post.isSavedByCurrentUser ? '🔖' : '🗂️'}</span>
          <span>{post.savesCount ?? 0}</span>
        </button>
      </div>
    </article>
  );
}
