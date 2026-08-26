'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface FeaturedPost {
  _id: string;
  postId?:
    | string
    | {
        _id?: string;
        title?: string;
        content?: string;
        imageUrl?: string;
      };
  priority?: number;
  expiresAt?: string;
  createdAt?: string;
  images?: string[];
  description?: string;
}

export default function FeaturedPostsPage() {
  const { isAuthenticated } = useAuthStore((state: any) => state);

  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://collegenz-api.onrender.com';
  const API_ENDPOINT = `${BASE_URL.replace(/\/$/, '')}/featuredposts`;

  const getAuthHeaders = (): Record<string, string> => {
    const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!rawToken) return {};
    const cleanToken = rawToken.startsWith('"') && rawToken.endsWith('"') ? rawToken.slice(1, -1) : rawToken;
    return { Authorization: `Bearer ${cleanToken}` };
  };

  const fetchFeaturedPosts = async () => {
    try {
      const res = await fetch(API_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.featuredposts || data?.data || data?.posts || [];
        setFeaturedPosts(list);
      } else {
        setFeaturedPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch featured posts', err);
      setFeaturedPosts([]);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const clearPreviews = () => {
    filePreviews.forEach((url) => URL.revokeObjectURL(url));
    setFilePreviews([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (postId) formData.append('postId', postId);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      formData.append('priority', String(priority));
      if (expiresAt) formData.append('expiresAt', new Date(expiresAt).toISOString());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add featured post');
      }

      setMessage({ type: 'success', text: 'Featured post created successfully!' });
      setPostId('');
      setTitle('');
      setDescription('');
      setPriority(0);
      setExpiresAt('');
      setSelectedFiles([]);
      clearPreviews();
      fetchFeaturedPosts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (featuredPostId: string) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/${featuredPostId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        fetchFeaturedPosts();
      } else {
        console.error('Failed to remove featured post');
      }
    } catch (err) {
      console.error('Failed to remove featured post', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Manage Featured Posts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pin important posts to the top of the feed with custom priority and expiry dates.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Post ID
              </label>
              <input
                type="text"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                placeholder="65e123456789abcdef012345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description / Caption
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Upload Images / Poster
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 file:cursor-pointer"
              />

              {filePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {filePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Priority Weight
                </label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Set as Featured'}
            </button>
          </form>
        </div>

        {/* Active Featured List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Active Featured Posts</h2>
          {!Array.isArray(featuredPosts) || featuredPosts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No featured posts found.
            </div>
          ) : (
            <div className="grid gap-3">
              {featuredPosts.map((item) => {
                if (!item) return null;

                const documentId = item._id;
                let displayTitle: string = 'Featured Item';
                let rawPostId: string = 'N/A';

                if (typeof item.postId === 'string') {
                  rawPostId = item.postId;
                  displayTitle = item.postId;
                } else if (item.postId && typeof item.postId === 'object') {
                  rawPostId = item.postId._id || 'N/A';
                  displayTitle = item.postId.title || item.postId.content || 'Featured Banner';
                }

                return (
                  <div
                    key={documentId || Math.random()}
                    className="flex items-center justify-between p-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-200 text-sm line-clamp-1">{displayTitle}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>
                          Ref Post ID: <code className="text-slate-300 font-mono">{rawPostId}</code>
                        </span>
                        <span>•</span>
                        <span>
                          Priority: <strong className="text-blue-400">{item.priority ?? 0}</strong>
                        </span>
                        {item.expiresAt && (
                          <>
                            <span>•</span>
                            <span>Expires: {new Date(item.expiresAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(documentId)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-lg transition-all"
                    >
                      Unfeature
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
