import { JsonDatabase } from '../database/jsonDb.js';
const userRepository = {
    async findAll() {
        return JsonDatabase.find('users');
    },
    async findById(id) {
        return JsonDatabase.findById('users', id);
    },
    async findByUsername(username) {
        return JsonDatabase.findOne('users', { username });
    },
    async findByEmail(email) {
        return JsonDatabase.findOne('users', { email });
    },
    async create(userData) {
        return JsonDatabase.create('users', {
            ...userData,
            role: userData.role || 'customer',
            payment_methods: []
        });
    },
    async updateLastLogin(id) {
        return JsonDatabase.update('users', id, { last_login: new Date() });
    },
    async delete(id) {
        return JsonDatabase.delete('users', id);
    },
    async updateProfile(id, data) {
        return JsonDatabase.update('users', id, data);
    },
    async updateProfilePicture(id, imageUrl) {
        return JsonDatabase.update('users', id, { profile_picture_url: imageUrl });
    },
    async deleteProfilePicture(id) {
        const user = await this.findById(id);
        if (!user)
            return null;
        delete user.profile_picture_url;
        return JsonDatabase.update('users', id, user);
    },
    async addPaymentMethod(id, cardData) {
        const user = await this.findById(id);
        if (!user)
            return null;
        // If this is the default card, unset other defaults
        if (cardData.isDefault && user.payment_methods) {
            user.payment_methods = user.payment_methods.map(card => ({
                ...card,
                isDefault: false
            }));
        }
        user.payment_methods = user.payment_methods || [];
        user.payment_methods.push(cardData);
        return JsonDatabase.update('users', id, { payment_methods: user.payment_methods });
    },
    async updatePaymentMethod(id, cardId, isDefault) {
        const user = await this.findById(id);
        if (!user || !user.payment_methods)
            return null;
        // If setting as default, unset other defaults and set the specified card as default
        if (isDefault) {
            user.payment_methods = user.payment_methods.map(card => ({
                ...card,
                isDefault: card.id === cardId
            }));
            return JsonDatabase.update('users', id, { payment_methods: user.payment_methods });
        }
        return user;
    },
    async deletePaymentMethod(id, cardId) {
        const user = await this.findById(id);
        if (!user || !user.payment_methods)
            return null;
        user.payment_methods = user.payment_methods.filter(card => card.id !== cardId);
        return JsonDatabase.update('users', id, { payment_methods: user.payment_methods });
    }
};
export default userRepository;
