import api from './api';

// Segments
export const getSegments = () => api.get('/api/segments').then(res => res.data);
export const createSegment = (data) => api.post('/api/segments', data).then(res => res.data);
export const updateSegment = (id, data) => api.put(`/api/segments/${id}`, data).then(res => res.data);
export const deleteSegment = (id) => api.delete(`/api/segments/${id}`).then(res => res.data);

// Campaigns
export const getCampaigns = () => api.get('/api/campaigns').then(res => res.data);
export const createCampaign = (data) => api.post('/api/campaigns', data).then(res => res.data);
export const updateCampaign = (id, data) => api.put(`/api/campaigns/${id}`, data).then(res => res.data);
export const deleteCampaign = (id) => api.delete(`/api/campaigns/${id}`).then(res => res.data);

// Campaign History
export const getCampaignHistory = () => api.get('/api/campaigns/history').then(res => res.data);

// Audience Preview
export const previewAudienceSize = (segmentRules) => 
  api.post('/api/campaigns/audience-preview', { segmentRules }).then(res => res.data);

// Communication Logs
export const getCampaignCommunicationLogs = (campaignId) => 
  api.get(`/api/campaigns/${campaignId}/communication-logs`).then(res => res.data);

export const getCommunicationLogStats = (campaignId) => 
  api.get(`/api/campaigns/${campaignId}/log-stats`).then(res => res.data); 