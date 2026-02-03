import User from '../models/User.js';
import { IUser } from '../models/User.js';

const userRepository = {
  async findAll(): Promise<IUser[]> {
    return await User.find().sort({ created_at: -1 });
  },

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  },

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  },

  async create(userData: {
    username: string;
    password_hash: string;
    email: string;
    phone?: string;
    full_name?: string;
    role?: 'admin' | 'customer';
  }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  },

  async updateLastLogin(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { last_login: new Date() },
      { new: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  },

  async updateProfile(id: string, data: { full_name?: string; phone?: string }): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  },

  async updateProfilePicture(id: string, imageUrl: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: { profile_picture_url: imageUrl } },
      { new: true }
    );
  },

  async deleteProfilePicture(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $unset: { profile_picture_url: '' } },
      { new: true }
    );
  },

  async addPaymentMethod(id: string, cardData: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) return null;

    // If this is the default card, unset other defaults
    if (cardData.isDefault && user.payment_methods) {
      user.payment_methods = user.payment_methods.map(card => ({
        ...card,
        isDefault: false
      }));
    }

    return await User.findByIdAndUpdate(
      id,
      { $push: { payment_methods: cardData } },
      { new: true }
    );
  },

  async updatePaymentMethod(id: string, cardId: string, isDefault: boolean): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || !user.payment_methods) return null;

    // If setting as default, unset other defaults and set the specified card as default
    if (isDefault) {
      user.payment_methods = user.payment_methods.map(card => {
        // Check both id field and _id
        const cardIdMatch = card.id === cardId || (card as any)._id?.toString() === cardId;
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

  async deletePaymentMethod(id: string, cardId: string): Promise<IUser | null> {
    // Try to delete by custom id field first, then by MongoDB _id
    let result = await User.findByIdAndUpdate(
      id,
      { $pull: { payment_methods: { id: cardId } } },
      { new: true }
    );
    
    // If not found by id field, try by _id
    if (result && result.payment_methods) {
      const initialLength = result.payment_methods.length;
      result = await User.findByIdAndUpdate(
        id,
        { $pull: { payment_methods: { _id: cardId } } },
        { new: true }
      );
    }
    
    return result;
  }
};

export default userRepository;
