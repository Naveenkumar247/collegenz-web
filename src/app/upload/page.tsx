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

  const getAuthToken = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? token.replace(/"/g, '') : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!postType || !content) {
      setError('Post type and description content are required.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('post_type', postType);
    formData.append('data', content);

    if (postType === 'event' && title) {
      formData.append('event_title', title);
    } else if (postType === 'hiring' && title) {
      formData.append('job_title', title);
    }

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      const res = await window.fetch('https://collegenz-api.onrender.com/api/v1/posts/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to upload post');
      }

      setSuccess('Post created successfully!');
      
      setTimeout(() => {
        router.push('/feed');
      }, 1500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6 px-4 font-sans text-slate-800">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-medium text-center text-slate-800 mb-8">
          Upload a Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Post Type</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white"
            >
              <option value="general">General Post</option>
              <option value="event">Event</option>
              <option value="hiring">Hiring / Internship</option>
            </select>
          </div>

          {(postType === 'event' || postType === 'hiring') && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Post Title</label>
              <input
                type="text"
                placeholder="Enter event/job title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="What do you want to share?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Upload Images (Max 10)</label>
            <div className="flex items-center w-full border border-slate-200 rounded-lg overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          {success && <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-100">{success}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-medium py-3 rounded-lg transition-all ${
              isLoading 
                ? 'bg-green-700/70 cursor-not-allowed' 
                : 'bg-[#2a9d2f] hover:bg-green-800 active:scale-[0.98]'
            }`}
          >
            {isLoading ? 'Uploading...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
