import { IReservation } from '../models/Reservation';
declare const reservationRepository: {
    findByUserId(userId: string): Promise<IReservation[]>;
    findAll(): Promise<IReservation[]>;
    findById(id: string): Promise<IReservation | null>;
    findByEmail(email: string): Promise<IReservation[]>;
    findByDate(date: Date): Promise<IReservation[]>;
    create(reservationData: {
        user_id?: string;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        reservation_date: Date;
        reservation_time: string;
        party_size: number;
        special_requests?: string;
    }): Promise<IReservation>;
    updateStatus(id: string, status: string): Promise<IReservation | null>;
    update(id: string, data: Partial<IReservation>): Promise<IReservation | null>;
    filterByDateNameStatus(filters: {
        date?: string;
        name?: string;
        status?: string;
    }): Promise<IReservation[]>;
    delete(id: string): Promise<boolean>;
};
export default reservationRepository;
//# sourceMappingURL=reservationRepository.d.ts.map