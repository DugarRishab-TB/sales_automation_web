import api from './apiClient.js';

export const listEmails = async (params = {}) => {
  const res = await api.get('/emails', { params });
  return res.data;
};

export const getEmail = async (id) => {
  const res = await api.get(`/emails/${id}`);
  return res.data;
};

export const createEmail = async (payload) => {
  const res = await api.post('/emails', payload);
  return res.data;
};

export const updateEmail = async (id, payload) => {
  const res = await api.put(`/emails/${id}`, payload);
  return res.data;
};

export const deleteEmail = async (id) => {
  await api.delete(`/emails/${id}`);
};

// Bulk import (JSON array)
export const importEmailsJson = async (emails) => {
  const payload = Array.isArray(emails) ? emails : { emails };
  const res = await api.post('/emails/bulk', payload);
  return res.data;
};

// Bulk import (CSV file)
export const importEmailsCsv = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/emails/bulk/csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Export Emails CSV
export const exportEmailsCsv = async (params = {}) => {
  const res = await api.get('/emails/export', { params, responseType: 'blob' });
  return res;
};
