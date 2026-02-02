import { Request, Response } from 'express';
export declare class ReservationController {
    getAllReservations(req: Request, res: Response): Promise<void>;
    getReservationById(req: Request, res: Response): Promise<void>;
    createReservation(req: Request, res: Response): Promise<void>;
    updateReservation(req: Request, res: Response): Promise<void>;
    deleteReservation(req: Request, res: Response): Promise<void>;
}
declare const _default: ReservationController;
export default _default;
//# sourceMappingURL=reservationController.d.ts.map