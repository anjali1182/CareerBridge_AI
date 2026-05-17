import api from './api';

export const getJobs = (params) => api.get('/jobs', { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (payload) => api.post('/jobs', payload);
export const updateJob = (id, payload) => api.put(`/jobs/${id}`, payload);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const recommendCareer = (payload) => api.post('/ai/recommend', payload);
export const analyzeResume = (payload) => api.post('/ai/resume', payload);
export const sendChatMessage = (message, history = []) =>
  api.post('/ai/chat', { message, history });
export const getChatStatus = () => api.get('/ai/chat/status');
export const applyJob = (jobId) => api.post('/applications', { jobId });
export const getApplications = () => api.get('/applications');
