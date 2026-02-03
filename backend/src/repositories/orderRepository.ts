import Order from '../models/Order.js';
import { IOrder } from '../models/Order.js';

const orderRepository = {
  // Foydalanuvchining buyurtmalarini olish
  async findByUserId(userId: string): Promise<IOrder[]> {
    return await Order.find({ user_id: userId }).sort({ created_at: -1 });
  },

  // Barcha buyurtmalarni olish (admin uchun)
  async findAll(): Promise<IOrder[]> {
    return await Order.find().sort({ created_at: -1 });
  },

  // ID bo'yicha buyurtmani olish
  async findById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  },

  // Yangi buyurtma yaratish
  async create(orderData: {
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
  }): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
  },

  // Buyurtma statusini yangilash
  async updateStatus(id: string, status: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
  },

  // Buyurtmani o'chirish
  async delete(id: string): Promise<boolean> {
    const result = await Order.findByIdAndDelete(id);
    return result !== null;
  },

  // Buyurtma raqamini generatsiya qilish
  generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `#${timestamp}${random}`;
  }
};

export default orderRepository;
