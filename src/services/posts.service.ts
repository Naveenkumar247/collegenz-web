import axios from 'axios';

const API_BASE_URL = 'https://collegenz-api.onrender.com/api/v1';

export const postsService = {
  getFeed: async (filter: string, page: number = 1) => {
    try {
      // Grab the fresh token we just saved during Google authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await axios.get(`${API_BASE_URL}/posts/feed`, {
        params: {
          type: filter,
          page: page,
        },
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {}
      });

      return response.data;
    } catch (error) {
      console.error('Failed to stream posts from Render cluster:', error);
      return []; // Return empty array gracefully to prevent UI crashes
    }
  }
};
