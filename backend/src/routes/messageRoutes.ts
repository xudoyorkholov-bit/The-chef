import { Router } from 'express';
import messageController from '../controllers/messageController.js';

const router = Router();

// Public route
router.post('/', (req, res) => messageController.createMessage(req, res));

// Admin routes
router.get('/', (req, res) => messageController.getAllMessages(req, res));
router.patch('/:id/read', (req, res) => messageController.markAsRead(req, res));
router.delete('/:id', (req, res) => messageController.deleteMessage(req, res));

export default router;
