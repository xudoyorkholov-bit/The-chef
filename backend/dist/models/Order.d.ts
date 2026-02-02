import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    menu_item_id: string;
    menu_item_name: string;
    quantity: number;
    price: number;
}
export interface IOrder extends Document {
    user_id?: string;
    order_number: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    notes?: string;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map