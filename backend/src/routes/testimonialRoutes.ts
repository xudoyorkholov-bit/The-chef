import { Router } from 'express';
import testimonialController from '../controllers/testimonialController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Admin routes - barcha fikrlar (birinchi bo'lishi kerak)
router.get('/', authenticate, requireAdmin, (req, res) => testimonialController.getAllTestimonials(req, res));
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => testimonialController.updateTestimonialStatus(req, res));

// Protected routes (require authentication)
router.post('/', authenticate, (req, res) => testimonialController.createTestimonial(req, res));
router.get('/user/my-testimonials', authenticate, (req, res) => testimonialController.getUserTestimonials(req, res));
router.delete('/:id', authenticate, (req, res) => testimonialController.deleteTestimonial(req, res));

// Public routes - faqat tasdiqlangan fikrlar (oxirida bo'lishi kerak)
router.get('/approved', (req, res) => testimonialController.getApprovedTestimonials(req, res));
router.get('/:id', (req, res) => testimonialController.getTestimonialById(req, res));

export default router;
