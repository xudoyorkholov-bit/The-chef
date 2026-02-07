import client from './client';

export interface Testimonial {
  id: string;
  _id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialRequest {
  rating: number;
  comment: string;
}

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    // Admin uchun barcha fikrlar, oddiy foydalanuvchilar uchun faqat tasdiqlangan
    try {
      const response = await client.get('/testimonials');
      return response.data;
    } catch (error: any) {
      // Agar admin emas bo'lsa, faqat tasdiqlangan fikrlarni olish
      if (error.response?.status === 401 || error.response?.status === 403) {
        const response = await client.get('/testimonials/approved');
        return response.data;
      }
      throw error;
    }
  },

  async getApproved(): Promise<Testimonial[]> {
    const response = await client.get('/testimonials/approved');
    return response.data;
  },

  async getById(id: string): Promise<Testimonial> {
    const response = await client.get(`/testimonials/${id}`);
    return response.data;
  },

  async getMyTestimonials(): Promise<Testimonial[]> {
    const response = await client.get('/testimonials/user/my-testimonials');
    return response.data;
  },

  async create(data: CreateTestimonialRequest): Promise<Testimonial> {
    const response = await client.post('/testimonials', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await client.delete(`/testimonials/${id}`);
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Testimonial> {
    const response = await client.patch(`/testimonials/${id}/status`, { status });
    return response.data;
  }
};
