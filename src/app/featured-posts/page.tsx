'use client';

import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from 'react';

interface FeaturedPost {
  _id: string;
  title: string;
  description?: string;
  images?: string[];
  priority?: number;
  expiresAt?: string;
  createdAt?: string;
}

export default function FeaturedPostsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState('');

  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    [],
  );

  const [filePreviews, setFilePreviews] = useState<string[]>(
    [],
  );

  const [featuredPosts, setFeaturedPosts] = useState<
    FeaturedPost[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  /*
   * ============================================================
   * API CONFIGURATION
   * ============================================================
   */

  const BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.collegenz.in/api/v1'
  ).replace(/\/$/, '');

  const API_ENDPOINT = `${BASE_URL}/featuredposts`;

  /*
   * ============================================================
   * AUTH HEADERS
   * ============================================================
   */

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === 'undefined') {
      return {};
    }

    const rawToken = localStorage.getItem('token');

    if (!rawToken) {
      return {};
    }

    const cleanToken =
      rawToken.startsWith('"') &&
      rawToken.endsWith('"')
        ? rawToken.slice(1, -1)
        : rawToken;

    return {
      Authorization: `Bearer ${cleanToken}`,
    };
  };

  /*
   * ============================================================
   * FETCH FEATURED POSTS
   * ============================================================
   */

  const fetchFeaturedPosts = async () => {
    setFetchingPosts(true);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      const data = await res.json().catch(() => null);

      console.log('FEATURED POSTS API:', {
        url: API_ENDPOINT,
        status: res.status,
        data,
      });

      if (!res.ok) {
        throw new Error(
          data?.message ||
            `Failed to fetch featured posts (${res.status})`,
        );
      }

      const list = Array.isArray(data)
        ? data
        : data?.featuredposts ||
          data?.data ||
          data?.posts ||
          data?.result ||
          [];

      setFeaturedPosts(
        Array.isArray(list) ? list : [],
      );
    } catch (err: any) {
      console.error(
        'Failed to fetch featured posts:',
        err,
      );

      setFeaturedPosts([]);

      setMessage({
        type: 'error',
        text:
          err?.message ||
          'Failed to fetch featured posts',
      });
    } finally {
      setFetchingPosts(false);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  /*
   * ============================================================
   * CLEAR PREVIEWS
   * ============================================================
   */

  const clearPreviews = () => {
    filePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setFilePreviews([]);
  };

  /*
   * ============================================================
   * FILE SELECTION
   * ============================================================
   */

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) {
      return;
    }

    const filesArray = Array.from(e.target.files);

    setSelectedFiles((prev) => [
      ...prev,
      ...filesArray,
    ]);

    const previews = filesArray.map((file) =>
      URL.createObjectURL(file),
    );

    setFilePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    // Allow selecting the same file again
    e.target.value = '';
  };

  /*
   * ============================================================
   * REMOVE SELECTED IMAGE
   * ============================================================
   */

  const removeFile = (index: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index),
    );

    setFilePreviews((prev) => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  /*
   * ============================================================
   * CREATE FEATURED POST
   * ============================================================
   */

  const handleSubmit = async (
    e: FormEvent,
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a title.',
      });

      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      /*
       * Required DTO field
       */
      formData.append(
        'title',
        title.trim(),
      );

      /*
       * Optional DTO field
       */
      if (description.trim()) {
        formData.append(
          'description',
          description.trim(),
        );
      }

      /*
       * Optional DTO field
       */
      formData.append(
        'priority',
        String(priority),
      );

      /*
       * Optional DTO field
       */
      if (expiresAt) {
        formData.append(
          'expiresAt',
          new Date(
            expiresAt,
          ).toISOString(),
        );
      }

      /*
       * Images
       *
       * Must match:
       * FilesInterceptor('images', 10)
       */
      selectedFiles.forEach((file) => {
        formData.append(
          'images',
          file,
        );
      });

      console.log(
        'Creating independent featured post:',
        {
          endpoint: API_ENDPOINT,
          title,
          priority,
          expiresAt,
          imageCount:
            selectedFiles.length,
        },
      );

      const res = await fetch(
        API_ENDPOINT,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        },
      );

      const data =
        await res.json().catch(() => null);

      console.log(
        'CREATE FEATURED RESPONSE:',
        {
          status: res.status,
          data,
        },
      );

      if (!res.ok) {
        throw new Error(
          data?.message ||
            `Failed to add featured post (${res.status})`,
        );
      }

      setMessage({
        type: 'success',
        text:
          'Featured post created successfully!',
      });

      /*
       * Reset form
       */
      setTitle('');
      setDescription('');
      setPriority(0);
      setExpiresAt('');

      clearPreviews();
      setSelectedFiles([]);

      /*
       * Refresh list
       */
      await fetchFeaturedPosts();
    } catch (err: any) {
      console.error(
        'Create featured post failed:',
        err,
      );

      setMessage({
        type: 'error',
        text:
          err?.message ||
          'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * DELETE / UNFEATURE
   * ============================================================
   */

  const handleDelete = async (
    featuredPostId: string,
  ) => {
    if (!featuredPostId) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to remove this featured post?',
      );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `${API_ENDPOINT}/${featuredPostId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        },
      );

      const data =
        await res.json().catch(() => null);

      console.log(
        'DELETE FEATURED RESPONSE:',
        {
          status: res.status,
          data,
        },
      );

      if (!res.ok) {
        throw new Error(
          data?.message ||
            `Failed to remove featured post (${res.status})`,
        );
      }

      setMessage({
        type: 'success',
        text:
          'Featured post removed successfully.',
      });

      await fetchFeaturedPosts();
    } catch (err: any) {
      console.error(
        'Failed to remove featured post:',
        err,
      );

      setMessage({
        type: 'error',
        text:
          err?.message ||
          'Failed to remove featured post',
      });
    }
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Manage Featured Posts
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Create independent featured content with custom
            images, priority, and expiry dates.
          </p>
        </div>

        {/* Create Featured Post */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter featured post title"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description / Caption
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Write a brief description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
              />
            </div>

            {/* Images */}
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
                  {filePreviews.map(
                    (src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700"
                      >
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeFile(idx)
                          }
                          className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Priority + Expiry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Priority Weight
                </label>

                <input
                  type="number"
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      Number(e.target.value),
                    )
                  }
                  min={0}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Expiration Date (Optional)
                </label>

                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) =>
                    setExpiresAt(
                      e.target.value,
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm [color-scheme:dark]"
                />
              </div>

            </div>

            {/* Message */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50"
            >
              {loading
                ? 'Uploading...'
                : 'Set as Featured'}
            </button>

          </form>
        </div>

        {/* Active Featured List */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold text-slate-200">
            Active Featured Posts
          </h2>

          {fetchingPosts ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-sm">
              Loading featured posts...
            </div>
          ) : featuredPosts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No featured posts found.
            </div>
          ) : (
            <div className="grid gap-3">

              {featuredPosts.map(
                (item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-all"
                  >

                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">

                      {/* Image */}
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs flex-shrink-0">
                          No Image
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-1 min-w-0">

                        <p className="font-medium text-slate-200 text-sm line-clamp-1">
                          {item.title}
                        </p>

                        {item.description && (
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">

                          <span>
                            Priority:{' '}
                            <strong className="text-blue-400">
                              {item.priority ?? 0}
                            </strong>
                          </span>

                          {item.expiresAt && (
                            <>
                              <span>•</span>

                              <span>
                                Expires:{' '}
                                {new Date(
                                  item.expiresAt,
                                ).toLocaleString()}
                              </span>
                            </>
                          )}

                        </div>

                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item._id,
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-lg transition-all flex-shrink-0"
                    >
                      Unfeature
                    </button>

                  </div>
                ),
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
          }
