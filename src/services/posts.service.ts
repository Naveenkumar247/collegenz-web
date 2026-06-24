import api from '@/lib/axios';

export const postsService = {
  // Fetches aggregated posts (Supports filtering by type: 'recent', 'event', 'hiring')
  getFeed: async (type = 'recent', page = 1) => {
    const res = await api.get(`/posts/feed?type=${type}&page=${page}`);
    return res.data;
  },

  // Toggles post likes
  toggleLike: async (postId: string) => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },

  // Deletes owned posts
  deletePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
  }
};
