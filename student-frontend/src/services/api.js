import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7092',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@StudentApp:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;