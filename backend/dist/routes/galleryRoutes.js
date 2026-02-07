import { Router } from 'express';
import multer from 'multer';
import galleryController from '../controllers/galleryController.js';
const router = Router();
// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
// Public route
router.get('/', (req, res) => galleryController.getAllImages(req, res));
// Admin routes
router.post('/', upload.single('image'), (req, res) => galleryController.createImage(req, res));
router.put('/:id', (req, res) => galleryController.updateImage(req, res));
router.put('/reorder', (req, res) => galleryController.reorderImages(req, res));
router.delete('/:id', (req, res) => galleryController.deleteImage(req, res));
export default router;
