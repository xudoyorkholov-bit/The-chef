import apiClient from './client';
import { ContactMessage, CreateMessageRequest } from '../types';

export const messageApi = {
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await apiClient.get('/messages');
    return response.data;
  },

  create: async (data: CreateMessageRequest): Promise<ContactMessage> => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/messages/${id}`);
  },
};
