import { Reservation, CreateReservationRequest } from '../types/index.js';
export declare class ReservationService {
    getUserReservations(userId: string): Promise<Reservation[]>;
    getAllReservations(): Promise<Reservation[]>;
    getReservationById(id: string, userId?: string): Promise<Reservation>;
    createReservation(data: CreateReservationRequest, userId?: string): Promise<Reservation>;
    updateReservation(id: string, data: Partial<Reservation>, userId?: string): Promise<Reservation>;
    deleteReservation(id: string, userId?: string): Promise<void>;
    filterReservations(filters: {
        date?: string;
        name?: string;
        status?: string;
    }): Promise<Reservation[]>;
}
declare const _default: ReservationService;
export default _default;
//# sourceMappingURL=reservationService.d.ts.map