import { Router } from 'express';
import galleryController from '../controllers/galleryController.js';

const router = Router();

// Public route
router.get('/', (req, res) => galleryController.getAllImages(req, res));

// Admin routes
router.post('/', (req, res) => galleryController.createImage(req, res));
router.delete('/:id', (req, res) => galleryController.deleteImage(req, res));

export default router;
