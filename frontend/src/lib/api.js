import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  withCredentials: true,           // important for session auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add token if you switch to JWT later
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;