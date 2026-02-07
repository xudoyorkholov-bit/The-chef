import { JsonDatabase } from '../database/jsonDb.js';

interface IOrder {
  _id: string;
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
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const orderRepository = {
  // Counter initialization
  initializeOrderCounter(): void {
    // Get existing orders count to initialize counter
    const orders = JsonDatabase.find('orders');
    const existingCount = orders.length;
    JsonDatabase.initializeCounter('orderNumber', existingCount);
  },

  // Generate next sequential order number
  getNextOrderNumber(): string {
    const nextNumber = JsonDatabase.incrementCounter('orderNumber');
    return `#${nextNumber}`;
  },

  // Foydalanuvchining buyurtmalarini olish
  async findByUserId(userId: string): Promise<IOrder[]> {
    const orders = JsonDatabase.find('orders', { user_id: userId });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Barcha buyurtmalarni olish (admin uchun)
  async findAll(): Promise<IOrder[]> {
    const orders = JsonDatabase.find('orders');
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // ID bo'yicha buyurtmani olish
  async findById(id: string): Promise<IOrder | null> {
    return JsonDatabase.findById('orders', id);
  },

  // Yangi buyurtma yaratish
  async create(orderData: {
    user_id?: string;
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
    // Initialize counter if this is the first order
    this.initializeOrderCounter();
    
    // Generate sequential order number
    const order_number = this.getNextOrderNumber();
    
    return JsonDatabase.create('orders', {
      ...orderData,
      order_number,
      status: orderData.status || 'pending'
    });
  },

  // Buyurtma statusini yangilash
  async updateStatus(id: string, status: string): Promise<IOrder | null> {
    return JsonDatabase.update('orders', id, { status });
  },

  // Buyurtmani o'chirish
  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('orders', id);
  }
};

export default orderRepository;
