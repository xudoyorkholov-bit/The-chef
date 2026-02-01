import apiClient from './client';
import { Reservation, CreateReservationRequest } from '../types';

export const reservationApi = {
  getAll: async (filters?: { date?: string; name?: string; status?: string }): Promise<Reservation[]> => {
    const response = await apiClient.get('/reservations', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Reservation> => {
    const response = await apiClient.get(`/reservations/${id}`);
    return response.data;
  },

  create: async (data: CreateReservationRequest): Promise<Reservation> => {
    const response = await apiClient.post('/reservations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Reservation>): Promise<Reservation> => {
    const response = await apiClient.put(`/reservations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reservations/${id}`);
  },
};
