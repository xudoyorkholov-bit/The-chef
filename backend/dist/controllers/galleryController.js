import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import galleryService from '../services/galleryService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
            console.log('Gallery create request received');
            console.log('Body:', req.body);
            console.log('File:', req.file ? { name: req.file.originalname, size: req.file.size } : 'No file');
            const { title } = req.body;
            const file = req.file;
            if (!file) {
                console.log('Error: No file uploaded');
                return res.status(400).json({
                    error: {
                        message: 'Rasm fayli tanlanmagan',
                        code: 'NO_FILE'
                    }
                });
            }
            if (!title) {
                console.log('Error: No title provided');
                return res.status(400).json({
                    error: {
                        message: 'Rasm nomi kiritilmagan',
                        code: 'NO_TITLE'
                    }
                });
            }
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}.webp`;
            const thumbnailFilename = `${uniqueSuffix}-thumb.webp`;
            const uploadDir = path.join(__dirname, '../../uploads');
            const filepath = path.join(uploadDir, filename);
            const thumbnailPath = path.join(uploadDir, thumbnailFilename);
            console.log('Upload directory:', uploadDir);
            console.log('File path:', filepath);
            // Ensure upload directory exists
            await fs.mkdir(uploadDir, { recursive: true });
            // Convert and save main image
            await sharp(file.buffer)
                .webp({ quality: 85, effort: 4 })
                .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
                .toFile(filepath);
            console.log('Main image saved');
            // Create thumbnail
            await sharp(file.buffer)
                .webp({ quality: 80, effort: 4 })
                .resize(400, 400, {
                fit: 'cover'
            })
                .toFile(thumbnailPath);
            console.log('Thumbnail saved');
            const imageUrl = `/uploads/${filename}`;
            const thumbnailUrl = `/uploads/${thumbnailFilename}`;
            const image = await galleryService.createImage({
                title,
                image_url: imageUrl,
                thumbnail_url: thumbnailUrl
            });
            console.log('Image saved to database:', image);
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
    async updateImage(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const image = await galleryService.updateImage(id, data);
            res.json(image);
        }
        catch (error) {
            console.error('Error in updateImage:', error);
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
                res.status(400).json({
                    error: {
                        message: err.message || 'Failed to update gallery image',
                        code: 'VALIDATION_ERROR'
                    }
                });
            }
        }
    }
    async reorderImages(req, res) {
        try {
            const { images } = req.body;
            await galleryService.reorderImages(images);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error in reorderImages:', error);
            res.status(400).json({
                error: {
                    message: 'Failed to reorder images',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
    }
}
export default new GalleryController();
