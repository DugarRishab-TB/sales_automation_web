import api from './apiClient.js';

export const listTeams = async (params = {}) => {
  const res = await api.get('/sales_team', { params });
  return res.data;
};

export const getTeam = async (id) => {
  const res = await api.get(`/sales_team/${id}`);
  return res.data;
};

export const createTeam = async (payload) => {
  const res = await api.post('/sales_team', payload);
  return res.data;
};

export const updateTeam = async (id, payload) => {
  const res = await api.put(`/sales_team/${id}`, payload);
  return res.data;
};

export const deleteTeam = async (id) => {
  await api.delete(`/sales_team/${id}`);
};
