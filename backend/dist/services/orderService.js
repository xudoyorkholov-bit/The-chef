import orderRepository from '../repositories/orderRepository';
export const orderService = {
    // Foydalanuvchining buyurtmalarini olish
    async getUserOrders(userId) {
        return await orderRepository.findByUserId(userId);
    },
    // Barcha buyurtmalarni olish (admin uchun)
    async getAllOrders() {
        return await orderRepository.findAll();
    },
    // ID bo'yicha buyurtmani olish
    async getOrderById(id, userId) {
        const order = await orderRepository.findById(id);
        if (!order) {
            throw new Error('Buyurtma topilmadi');
        }
        // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z buyurtmasini ko'rishi mumkin
        if (userId && order.user_id !== userId) {
            throw new Error('Ruxsat yo\'q');
        }
        return order;
    },
    // Yangi buyurtma yaratish
    async createOrder(orderData, userId) {
        // Buyurtma raqamini generatsiya qilish
        const orderNumber = orderRepository.generateOrderNumber();
        // Buyurtmani yaratish (MongoDB'da items ham birga saqlanadi)
        const order = await orderRepository.create({
            user_id: userId,
            order_number: orderNumber,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            customer_email: orderData.customer_email,
            items: orderData.items,
            total: orderData.total,
            notes: orderData.notes
        });
        return order;
    },
    // Buyurtma statusini yangilash
    async updateOrderStatus(id, status, userId) {
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Noto\'g\'ri status');
        }
        // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z buyurtmasini yangilashi mumkin
        if (userId) {
            const order = await orderRepository.findById(id);
            if (!order || order.user_id !== userId) {
                throw new Error('Ruxsat yo\'q');
            }
        }
        const order = await orderRepository.updateStatus(id, status);
        if (!order) {
            throw new Error('Buyurtma topilmadi');
        }
        return order;
    },
    // Buyurtmani o'chirish
    async deleteOrder(id, userId) {
        // Agar userId berilgan bo'lsa, foydalanuvchi faqat o'z buyurtmasini o'chirishi mumkin
        if (userId) {
            const order = await orderRepository.findById(id);
            if (!order || order.user_id !== userId) {
                throw new Error('Ruxsat yo\'q');
            }
        }
        const deleted = await orderRepository.delete(id);
        if (!deleted) {
            throw new Error('Buyurtma topilmadi');
        }
    }
};
