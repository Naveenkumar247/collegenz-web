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
        
        // Unwrap nested responses while preserving document root
        let extractedPost = rawData;
        if (rawData.data?.username || rawData.data?.imageUrl || rawData.data?.data) {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-2.5 bg-slate-100 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-48 bg-slate-100 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-sm w-full space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h2 className="text-base font-bold text-slate-900">Post Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'Post not found.'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Return to Feed
          </button>
        </div>
      </div>
    );
  }

  // --- FIELD RESOLUTION MATCHING YOUR SCHEMA ---

  // 1. Author Details (`username` and populated/unpopulated `userId`)
  const isUserIdObject = typeof post.userId === 'object' && post.userId !== null;
  const authorName = post.username || (isUserIdObject ? post.userId.name || post.userId.username : null) || 'CollegenZ User';
  const authorCollege = (isUserIdObject ? post.userId.college || post.userId.institution : null) || 'CollegenZ Member';
  const authorAvatar = (isUserIdObject ? post.userId.avatar || post.userId.profilePicture : null) || post.authorAvatar;

  // 2. Post Content (`data` field)
  let postContent: string | null = null;
  if (typeof post.data === 'string') {
    postContent = post.data;
  } else if (typeof post.data === 'object' && post.data !== null) {
    postContent = post.data.content || post.data.text || post.data.caption || post.data.description || null;
  } else {
    postContent = post.content || post.text || null;
  }

  // 3. Post Media (`imageUrl` field)
  const postMedia = post.imageUrl || (typeof post.data === 'object' ? post.data?.imageUrl || post.data?.image : null);

  // 4. Engagement Metrics (`likes`, `saves`, `likedBy`, `savedBy`)
  const likesCount = typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likedBy) ? post.likedBy.length : 0);
  const savesCount = typeof post.saves === 'number' ? post.saves : (Array.isArray(post.savedBy) ? post.savedBy.length : 0);

  // 5. Date Formatting (`timestamps: true`)
  const rawDate = post.createdAt || post.created_at || post.timestamp;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const formattedDate = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-6 px-4 flex justify-center">
      <div className="w-full max-w-lg space-y-4">
        
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-100 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684" />
            </svg>
            <span>{copied ? 'Link Copied!' : 'Share Post'}</span>
          </button>
        </div>

        {/* Post Card */}
        <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
          
          {/* Author Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200 overflow-hidden shrink-0">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                authorName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{authorName}</h3>
              <p className="text-[11px] text-slate-400">{authorCollege} • {formattedDate}</p>
            </div>
          </div>

          {/* Text Content */}
          {postContent && (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {postContent}
            </p>
          )}

          {/* Image Content */}
          {postMedia && (
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img src={postMedia} alt="Post attachment" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}

          {/* Action Counters */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span>❤️ <strong className="text-slate-700">{likesCount}</strong> Likes</span>
              <span>🔖 <strong className="text-slate-700">{savesCount}</strong> Saved</span>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}
