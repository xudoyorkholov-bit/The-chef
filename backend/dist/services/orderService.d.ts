import { IOrder } from '../models/Order';
import { CreateOrderRequest } from '../types';
export declare const orderService: {
    getUserOrders(userId: string): Promise<IOrder[]>;
    getAllOrders(): Promise<IOrder[]>;
    getOrderById(id: string, userId?: string): Promise<IOrder>;
    createOrder(orderData: CreateOrderRequest, userId?: string): Promise<IOrder>;
    updateOrderStatus(id: string, status: string, userId?: string): Promise<IOrder>;
    deleteOrder(id: string, userId?: string): Promise<void>;
};
//# sourceMappingURL=orderService.d.ts.map