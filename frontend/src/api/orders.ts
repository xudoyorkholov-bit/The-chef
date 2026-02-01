import client from './client';

export interface OrderItem {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  date: string;
}

export interface CreateOrderRequest {
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
  notes?: string;
}

export const ordersApi = {
  // Buyurtmalarni olish
  getAll: async (): Promise<Order[]> => {
    const response = await client.get('/orders');
    return response.data.map((order: any) => ({
      ...order,
      orderNumber: order.order_number,
      date: order.created_at
    }));
  },

  // Yangi buyurtma yaratish
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await client.post('/orders', orderData);
    return {
      ...response.data,
      orderNumber: response.data.order_number,
      date: response.data.created_at
    };
  },

  // Buyurtmani ID bo'yicha olish
  getById: async (id: string): Promise<Order> => {
    const response = await client.get(`/orders/${id}`);
    return {
      ...response.data,
      orderNumber: response.data.order_number,
      date: response.data.created_at
    };
  }
};
