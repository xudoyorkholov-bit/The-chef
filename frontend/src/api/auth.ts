import apiClient from './client';
import { User, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  verify: async (): Promise<{ valid: boolean; user: User }> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },
};
