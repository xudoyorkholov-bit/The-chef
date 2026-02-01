import { Router } from 'express';
import menuController from '../controllers/menuController.js';

const router = Router();

// Public routes
router.get('/', (req, res) => menuController.getAllMenuItems(req, res));
router.get('/:id', (req, res) => menuController.getMenuItemById(req, res));

// Admin routes (will add authentication middleware later)
router.post('/', (req, res) => menuController.createMenuItem(req, res));
router.put('/:id', (req, res) => menuController.updateMenuItem(req, res));
router.delete('/:id', (req, res) => menuController.deleteMenuItem(req, res));

export default router;
