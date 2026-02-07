import apiClient from './client';
import { GalleryImage } from '../types';

export const galleryApi = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await apiClient.get('/gallery');
    return response.data;
  },

  create: async (formData: FormData): Promise<GalleryImage> => {
    const response = await apiClient.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<GalleryImage>): Promise<GalleryImage> => {
    const response = await apiClient.put(`/gallery/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/gallery/${id}`);
  },

  updateOrder: async (images: { id: string; display_order: number }[]): Promise<void> => {
    await apiClient.put('/gallery/reorder', { images });
  },
};
