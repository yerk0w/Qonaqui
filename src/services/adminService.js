import { apiClient } from './apiClient';

export const adminService = {
  async listUsers(role) {
    const query = role ? `?role=${role}` : '';
    return apiClient.request(`/admin/users${query}`);
  },
  async getUser(id) {
    return apiClient.request(`/admin/users/${id}`);
  },
  async updateUserRole(id, role) {
    return apiClient.request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
  async updateUserPassport(id, payload) {
    return apiClient.request(`/admin/users/${id}/passport`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  async deleteUser(id) {
    return apiClient.request(`/admin/users/${id}`, { method: 'DELETE' });
  },
  async dashboardSummary() {
    return apiClient.request('/admin/dashboard/summary');
  },
};
