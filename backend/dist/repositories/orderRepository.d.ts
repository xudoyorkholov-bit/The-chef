import { IOrder } from '../models/Order';
declare const orderRepository: {
    findByUserId(userId: string): Promise<IOrder[]>;
    findAll(): Promise<IOrder[]>;
    findById(id: string): Promise<IOrder | null>;
    create(orderData: {
        user_id?: string;
        order_number: string;
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
        items: Array<{
            menu_item_id: string;
            menu_item_name: string;
            quantity: number;
            price: number;
        }>;
        total: number;
        status?: string;
        notes?: string;
    }): Promise<IOrder>;
    updateStatus(id: string, status: string): Promise<IOrder | null>;
    delete(id: string): Promise<boolean>;
    generateOrderNumber(): string;
};
export default orderRepository;
//# sourceMappingURL=orderRepository.d.ts.map