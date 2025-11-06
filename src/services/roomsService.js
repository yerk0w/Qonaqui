import { apiClient } from './apiClient';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const roomsService = {
  async list(params = {}) {
    return apiClient.request(`/rooms${buildQuery(params)}`);
  },
  async getById(id) {
    return apiClient.request(`/rooms/${id}`);
  },
  async create(payload) {
    return apiClient.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async update(id, payload) {
    return apiClient.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async updateStatus(id, status) {
    return apiClient.request(`/rooms/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },
  async remove(id) {
    return apiClient.request(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};
