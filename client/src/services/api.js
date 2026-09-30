import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

export const getAllPosts = (params = {}) => api.get('/posts', { params });
export const getPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.put(`/posts/${id}/like`);

export const reactToPost = (id, type) => api.put(`/posts/${id}/react`, { type });

export const getComments = (postId) => api.get(`/comments/${postId}`);
export const addComment = (postId, data) => api.post(`/comments/${postId}`, data);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

export default api;