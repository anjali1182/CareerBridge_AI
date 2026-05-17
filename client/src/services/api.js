import axios from 'axios';

const api = axios.create({
  baseURL: 'https://careerbridge-ai-45zq.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
