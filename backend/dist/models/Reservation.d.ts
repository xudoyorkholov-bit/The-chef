import mongoose, { Document } from 'mongoose';
export interface IReservation extends Document {
    user_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    reservation_date: Date;
    reservation_time: string;
    party_size: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    special_requests?: string;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IReservation, {}, {}, {}, mongoose.Document<unknown, {}, IReservation, {}, mongoose.DefaultSchemaOptions> & IReservation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReservation>;
export default _default;
//# sourceMappingURL=Reservation.d.ts.map