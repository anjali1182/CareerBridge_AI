import api from './api';

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (payload) => api.put('/users/profile', payload);
export const saveJob = (jobId) => api.post('/users/save', { jobId });
