import axios from 'axios';
import { getAuthHeader } from '@/utils/auth'; // Point to where you saved the utility

const api = axios.create({
  baseURL: 'https://collegenz-api.onrender.com/api/v1',
});

// Interceptor to inject the token into every request automatically
api.interceptors.request.use((config) => {
  const headers = getAuthHeader();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export default api;
