'use client';

import { useState, useEffect, FormEvent } from 'react';

interface FeaturedPost {
  _id: string;
  postId:
    | string
    | {
        _id: string;
        title?: string;
        content?: string;
      };
  priority: number;
  expiresAt?: string;
  createdAt: string;
}

export default function FeaturedPostsPage() {
  const [postId, setPostId] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchFeaturedPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/featured-posts`);
      if (res.ok) {
        const data = await res.json();
        setFeaturedPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch featured posts', err);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/featured-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          priority: Number(priority),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add featured post');
      }

      setMessage({ type: 'success', text: 'Post featured successfully!' });
      setPostId('');
      setPriority(0);
      setExpiresAt('');
      fetchFeaturedPosts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/featured-posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchFeaturedPosts();
      }
    } catch (err) {
      console.error('Failed to remove featured post', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Manage Featured Posts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pin important posts to the top of the feed with custom priority and expiry dates.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Post ID *
              </label>
              <input
                type="text"
                required
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                placeholder="65e123456789abcdef012345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
              />
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm [color-scheme:dark]"
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
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Set as Featured'}
            </button>
          </form>
        </div>

        {/* Active Featured List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Active Featured Posts</h2>
          {featuredPosts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No featured posts found.
            </div>
          ) : (
            <div className="grid gap-3">
              {featuredPosts.map((item) => {
                const isString = typeof item.postId === 'string';
                const targetId = isString ? item.postId : item.postId._id;
                const title = isString ? item.postId : (item.postId.title || 'Untitled Post');

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-200 text-sm">{title}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>
                          ID: <code className="text-slate-300 font-mono">{targetId}</code>
                        </span>
                        <span>•</span>
                        <span>
                          Priority: <strong className="text-blue-400">{item.priority}</strong>
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
                      onClick={() => handleDelete(targetId)}
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
