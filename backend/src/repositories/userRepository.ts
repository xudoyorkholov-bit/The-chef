import { JsonDatabase } from '../database/jsonDb.js';

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

const userRepository = {
  async findAll(): Promise<IUser[]> {
    return JsonDatabase.find('users');
  },

  async findById(id: string): Promise<IUser | null> {
    return JsonDatabase.findById('users', id);
  },

  async findByUsername(username: string): Promise<IUser | null> {
    return JsonDatabase.findOne('users', { username });
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return JsonDatabase.findOne('users', { email });
  },

  async create(userData: {
    username: string;
    password_hash: string;
    email: string;
    phone?: string;
    full_name?: string;
    role?: 'admin' | 'customer';
  }): Promise<IUser> {
    return JsonDatabase.create('users', {
      ...userData,
      role: userData.role || 'customer',
      payment_methods: []
    });
  },

  async updateLastLogin(id: string): Promise<IUser | null> {
    return JsonDatabase.update('users', id, { last_login: new Date() });
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('users', id);
  },

  async updateProfile(id: string, data: { full_name?: string; phone?: string; password_hash?: string; username?: string }): Promise<IUser | null> {
    return JsonDatabase.update('users', id, data);
  },

  async updateProfilePicture(id: string, imageUrl: string): Promise<IUser | null> {
    return JsonDatabase.update('users', id, { profile_picture_url: imageUrl });
  },

  async deleteProfilePicture(id: string): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) return null;
    delete user.profile_picture_url;
    return JsonDatabase.update('users', id, user);
  },

  async addPaymentMethod(id: string, cardData: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) return null;

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

  async updatePaymentMethod(id: string, cardId: string, isDefault: boolean): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user || !user.payment_methods) return null;

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

  async deletePaymentMethod(id: string, cardId: string): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user || !user.payment_methods) return null;

    user.payment_methods = user.payment_methods.filter(card => card.id !== cardId);
    return JsonDatabase.update('users', id, { payment_methods: user.payment_methods });
  }
};

export default userRepository;
