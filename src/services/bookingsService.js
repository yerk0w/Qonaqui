import { apiClient } from './apiClient';

export const bookingsService = {
  async listMy() {
    return apiClient.request('/bookings/me');
  },
  async listAll(params = {}) {
    const search = new URLSearchParams();
    if (params.status) search.append('status', params.status);
    return apiClient.request(`/bookings${search.toString() ? `?${search}` : ''}`);
  },
  async get(id) {
    return apiClient.request(`/bookings/${id}`);
  },
  async create(payload) {
    return apiClient.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateStatus(id, payload) {
    return apiClient.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
