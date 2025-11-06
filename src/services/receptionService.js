import { apiClient } from './apiClient';

export const receptionService = {
  async arrivals(date) {
    const query = date ? `?date=${date}` : '';
    return apiClient.request(`/reception/arrivals${query}`);
  },
  async departures(date) {
    const query = date ? `?date=${date}` : '';
    return apiClient.request(`/reception/departures${query}`);
  },
  async checkIn(id) {
    return apiClient.request(`/reception/bookings/${id}/check-in`, {
      method: 'PATCH',
    });
  },
  async checkOut(id) {
    return apiClient.request(`/reception/bookings/${id}/check-out`, {
      method: 'PATCH',
    });
  },
};
