import { JsonDatabase } from '../database/jsonDb.js';

interface IGallery {
  _id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  createdAt: string;
  updatedAt: string;
}

const galleryRepository = {
  async findAll(): Promise<IGallery[]> {
    const items = JsonDatabase.find('gallery');
    return items.sort((a, b) => {
      const orderCompare = (a.display_order || 0) - (b.display_order || 0);
      if (orderCompare !== 0) return orderCompare;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  async findById(id: string): Promise<IGallery | null> {
    return JsonDatabase.findById('gallery', id);
  },

  async create(galleryData: {
    title: string;
    image_url: string;
    thumbnail_url: string;
    display_order?: number;
  }): Promise<IGallery> {
    return JsonDatabase.create('gallery', {
      ...galleryData,
      display_order: galleryData.display_order || 0
    });
  },

  async update(id: string, galleryData: Partial<IGallery>): Promise<IGallery | null> {
    return JsonDatabase.update('gallery', id, galleryData);
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('gallery', id);
  },

  async updateDisplayOrder(id: string, display_order: number): Promise<IGallery | null> {
    return JsonDatabase.update('gallery', id, { display_order });
  },

  async reorder(images: { id: string; display_order: number }[]): Promise<void> {
    for (const img of images) {
      await JsonDatabase.update('gallery', img.id, { display_order: img.display_order });
    }
  }
};

export default galleryRepository;
