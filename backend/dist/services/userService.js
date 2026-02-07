import userRepository from '../repositories/userRepository.js';
import authService from './authService.js';
const userService = {
    async getAllUsers() {
        return await userRepository.findAll();
    },
    async getProfile(userId) {
        return await userRepository.findById(userId);
    },
    async updateProfile(userId, data) {
        // Prepare update data for repository
        const updateData = {
            full_name: data.full_name,
            phone: data.phone
        };
        // If phone is being updated, also update username (since username is the phone number)
        if (data.phone) {
            updateData.username = data.phone;
        }
        // Hash password if provided and not masked (masked password is exactly "********")
        if (data.password && data.password !== '********') {
            updateData.password_hash = await authService.hashPassword(data.password);
        }
        return await userRepository.updateProfile(userId, updateData);
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
