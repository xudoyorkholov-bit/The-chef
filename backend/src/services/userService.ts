import userRepository from '../repositories/userRepository.js';
import { IUser } from '../models/User.js';

const userService = {
  async getProfile(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  },

  async updateProfile(userId: string, data: { full_name?: string; phone?: string }): Promise<IUser | null> {
    return await userRepository.updateProfile(userId, data);
  },

  async updateProfilePicture(userId: string, imageUrl: string): Promise<IUser | null> {
    return await userRepository.updateProfilePicture(userId, imageUrl);
  },

  async deleteProfilePicture(userId: string): Promise<IUser | null> {
    return await userRepository.deleteProfilePicture(userId);
  },

  validateImageFile(file: Express.Multer.File): { valid: boolean; error?: string } {
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

  async addPaymentMethod(userId: string, cardData: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }): Promise<IUser | null> {
    return await userRepository.addPaymentMethod(userId, cardData);
  },

  async updatePaymentMethod(userId: string, cardId: string, isDefault: boolean): Promise<IUser | null> {
    return await userRepository.updatePaymentMethod(userId, cardId, isDefault);
  },

  async deletePaymentMethod(userId: string, cardId: string): Promise<IUser | null> {
    return await userRepository.deletePaymentMethod(userId, cardId);
  }
};

export default userService;
