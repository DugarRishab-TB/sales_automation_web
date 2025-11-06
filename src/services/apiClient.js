import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) {
    config.params = {
      ...(config.params || {}),
      api_key: apiKey,
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
