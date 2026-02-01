import apiClient from './client';
import { GalleryImage } from '../types';

export const galleryApi = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await apiClient.get('/gallery');
    return response.data;
  },

  create: async (data: Partial<GalleryImage>): Promise<GalleryImage> => {
    const response = await apiClient.post('/gallery', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/gallery/${id}`);
  },
};
