import User from '../models/User.js';
const userRepository = {
    async findAll() {
        return await User.find().sort({ created_at: -1 });
    },
    async findById(id) {
        return await User.findById(id);
    },
    async findByUsername(username) {
        return await User.findOne({ username });
    },
    async findByEmail(email) {
        return await User.findOne({ email });
    },
    async create(userData) {
        const user = new User(userData);
        return await user.save();
    },
    async updateLastLogin(id) {
        return await User.findByIdAndUpdate(id, { last_login: new Date() }, { new: true });
    },
    async delete(id) {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    },
    async updateProfile(id, data) {
        return await User.findByIdAndUpdate(id, { $set: data }, { new: true });
    },
    async updateProfilePicture(id, imageUrl) {
        return await User.findByIdAndUpdate(id, { $set: { profile_picture_url: imageUrl } }, { new: true });
    },
    async deleteProfilePicture(id) {
        return await User.findByIdAndUpdate(id, { $unset: { profile_picture_url: '' } }, { new: true });
    },
    async addPaymentMethod(id, cardData) {
        const user = await User.findById(id);
        if (!user)
            return null;
        // If this is the default card, unset other defaults
        if (cardData.isDefault && user.payment_methods) {
            user.payment_methods = user.payment_methods.map(card => ({
                ...card,
                isDefault: false
            }));
        }
        return await User.findByIdAndUpdate(id, { $push: { payment_methods: cardData } }, { new: true });
    },
    async updatePaymentMethod(id, cardId, isDefault) {
        const user = await User.findById(id);
        if (!user || !user.payment_methods)
            return null;
        // If setting as default, unset other defaults and set the specified card as default
        if (isDefault) {
            user.payment_methods = user.payment_methods.map(card => {
                // Check both id field and _id
                const cardIdMatch = card.id === cardId || card._id?.toString() === cardId;
                return {
                    ...card,
                    isDefault: cardIdMatch
                };
            });
            await user.save();
            return user;
        }
        return user;
    },
    async deletePaymentMethod(id, cardId) {
        // Try to delete by custom id field first, then by MongoDB _id
        let result = await User.findByIdAndUpdate(id, { $pull: { payment_methods: { id: cardId } } }, { new: true });
        // If not found by id field, try by _id
        if (result && result.payment_methods) {
            const initialLength = result.payment_methods.length;
            result = await User.findByIdAndUpdate(id, { $pull: { payment_methods: { _id: cardId } } }, { new: true });
        }
        return result;
    }
};
export default userRepository;
