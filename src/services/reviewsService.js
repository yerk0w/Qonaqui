import { apiClient } from './apiClient';

export const reviewsService = {
  async listForRoom(roomId) {
    return apiClient.request(`/reviews/room/${roomId}`);
  },
  async listMine() {
    return apiClient.request('/reviews/me');
  },
  async listAll(status) {
    const query = status ? `?status=${status}` : '';
    return apiClient.request(`/reviews${query}`);
  },
  async create(payload) {
    return apiClient.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async moderate(id, payload) {
    return apiClient.request(`/reviews/${id}/moderate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
