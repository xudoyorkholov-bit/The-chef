import galleryRepository from '../repositories/galleryRepository.js';
import { GalleryImage } from '../types/index.js';

export class GalleryService {
  async getAllImages(): Promise<GalleryImage[]> {
    try {
      return await galleryRepository.findAll();
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw new Error('Failed to fetch gallery images');
    }
  }

  async createImage(data: { title: string; image_url: string; thumbnail_url: string; display_order?: number }): Promise<GalleryImage> {
    try {
      if (!data.title || !data.image_url || !data.thumbnail_url) {
        throw new Error('Missing required fields');
      }
      return await galleryRepository.create(data);
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const deleted = await galleryRepository.delete(id);
      if (!deleted) {
        throw new Error('Gallery image not found');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }
  }

  async updateImage(id: string, data: Partial<GalleryImage>): Promise<GalleryImage> {
    try {
      const image = await galleryRepository.update(id, data);
      if (!image) {
        throw new Error('Gallery image not found');
      }
      return image;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }
  }

  async reorderImages(images: { id: string; display_order: number }[]): Promise<void> {
    try {
      await galleryRepository.reorder(images);
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  }
}

export default new GalleryService();
