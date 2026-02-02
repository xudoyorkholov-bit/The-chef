import { Router } from 'express';
import authController from '../controllers/authController.js';
const router = Router();
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/verify', (req, res) => authController.verify(req, res));
export default router;
