import Gallery from '../models/Gallery';
import { IGallery } from '../models/Gallery';

const galleryRepository = {
  async findAll(): Promise<IGallery[]> {
    return await Gallery.find().sort({ display_order: 1, created_at: -1 });
  },

  async findById(id: string): Promise<IGallery | null> {
    return await Gallery.findById(id);
  },

  async create(galleryData: {
    title: string;
    image_url: string;
    thumbnail_url: string;
    display_order?: number;
  }): Promise<IGallery> {
    const gallery = new Gallery(galleryData);
    return await gallery.save();
  },

  async update(id: string, galleryData: Partial<IGallery>): Promise<IGallery | null> {
    return await Gallery.findByIdAndUpdate(
      id,
      galleryData,
      { new: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    const result = await Gallery.findByIdAndDelete(id);
    return result !== null;
  },

  async updateDisplayOrder(id: string, display_order: number): Promise<IGallery | null> {
    return await Gallery.findByIdAndUpdate(
      id,
      { display_order },
      { new: true }
    );
  }
};

export default galleryRepository;
