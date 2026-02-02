import userRepository from '../repositories/userRepository.js';
const userService = {
    async getProfile(userId) {
        return await userRepository.findById(userId);
    },
    async updateProfile(userId, data) {
        return await userRepository.updateProfile(userId, data);
    },
    async updateProfilePicture(userId, imageUrl) {
        return await userRepository.updateProfilePicture(userId, imageUrl);
    },
    async deleteProfilePicture(userId) {
        return await userRepository.deleteProfilePicture(userId);
    },
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!allowedTypes.includes(file.mimetype)) {
            return {
                valid: false,
                error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
            };
        }
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'File size exceeds 5MB limit.'
            };
        }
        return { valid: true };
    },
    async addPaymentMethod(userId, cardData) {
        return await userRepository.addPaymentMethod(userId, cardData);
    },
    async updatePaymentMethod(userId, cardId, isDefault) {
        return await userRepository.updatePaymentMethod(userId, cardId, isDefault);
    },
    async deletePaymentMethod(userId, cardId) {
        return await userRepository.deletePaymentMethod(userId, cardId);
    }
};
export default userService;
