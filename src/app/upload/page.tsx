'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPostPage() {
  const router = useRouter();

  const [postType, setPostType] = useState('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [images, setImages] = useState<FileList | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Bulletproof token retrieval
  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    
    // Check for Zustand persist state
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token || parsed?.token;
        if (token) return token.replace(/"/g, '');
      } catch (e) {
        console.error("Token parsing error", e);
      }
    }
    
    // Fallback check
    return localStorage.getItem('token')?.replace(/"/g, '') || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const token = getAuthToken();
    
    // 2. Debugging check
    if (!token) {
      setError('No session found. Please log in.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('post_type', postType);
    formData.append('data', content);

    if ((postType === 'event' || postType === 'hiring') && title) {
      formData.append(postType === 'event' ? 'event_title' : 'job_title', title);
    }

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      // 3. Send request with explicit Authorization header
      const res = await fetch('https://collegenz-api.onrender.com/api/v1/posts/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Ensure space exists
        },
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Unauthorized: Please login again');
      }

      setSuccess('Post created successfully!');
      setTimeout(() => router.push('/feed'), 1500);

    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6 px-4 font-sans text-slate-800">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-medium text-center text-slate-800 mb-8">Upload a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form fields */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Post Type</label>
            <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-600">
              <option value="general">General Post</option>
              <option value="event">Event</option>
              <option value="hiring">Hiring / Internship</option>
            </select>
          </div>

          {(postType === 'event' || postType === 'hiring') && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Post Title</label>
              <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-600" />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-600" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Upload Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-sm text-slate-500 file:py-2 file:px-4 file:bg-slate-50 file:rounded-md" />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">{success}</div>}

          <button type="submit" disabled={isLoading} className="w-full text-white font-medium py-3 rounded-lg bg-[#2a9d2f] hover:bg-green-800">
            {isLoading ? 'Uploading...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
