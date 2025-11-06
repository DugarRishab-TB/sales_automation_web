import axios from 'axios';

const baseURL = import.meta.env.VITE_LEADSWIFT_BASE_URL;
const apiKey = import.meta.env.VITE_LEADSWIFT_API_KEY;

const leadswift = axios.create({
  baseURL,
});

leadswift.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers = {
      ...(config.headers || {}),
      'x-api-key': apiKey,
    };
  }
  return config;
});

leadswift.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export const findSearchesByCampaignId = async (campaignId) => {
  if (!baseURL || !apiKey) throw new Error('LeadSwift env not configured. Set VITE_LEADSWIFT_BASE_URL and VITE_LEADSWIFT_API_KEY');
  const res = await leadswift.get('/searches/' + campaignId + "?api_key=" + apiKey);
  return res.data;
};

export const getLeadsBySearchId = async (searchId) => {
  if (!baseURL || !apiKey) throw new Error('LeadSwift env not configured. Set VITE_LEADSWIFT_BASE_URL and VITE_LEADSWIFT_API_KEY');
  const res = await leadswift.post('/leads' + searchId + "?api_key=" + apiKey, {search_id: searchId, start: 0, length: 100 });
  return res.data;
};
