import galleryService from '../services/galleryService.js';
export class GalleryController {
    async getAllImages(_req, res) {
        try {
            const images = await galleryService.getAllImages();
            res.json(images);
        }
        catch (error) {
            console.error('Error in getAllImages:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to fetch gallery images',
                    code: 'INTERNAL_ERROR'
                }
            });
        }
    }
    async createImage(req, res) {
        try {
            const data = req.body;
            const image = await galleryService.createImage(data);
            res.status(201).json(image);
        }
        catch (error) {
            console.error('Error in createImage:', error);
            const err = error;
            res.status(400).json({
                error: {
                    message: err.message || 'Failed to create gallery image',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
    }
    async deleteImage(req, res) {
        try {
            const { id } = req.params;
            await galleryService.deleteImage(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error in deleteImage:', error);
            const err = error;
            if (err.message === 'Gallery image not found') {
                res.status(404).json({
                    error: {
                        message: 'Gallery image not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Failed to delete gallery image',
                        code: 'INTERNAL_ERROR'
                    }
                });
            }
        }
    }
}
export default new GalleryController();
