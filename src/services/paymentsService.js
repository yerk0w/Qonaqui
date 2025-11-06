import { apiClient } from './apiClient';

export const paymentsService = {
  async listMy() {
    return apiClient.request('/payments/me');
  },
  async listAll(status) {
    const query = status ? `?status=${status}` : '';
    return apiClient.request(`/payments${query}`);
  },
  async create(payload) {
    return apiClient.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
