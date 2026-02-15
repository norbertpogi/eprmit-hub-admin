import { USE_MOCK } from './config';
import { http } from './http';
import {
  mockGetApplication,
  mockListApplications,
  mockUpdateApplicationStatus,
} from './mock-db';

/**
 * Application APIs.
 *
 * When backend is ready, keep the same function signatures and swap implementation.
 */
export const applicationsService = {
  async list(params) {
    if (USE_MOCK) return mockListApplications(params);
    const { data } = await http.get('/applications', { params });
    return data;
  },

  async get(id) {
    if (USE_MOCK) return mockGetApplication(id);
    const { data } = await http.get(`/applications/${id}`);
    return data;
  },

  async updateStatus({ id, toStatus, note, by }) {
    if (USE_MOCK) return mockUpdateApplicationStatus({ id, toStatus, note, by });
    const { data } = await http.post(`/applications/${id}/status`, { toStatus, note });
    return data;
  },
};
