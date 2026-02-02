import galleryRepository from '../repositories/galleryRepository.js';
export class GalleryService {
    async getAllImages() {
        try {
            return await galleryRepository.findAll();
        }
        catch (error) {
            console.error('Error fetching gallery images:', error);
            throw new Error('Failed to fetch gallery images');
        }
    }
    async createImage(data) {
        try {
            if (!data.title || !data.image_url || !data.thumbnail_url) {
                throw new Error('Missing required fields');
            }
            return await galleryRepository.create(data);
        }
        catch (error) {
            console.error('Error creating gallery image:', error);
            throw error;
        }
    }
    async deleteImage(id) {
        try {
            const deleted = await galleryRepository.delete(id);
            if (!deleted) {
                throw new Error('Gallery image not found');
            }
        }
        catch (error) {
            console.error('Error deleting gallery image:', error);
            throw error;
        }
    }
}
export default new GalleryService();
