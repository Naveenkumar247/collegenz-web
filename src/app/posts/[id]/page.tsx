'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.collegenz.in/api/v1';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found or has been removed.');
          }
          throw new Error('Failed to load post.');
        }

        const rawData = await response.json();
        
        // Unwrap nested API payload structures
        let extractedPost = rawData;
        if (rawData.data && typeof rawData.data === 'object' && !Array.isArray(rawData.data) && (rawData.data.username || rawData.data.data)) {
          extractedPost = rawData.data;
        } else if (rawData.data?.post) {
          extractedPost = rawData.data.post;
        } else if (rawData.post) {
          extractedPost = rawData.post;
        }

        setPost(extractedPost);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-slate-200 rounded-full shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-slate-200 rounded-md w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
            </div>
          </div>
          <div className="space-y-2 py-2">
            <div className="h-3.5 bg-slate-200 rounded w-full"></div>
            <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
          </div>
          <div className="h-64 bg-slate-100 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-sm w-full space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Post Unavailable</h2>
            <p className="text-xs text-slate-500 mt-1">{error || 'Post not found.'}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Return to Feed
          </button>
        </div>
      </div>
    );
  }

  // --- EXACT FIELD RESOLUTION FROM YOUR MONGODB DOCUMENT ---

  // 1. Author Details
  const isUserIdObject = typeof post.userId === 'object' && post.userId !== null;
  const authorName = post.username || (isUserIdObject ? post.userId.name || post.userId.username : null) || 'CollegenZ User';
  const authorCollege = (isUserIdObject ? post.userId.college || post.userId.institution : null) || 'CollegenZ Member';
  
  // Avatar resolves Google profile URL `picture` directly from document
  const authorAvatar = post.picture || (isUserIdObject ? post.userId.avatar || post.userId.profilePicture : null) || post.authorAvatar;

  // 2. Text Content (`data` field)
  let postContent: string | null = null;
  if (typeof post.data === 'string') {
    postContent = post.data;
  } else if (typeof post.data === 'object' && post.data !== null) {
    postContent = post.data.content || post.data.text || post.data.caption || post.data.description || null;
  } else {
    postContent = post.content || post.text || null;
  }

  // 3. Cloudinary Image Resolver matching lowercase `imageurl` and `images` array keys
  const getCloudinaryUrl = (media: any): string | null => {
    if (!media) return null;
    if (typeof media === 'string' && media.trim().length > 0) return media;
    if (Array.isArray(media) && media.length > 0) return getCloudinaryUrl(media[0]);
    if (typeof media === 'object') {
      return media.secure_url || media.url || media.imageUrl || media.imageurl || media.path || null;
    }
    return null;
  };

  const postMedia = 
    getCloudinaryUrl(post.imageurl) ||  // Matches all-lowercase `imageurl` array from DB
    getCloudinaryUrl(post.images) ||    // Matches `images` array from DB
    getCloudinaryUrl(post.imageUrl) || 
    getCloudinaryUrl(post.data?.imageUrl) || 
    getCloudinaryUrl(post.data?.imageurl) || 
    getCloudinaryUrl(post.data?.image);

  // 4. Engagement Metrics
  const likesCount = typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likedBy) ? post.likedBy.length : 0);
  const savesCount = typeof post.saves === 'number' ? post.saves : (Array.isArray(post.savedBy) ? post.savedBy.length : 0);

  // 5. Date Formatting
  const rawDate = post.createdAt || post.created_at || post.timestamp;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const formattedDate = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans py-8 px-4 flex justify-center">
      <div className="w-full max-w-lg space-y-4">
        
        {/* Navigation / Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 px-3.5 py-2 rounded-xl border border-emerald-200/60 transition-all cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684" />
            </svg>
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Post Card */}
        <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-5">
          
          {/* Author Details Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base border border-emerald-200/60 overflow-hidden shrink-0 shadow-2xs">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  authorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  {authorName}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {authorCollege} • {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Post Text Content */}
          {postContent && (
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal tracking-normal">
              {postContent}
            </p>
          )}

          {/* Cloudinary Image Attachment */}
          {postMedia && (
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-900/5 max-h-[520px] flex items-center justify-center">
              <img 
                src={postMedia} 
                alt="Post attachment" 
                className="w-full h-auto max-h-[520px] object-cover block"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Professional Social Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              
              {/* Like Button & Counter */}
              <div className="flex items-center space-x-2 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer group">
                <div className="p-1.5 rounded-lg group-hover:bg-rose-50 text-slate-500 group-hover:text-rose-500 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700">{likesCount} <span className="text-slate-400 font-normal hidden sm:inline">Likes</span></span>
              </div>

              {/* Bookmark / Save Button & Counter */}
              <div className="flex items-center space-x-2 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer group">
                <div className="p-1.5 rounded-lg group-hover:bg-amber-50 text-slate-500 group-hover:text-amber-500 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700">{savesCount} <span className="text-slate-400 font-normal hidden sm:inline">Saved</span></span>
              </div>

            </div>

            {/* Quick Share Action */}
            <button 
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
              title="Share Post"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684" />
              </svg>
            </button>
          </div>

        </article>
      </div>
    </div>
  );
}
