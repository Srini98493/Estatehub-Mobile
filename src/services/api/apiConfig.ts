import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

// Use direct URL since we can't use env in RN without additional setup
// const BASE_URL = 'https://api-dev.estateshub.co.in'; // dev
const BASE_URL = 'https://api-prod.estateshub.co.in'; // uat

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
); 