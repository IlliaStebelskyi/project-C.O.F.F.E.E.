import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Адрес бэкенда в Docker
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик: автоматически добавляем Bearer Token в каждый запрос
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;