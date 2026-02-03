import Reservation from '../models/Reservation.js';
const reservationRepository = {
    // Foydalanuvchining rezervatsiyalarini olish
    async findByUserId(userId) {
        return await Reservation.find({ user_id: userId }).sort({ reservation_date: -1, reservation_time: -1 });
    },
    // Barcha rezervatsiyalarni olish (admin uchun)
    async findAll() {
        return await Reservation.find().sort({ reservation_date: -1, reservation_time: -1 });
    },
    async findById(id) {
        return await Reservation.findById(id);
    },
    async findByEmail(email) {
        return await Reservation.find({ customer_email: email }).sort({ reservation_date: -1 });
    },
    async findByDate(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return await Reservation.find({
            reservation_date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ reservation_time: 1 });
    },
    async create(reservationData) {
        const reservation = new Reservation(reservationData);
        return await reservation.save();
    },
    async updateStatus(id, status) {
        return await Reservation.findByIdAndUpdate(id, { status, updated_at: new Date() }, { new: true });
    },
    async update(id, data) {
        return await Reservation.findByIdAndUpdate(id, { ...data, updated_at: new Date() }, { new: true });
    },
    async filterByDateNameStatus(filters) {
        const query = {};
        if (filters.date) {
            const date = new Date(filters.date);
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.reservation_date = { $gte: startOfDay, $lte: endOfDay };
        }
        if (filters.name) {
            query.customer_name = { $regex: filters.name, $options: 'i' };
        }
        if (filters.status) {
            query.status = filters.status;
        }
        return await Reservation.find(query).sort({ reservation_date: -1, reservation_time: -1 });
    },
    async delete(id) {
        const result = await Reservation.findByIdAndDelete(id);
        return result !== null;
    }
};
export default reservationRepository;
