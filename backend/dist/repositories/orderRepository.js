import Order from '../models/Order';
const orderRepository = {
    // Foydalanuvchining buyurtmalarini olish
    async findByUserId(userId) {
        return await Order.find({ user_id: userId }).sort({ created_at: -1 });
    },
    // Barcha buyurtmalarni olish (admin uchun)
    async findAll() {
        return await Order.find().sort({ created_at: -1 });
    },
    // ID bo'yicha buyurtmani olish
    async findById(id) {
        return await Order.findById(id);
    },
    // Yangi buyurtma yaratish
    async create(orderData) {
        const order = new Order(orderData);
        return await order.save();
    },
    // Buyurtma statusini yangilash
    async updateStatus(id, status) {
        return await Order.findByIdAndUpdate(id, { status, updated_at: new Date() }, { new: true });
    },
    // Buyurtmani o'chirish
    async delete(id) {
        const result = await Order.findByIdAndDelete(id);
        return result !== null;
    },
    // Buyurtma raqamini generatsiya qilish
    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#${timestamp}${random}`;
    }
};
export default orderRepository;
