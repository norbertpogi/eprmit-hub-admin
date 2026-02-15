import { USE_MOCK } from './config';
import { http } from './http';
import { mockListUsers } from './mock-db';

export const usersService = {
  async list() {
    if (USE_MOCK) return mockListUsers();
    const { data } = await http.get('/users');
    return data;
  },
};
