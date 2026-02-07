import client from './client';
import { User } from '../types';

export const usersApi = {
  async getAll(): Promise<User[]> {
    const response = await client.get('/users');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await client.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: { full_name?: string; phone?: string; password?: string }): Promise<User> {
    const response = await client.put('/users/profile', data);
    return response.data;
  },

  async uploadProfilePicture(file: File): Promise<{ message: string; profile_picture_url: string }> {
    const formData = new FormData();
    formData.append('picture', file);

    const response = await client.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProfilePicture(): Promise<{ message: string }> {
    const response = await client.delete('/users/profile/picture');
    return response.data;
  },

  async addPaymentMethod(cardData: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }): Promise<{ message: string; payment_methods: any[] }> {
    const response = await client.post('/users/payment-methods', cardData);
    return response.data;
  },

  async updatePaymentMethod(cardId: string, isDefault: boolean): Promise<{ message: string; payment_methods: any[] }> {
    const response = await client.put(`/users/payment-methods/${cardId}`, { isDefault });
    return response.data;
  },

  async deletePaymentMethod(cardId: string): Promise<{ message: string; payment_methods: any[] }> {
    const response = await client.delete(`/users/payment-methods/${cardId}`);
    return response.data;
  },
};
