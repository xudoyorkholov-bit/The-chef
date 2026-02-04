import { JsonDatabase } from '../database/jsonDb.js';

interface IReservation {
  _id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: Date;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const reservationRepository = {
  // Foydalanuvchining rezervatsiyalarini olish
  async findByUserId(userId: string): Promise<IReservation[]> {
    const reservations = JsonDatabase.find('reservations', { user_id: userId });
    return reservations.sort((a, b) => {
      const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.reservation_time.localeCompare(a.reservation_time);
    });
  },

  // Barcha rezervatsiyalarni olish (admin uchun)
  async findAll(): Promise<IReservation[]> {
    const reservations = JsonDatabase.find('reservations');
    return reservations.sort((a, b) => {
      const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.reservation_time.localeCompare(a.reservation_time);
    });
  },

  async findById(id: string): Promise<IReservation | null> {
    return JsonDatabase.findById('reservations', id);
  },

  async findByEmail(email: string): Promise<IReservation[]> {
    const reservations = JsonDatabase.find('reservations', { customer_email: email });
    return reservations.sort((a, b) => new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime());
  },

  async findByDate(date: Date): Promise<IReservation[]> {
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
    return JsonDatabase.create('reservations', {
      ...reservationData,
      status: 'pending'
    });
  },

  async updateStatus(id: string, status: string): Promise<IReservation | null> {
    return JsonDatabase.update('reservations', id, { status });
  },

  async update(id: string, data: Partial<IReservation>): Promise<IReservation | null> {
    return JsonDatabase.update('reservations', id, data);
  },

  async filterByDateNameStatus(filters: { date?: string; name?: string; status?: string }): Promise<IReservation[]> {
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
      filtered = filtered.filter(r => 
        r.customer_name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    return filtered.sort((a, b) => {
      const dateCompare = new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.reservation_time.localeCompare(a.reservation_time);
    });
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('reservations', id);
  }
};

export default reservationRepository;
