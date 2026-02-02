import { Router } from 'express';
import reservationController from '../controllers/reservationController.js';
import { optionalAuth } from '../middleware/auth.js';
const router = Router();
// Public routes with optional auth - agar user login qilgan bo'lsa, faqat o'z rezervatsiyalarini ko'radi
router.post('/', optionalAuth, (req, res) => reservationController.createReservation(req, res));
router.get('/', optionalAuth, (req, res) => reservationController.getAllReservations(req, res));
router.get('/:id', optionalAuth, (req, res) => reservationController.getReservationById(req, res));
router.put('/:id', optionalAuth, (req, res) => reservationController.updateReservation(req, res));
router.delete('/:id', optionalAuth, (req, res) => reservationController.deleteReservation(req, res));
export default router;
