import { JsonDatabase } from '../database/jsonDb.js';
const reservationRepository = {
    // Foydalanuvchining rezervatsiyalarini olish
    async findByUserId(userId) {
        const reservations = JsonDatabase.find('reservations', { user_id: userId });
        return reservations.sort((a, b) => {
            const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
            if (dateCompare !== 0)
                return dateCompare;
            return b.reservation_time.localeCompare(a.reservation_time);
        });
    },
    // Barcha rezervatsiyalarni olish (admin uchun)
    async findAll() {
        const reservations = JsonDatabase.find('reservations');
        return reservations.sort((a, b) => {
            const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
            if (dateCompare !== 0)
                return dateCompare;
            return b.reservation_time.localeCompare(a.reservation_time);
        });
    },
    async findById(id) {
        return JsonDatabase.findById('reservations', id);
    },
    async findByEmail(email) {
        const reservations = JsonDatabase.find('reservations', { customer_email: email });
        return reservations.sort((a, b) => new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime());
    },
    async findByDate(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const allReservations = JsonDatabase.find('reservations');
        const filtered = allReservations.filter(r => {
            const resDate = new Date(r.reservation_date);
            return resDate >= startOfDay && resDate <= endOfDay;
        });
        return filtered.sort((a, b) => a.reservation_time.localeCompare(b.reservation_time));
    },
    async create(reservationData) {
        return JsonDatabase.create('reservations', {
            ...reservationData,
            status: 'pending'
        });
    },
    async updateStatus(id, status) {
        return JsonDatabase.update('reservations', id, { status });
    },
    async update(id, data) {
        return JsonDatabase.update('reservations', id, data);
    },
    async filterByDateNameStatus(filters) {
        const allReservations = JsonDatabase.find('reservations');
        let filtered = allReservations;
        if (filters.date) {
            const date = new Date(filters.date);
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filtered = filtered.filter(r => {
                const resDate = new Date(r.reservation_date);
                return resDate >= startOfDay && resDate <= endOfDay;
            });
        }
        if (filters.name) {
            filtered = filtered.filter(r => r.customer_name.toLowerCase().includes(filters.name.toLowerCase()));
        }
        if (filters.status) {
            filtered = filtered.filter(r => r.status === filters.status);
        }
        return filtered.sort((a, b) => {
            const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
            if (dateCompare !== 0)
                return dateCompare;
            return b.reservation_time.localeCompare(a.reservation_time);
        });
    },
    async delete(id) {
        return JsonDatabase.delete('reservations', id);
    }
};
export default reservationRepository;
