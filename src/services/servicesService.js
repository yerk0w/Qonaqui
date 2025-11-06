import { apiClient } from './apiClient';

export const servicesService = {
  async list(category) {
    const query = category ? `?category=${category}` : '';
    return apiClient.request(`/services${query}`);
  },
  async listBookings(params = {}) {
    const search = new URLSearchParams();
    if (params.status) search.append('status', params.status);
    if (params.date) search.append('date', params.date);
    const query = search.toString();
    return apiClient.request(`/service-bookings${query ? `?${query}` : ''}`);
  },
  async listMyBookings() {
    return apiClient.request('/service-bookings/me');
  },
  async createBooking(payload) {
    return apiClient.request('/service-bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateBookingStatus(id, payload) {
    return apiClient.request(`/service-bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  async cancelBooking(id) {
    return apiClient.request(`/service-bookings/${id}`, {
      method: 'DELETE',
    });
  },
};
