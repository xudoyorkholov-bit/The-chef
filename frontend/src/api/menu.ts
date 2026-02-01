import client from './client';
import { MenuItem } from '../types';

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await client.get('/menu');
    return response.data;
  },

  getById: async (id: number): Promise<MenuItem> => {
    const response = await client.get(`/menu/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await client.get(`/menu/category/${category}`);
    return response.data;
  },
};
