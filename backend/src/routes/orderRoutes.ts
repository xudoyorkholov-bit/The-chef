import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes with optional auth - agar user login qilgan bo'lsa, faqat o'z buyurtmalarini ko'radi
router.get('/', optionalAuth, orderController.getAll);
router.get('/:id', optionalAuth, orderController.getById);
router.post('/', optionalAuth, orderController.create);

// User routes - faqat o'z buyurtmalarini boshqarish
router.patch('/:id/status', optionalAuth, orderController.updateStatus);
router.delete('/:id', optionalAuth, orderController.delete);

export default router;
