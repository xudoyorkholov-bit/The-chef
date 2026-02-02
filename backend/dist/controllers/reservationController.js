import reservationService from '../services/reservationService.js';
export class ReservationController {
    async getAllReservations(req, res) {
        try {
            const userId = req.user?.id;
            const { date, name, status } = req.query;
            if (date || name || status) {
                const reservations = await reservationService.filterReservations({
                    date: date,
                    name: name,
                    status: status
                });
                res.json(reservations);
            }
            else {
                // Agar foydalanuvchi tizimga kirgan bo'lsa, faqat uning rezervatsiyalarini ko'rsatamiz
                const reservations = userId
                    ? await reservationService.getUserReservations(userId)
                    : await reservationService.getAllReservations();
                res.json(reservations);
            }
        }
        catch (error) {
            console.error('Error in getAllReservations:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to fetch reservations',
                    code: 'INTERNAL_ERROR'
                }
            });
        }
    }
    async getReservationById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const reservation = await reservationService.getReservationById(id, userId);
            res.json(reservation);
        }
        catch (error) {
            console.error('Error in getReservationById:', error);
            const err = error;
            if (err.message === 'Reservation not found') {
                res.status(404).json({
                    error: {
                        message: 'Reservation not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else if (err.message === 'Access denied') {
                res.status(403).json({
                    error: {
                        message: 'Access denied',
                        code: 'ACCESS_DENIED'
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Failed to fetch reservation',
                        code: 'INTERNAL_ERROR'
                    }
                });
            }
        }
    }
    async createReservation(req, res) {
        try {
            const data = req.body;
            const userId = req.user?.id;
            const reservation = await reservationService.createReservation(data, userId);
            res.status(201).json(reservation);
        }
        catch (error) {
            console.error('Error in createReservation:', error);
            const err = error;
            res.status(400).json({
                error: {
                    message: err.message || 'Failed to create reservation',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
    }
    async updateReservation(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user?.id;
            const reservation = await reservationService.updateReservation(id, data, userId);
            res.json(reservation);
        }
        catch (error) {
            console.error('Error in updateReservation:', error);
            const err = error;
            if (err.message === 'Reservation not found') {
                res.status(404).json({
                    error: {
                        message: 'Reservation not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else if (err.message === 'Access denied') {
                res.status(403).json({
                    error: {
                        message: 'Access denied',
                        code: 'ACCESS_DENIED'
                    }
                });
            }
            else {
                res.status(400).json({
                    error: {
                        message: err.message || 'Failed to update reservation',
                        code: 'VALIDATION_ERROR'
                    }
                });
            }
        }
    }
    async deleteReservation(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            await reservationService.deleteReservation(id, userId);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error in deleteReservation:', error);
            const err = error;
            if (err.message === 'Reservation not found') {
                res.status(404).json({
                    error: {
                        message: 'Reservation not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else if (err.message === 'Access denied') {
                res.status(403).json({
                    error: {
                        message: 'Access denied',
                        code: 'ACCESS_DENIED'
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Failed to delete reservation',
                        code: 'INTERNAL_ERROR'
                    }
                });
            }
        }
    }
}
export default new ReservationController();
