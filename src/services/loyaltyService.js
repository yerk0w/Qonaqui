import { apiClient } from './apiClient';

export const loyaltyService = {
  async history() {
    return apiClient.request('/loyalty/history');
  },
  async redeem(points, description) {
    return apiClient.request('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ points, description }),
    });
  },
};

