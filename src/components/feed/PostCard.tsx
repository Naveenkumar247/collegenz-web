'use client';

import React, { useState } from 'react';
import { postsService } from '@/services/posts.service';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);

  const handleLike = async () => {
    try {
      const result = await postsService.toggleLike(post._id);
      setHasLiked(result.liked);
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error('Failed to register interaction:', err);
    }
  };

  return (
    <div className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg transition-all duration-200 hover:border-white/20">
      {/* Header Profile Section */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.picture || 'https://collegenz.in/uploads/profilepic.jpg'}
          alt={post.username}
          className="w-10 h-10 rounded-full object-cover border border-white/20"
        />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white text-sm">{post.username || 'Student'}</h3>
            {post.postType !== 'general' && (
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                post.postType === 'event' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {post.postType}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[250px]">{post.college || 'Verified Member'}</p>
        </div>
      </div>

      {/* Dynamic Main Body Segment */}
      <p className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.data}</p>

      {/* Conditional Rendering for Event Type Posts */}
      {post.postType === 'event' && (
        <div className="mb-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 text-xs space-y-1">
          <div className="text-amber-300 font-medium">📅 Event: {post.event_title}</div>
          <div className="text-slate-300">📍 Location: {post.event_location} ({post.event_mode})</div>
        </div>
      )}

      {/* Conditional Rendering for Hiring Type Posts */}
      {post.postType === 'hiring' && (
        <div className="mb-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-xs space-y-1">
          <div className="text-emerald-300 font-medium">💼 Role: {post.job_title}</div>
          <div className="text-slate-300">🏢 Location: {post.job_location} ({post.job_mode})</div>
        </div>
      )}

      {/* Media Attachments */}
      {post.imageurl && post.imageurl.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
          <img src={post.imageurl[0]} alt="Post attachment" className="w-full object-cover max-h-72" />
        </div>
      )}

      {/* Bottom Action Ribbons */}
      <div className="flex items-center border-t border-white/10 pt-3 text-slate-400 text-xs">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            hasLiked ? 'text-indigo-400 font-medium' : 'hover:text-white'
          }`}
        >
          <span>{hasLiked ? '❤️' : '👍'}</span>
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
      </div>
    </div>
  );
}
