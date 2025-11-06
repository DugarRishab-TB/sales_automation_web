import api from './apiClient.js';

export const getHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};
