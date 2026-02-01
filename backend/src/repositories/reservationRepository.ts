import Reservation from '../models/Reservation';
import { IReservation } from '../models/Reservation';

const reservationRepository = {
  // Foydalanuvchining rezervatsiyalarini olish
  async findByUserId(userId: string): Promise<IReservation[]> {
    return await Reservation.find({ user_id: userId }).sort({ reservation_date: -1, reservation_time: -1 });
  },

  // Barcha rezervatsiyalarni olish (admin uchun)
  async findAll(): Promise<IReservation[]> {
    return await Reservation.find().sort({ reservation_date: -1, reservation_time: -1 });
  },

  async findById(id: string): Promise<IReservation | null> {
    return await Reservation.findById(id);
  },

  async findByEmail(email: string): Promise<IReservation[]> {
    return await Reservation.find({ customer_email: email }).sort({ reservation_date: -1 });
  },

  async findByDate(date: Date): Promise<IReservation[]> {
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

  async create(reservationData: {
    user_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    reservation_date: Date;
    reservation_time: string;
    party_size: number;
    special_requests?: string;
  }): Promise<IReservation> {
    const reservation = new Reservation(reservationData);
    return await reservation.save();
  },

  async updateStatus(id: string, status: string): Promise<IReservation | null> {
    return await Reservation.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
  },

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    return await Reservation.findByIdAndUpdate(
      id,
      { ...data, updated_at: new Date() },
      { new: true }
    );
  },

  async filterByDateNameStatus(filters: { date?: string; name?: string; status?: string }): Promise<IReservation[]> {
    const query: any = {};
    
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

  async delete(id: string): Promise<boolean> {
    const result = await Reservation.findByIdAndDelete(id);
    return result !== null;
  }
};

export default reservationRepository;
