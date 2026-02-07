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

  create: async (data: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> => {
    const response = await client.post('/menu', data);
    return response.data;
  },

  update: async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await client.put(`/menu/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/menu/${id}`);
  },
};

// Export individual functions for convenience
export const getMenuItems = menuApi.getAll;
export const getMenuItemById = menuApi.getById;
export const getMenuItemsByCategory = menuApi.getByCategory;
export const createMenuItem = menuApi.create;
export const updateMenuItem = menuApi.update;
export const deleteMenuItem = menuApi.delete;
