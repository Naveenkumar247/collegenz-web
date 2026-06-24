'use client';

import React from 'react';

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-sm space-y-3">
      {/* User Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img 
            src={post.author?.picture || 'https://www.svgrepo.com/show/532362/user.svg'} 
            className="w-9 h-9 rounded-full object-cover border border-slate-100"
            alt="Profile pic"
          />
          <div>
            <h4 className="text-xs font-bold font-['Poppins'] text-slate-800 m-0">{post.author?.username}</h4>
            <p className="text-[10px] text-slate-400 m-0">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 bg-transparent border-0"><i className="bi bi-three-dots"></i></button>
      </div>

      {/* Main Post Image Layer from Cloudinary */}
      {post.image && (
        <div className="w-full max-h-[380px] rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
          <img src={post.image} className="w-full h-full object-contain mx-auto" alt="Post attachment Content" />
        </div>
      )}

      {/* Text Captions */}
      <p className="text-xs text-slate-600 leading-relaxed font-['Open+Sans'] m-0">
        {post.caption}
      </p>

      {/* Interaction Bar Actions */}
      <div className="flex items-center gap-4 pt-1 text-slate-500 text-sm">
        <button className={`flex items-center gap-1.5 bg-transparent border-0 text-xs ${post.hasLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
          <i className={`bi ${post.hasLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          <span>{post.likesCount || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 bg-transparent border-0 text-xs hover:text-indigo-600">
          <i className="bi bi-send"></i>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
