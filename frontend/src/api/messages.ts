import apiClient from './client';
import { ContactMessage, CreateMessageRequest } from '../types';

export const messagesApi = {
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await apiClient.get('/messages');
    return response.data;
  },

  create: async (data: CreateMessageRequest): Promise<ContactMessage> => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/messages/${id}/read`);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/messages/${id}`);
  },
};

// Backward compatibility
export const messageApi = messagesApi;
