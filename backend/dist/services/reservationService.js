import reservationRepository from '../repositories/reservationRepository.js';
import { validateReservationData, sanitizeString } from '../utils/validation.js';
export class ReservationService {
    async getUserReservations(userId) {
        try {
            return await reservationRepository.findByUserId(userId);
        }
        catch (error) {
            console.error('Error fetching user reservations:', error);
            throw new Error('Failed to fetch user reservations');
        }
    }
    async getAllReservations() {
        try {
            return await reservationRepository.findAll();
        }
        catch (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations');
        }
    }
    async getReservationById(id, userId) {
        try {
            const reservation = await reservationRepository.findById(id);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z rezervatsiyasini ko'rishi mumkin
            if (userId && reservation.user_id !== userId) {
                throw new Error('Access denied');
            }
            return reservation;
        }
        catch (error) {
            console.error('Error fetching reservation:', error);
            throw error;
        }
    }
    async createReservation(data, userId) {
        try {
            const validation = validateReservationData(data);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }
            const sanitizedData = {
                user_id: userId,
                customer_name: sanitizeString(data.customer_name),
                customer_email: data.customer_email,
                customer_phone: data.customer_phone,
                reservation_date: data.reservation_date,
                reservation_time: data.reservation_time,
                party_size: data.party_size,
                special_requests: data.special_requests ? sanitizeString(data.special_requests) : undefined
            };
            return await reservationRepository.create(sanitizedData);
        }
        catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    }
    async updateReservation(id, data, userId) {
        try {
            const exists = await reservationRepository.findById(id);
            if (!exists) {
                throw new Error('Reservation not found');
            }
            // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z rezervatsiyasini yangilashi mumkin
            if (userId && exists.user_id !== userId) {
                throw new Error('Access denied');
            }
            const updated = await reservationRepository.update(id, data);
            if (!updated) {
                throw new Error('Failed to update reservation');
            }
            return updated;
        }
        catch (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
    }
    async deleteReservation(id, userId) {
        try {
            // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z rezervatsiyasini o'chirishi mumkin
            if (userId) {
                const reservation = await reservationRepository.findById(id);
                if (!reservation || reservation.user_id !== userId) {
                    throw new Error('Access denied');
                }
            }
            const deleted = await reservationRepository.delete(id);
            if (!deleted) {
                throw new Error('Reservation not found');
            }
        }
        catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    }
    async filterReservations(filters) {
        try {
            return await reservationRepository.filterByDateNameStatus(filters);
        }
        catch (error) {
            console.error('Error filtering reservations:', error);
            throw new Error('Failed to filter reservations');
        }
    }
}
export default new ReservationService();
