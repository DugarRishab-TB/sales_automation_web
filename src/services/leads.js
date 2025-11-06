import api from './apiClient.js';

export const listLeads = async (params = {}) => {
  const res = await api.get('/leads', { params });
  return res.data;
};

export const getLead = async (id) => {
  const res = await api.get(`/leads/${id}`);
  return res.data;
};

export const createLead = async (payload) => {
  const res = await api.post('/leads', payload);
  return res.data;
};

export const updateLead = async (id, payload) => {
  const res = await api.put(`/leads/${id}`, payload);
  return res.data;
};

export const deleteLead = async (id) => {
  await api.delete(`/leads/${id}`);
};

// Bulk import (JSON array)
export const importLeadsJson = async (leads) => {
  // Backend accepts either array body or { leads }
  const payload = Array.isArray(leads) ? leads : { leads };
  const res = await api.post('/leads/bulk', payload);
  return res.data;
};

// Bulk import (CSV file)
export const importLeadsCsv = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/leads/bulk_csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Export Leads CSV
export const exportLeadsCsv = async (params = {}) => {
  const res = await api.get('/leads/export', { params, responseType: 'blob' });
  return res;
};
