import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
