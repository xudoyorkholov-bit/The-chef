import { JsonDatabase } from '../database/jsonDb.js';
const orderRepository = {
    // Counter initialization
    initializeOrderCounter() {
        // Get existing orders count to initialize counter
        const orders = JsonDatabase.find('orders');
        const existingCount = orders.length;
        JsonDatabase.initializeCounter('orderNumber', existingCount);
    },
    // Generate next sequential order number
    getNextOrderNumber() {
        const nextNumber = JsonDatabase.incrementCounter('orderNumber');
        return `#${nextNumber}`;
    },
    // Foydalanuvchining buyurtmalarini olish
    async findByUserId(userId) {
        const orders = JsonDatabase.find('orders', { user_id: userId });
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    // Barcha buyurtmalarni olish (admin uchun)
    async findAll() {
        const orders = JsonDatabase.find('orders');
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    // ID bo'yicha buyurtmani olish
    async findById(id) {
        return JsonDatabase.findById('orders', id);
    },
    // Yangi buyurtma yaratish
    async create(orderData) {
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
    async updateStatus(id, status) {
        return JsonDatabase.update('orders', id, { status });
    },
    // Buyurtmani o'chirish
    async delete(id) {
        return JsonDatabase.delete('orders', id);
    }
};
export default orderRepository;
