import { apiClient } from './apiClient';
import type { UserStats } from '../types';

export const statsService = {
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/api/stats');
    return response.data;
  },
};
