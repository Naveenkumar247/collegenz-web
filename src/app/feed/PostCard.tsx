'use client';

import React, { useState } from 'react';

export default function PostCard({ post, onPostUpdate }: { post: any; onPostUpdate: any }) {
  // Normalize post data if wrapped inside a featured post object
  const postData = post?.postId && typeof post.postId === 'object' ? post.postId : post;
  const targetId = typeof post?.postId === 'string' ? post.postId : (postData?._id || post?._id);

  // 1. Image Extraction (Handles arrays, single imageUrl, or image fields)
  const rawImages = postData?.images || post?.images;
  const singleImage = postData?.imageUrl || post?.imageUrl || postData?.image || post?.image;
  
  const images: string[] = Array.isArray(rawImages) && rawImages.length > 0 
    ? rawImages 
    : singleImage 
      ? [singleImage] 
      : [];

  // 2. Image Slider State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // 3. Optimistic UI States
  const [isLiked, setIsLiked] = useState(Boolean(postData?.isLikedByCurrentUser ?? post?.isLikedByCurrentUser));
  const [likesCount, setLikesCount] = useState<number>(postData?.likesCount ?? post?.likesCount ?? 0);
  
  const [isSaved, setIsSaved] = useState(Boolean(postData?.isSavedByCurrentUser ?? post?.isSavedByCurrentUser));
  const [savesCount, setSavesCount] = useState<number>(postData?.savesCount ?? post?.savesCount ?? 0);

  // 4. Share Feedback State
  const [isCopied, setIsCopied] = useState(false);

  // Author & Content Details
  const author = postData?.author || post?.author;
  const content = postData?.content || post?.content || post?.caption || post?.description;
  const postType = postData?.postType || postData?.type || post?.postType || post?.type;
  const createdAt = postData?.createdAt || post?.createdAt;

  // Format the date gracefully
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // Helper to safely extract and clean the JWT token
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
    if (!targetId) return;
    const wasLiked = isLiked;
    const previousCount = likesCount;
    
    // Instantly update UI (Optimistic)
    setIsLiked(!wasLiked);
    setLikesCount(wasLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${targetId}/like`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        setIsLiked(wasLiked);
        setLikesCount(previousCount);
        return;
      }
      
      const updatedPost = await res.json();
      if (onPostUpdate) onPostUpdate(updatedPost); 
    } catch (err) {
      console.error('Network failure during like:', err);
      setIsLiked(wasLiked);
      setLikesCount(previousCount);
    }
  };

  const handleSave = async () => {
    if (!targetId) return;
    const wasSaved = isSaved;
    const previousCount = savesCount;
    
    setIsSaved(!wasSaved);
    setSavesCount(wasSaved ? previousCount - 1 : previousCount + 1);

    const isEvent = postType === 'event';
    const endpoint = isEvent 
      ? `https://collegenz-api.onrender.com/api/v1/posts/${targetId}/save-event`
      : `https://collegenz-api.onrender.com/api/v1/posts/${targetId}/save`;

    try {
      const res = await window.fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        setIsSaved(wasSaved);
        setSavesCount(previousCount);
        return;
      }
      
      const updatedPost = await res.json();
      if (updatedPost?._id && onPostUpdate) {
        onPostUpdate(updatedPost);
      }
    } catch (err) {
      setIsSaved(wasSaved);
      setSavesCount(previousCount);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!targetId) return;

    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/posts/${targetId}` 
      : '';

    const shareData = {
      title: 'Collegenz Post',
      text: content ? `${content.slice(0, 80)}...` : 'Check out this post on Collegenz!',
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }

      try {
        const res = await window.fetch(`https://collegenz-api.onrender.com/api/v1/posts/${targetId}/share`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const updatedPost = await res.json();
          if (updatedPost?._id && onPostUpdate) {
            onPostUpdate(updatedPost);
          }
        }
      } catch (err) {
        // Silently catch in case backend endpoint is omitted
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing post:', err);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      const newIdx = Math.round(scrollLeft / width);
      setCurrentImageIdx(newIdx);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden shadow-sm relative">
      
      {/* 1. Header (Avatar, Name, Date, Event Badge) */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={author?.picture || author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
            onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'; }}
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-800 leading-tight">{author?.name || 'Collegenz User'}</h3>
              {postType === 'event' && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Event
                </span>
              )}
            </div>
            {formattedDate && <span className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</span>}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
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
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ))}
          </div>
          
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm pointer-events-none">
              {currentImageIdx + 1}/{images.length}
            </div>
          )}
        </div>
      )}

      {/* 3. Text Context */}
      {content && (
        <div className="px-4 py-3 pt-4">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      )}

      {/* 4. Action Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-slate-100 bg-white">
        <div className="flex items-center space-x-6">
          
          {/* Like Button */}
          <button onClick={handleLike} className="flex items-center space-x-1.5 group transition-transform active:scale-95">
            <svg className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-500 group-hover:text-slate-700 fill-transparent'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-slate-500'}`}>
              {likesCount}
            </span>
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-700 transition-transform active:scale-95"
            title="Share post"
          >
            {isCopied ? (
              <>
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-semibold text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="text-sm font-medium">Share</span>
              </>
            )}
          </button>

        </div>

        {/* Save/Bookmark Button */}
        <button 
          onClick={handleSave} 
          className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-transform active:scale-95"
          title={postType === 'event' ? "Save Event" : "Save Post"}
        >
          <svg className={`w-6 h-6 transition-colors ${isSaved ? 'text-emerald-600 fill-emerald-600' : 'fill-transparent'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {savesCount > 0 && (
            <span className={`text-sm font-medium ${isSaved ? 'text-emerald-600' : 'text-slate-500'}`}>
              {savesCount}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
