import userRepository from '../repositories/userRepository.js';
import authService from './authService.js';

// Use the same interface as repository
interface IUser {
  _id: string;
  username: string;
  password_hash: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: 'admin' | 'customer';
  profile_picture_url?: string;
  payment_methods?: Array<{
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }>;
  last_login?: Date;
  createdAt: string;
  updatedAt: string;
}

const userService = {
  async getProfile(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  },

  async updateProfile(userId: string, data: { full_name?: string; phone?: string; password?: string }): Promise<IUser | null> {
    // Prepare update data for repository
    const updateData: { full_name?: string; phone?: string; password_hash?: string; username?: string } = {
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
