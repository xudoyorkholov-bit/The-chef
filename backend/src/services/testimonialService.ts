import testimonialRepository from '../repositories/testimonialRepository.js';
import { ITestimonial } from '../models/Testimonial.js';

const testimonialService = {
  async getAllTestimonials(): Promise<ITestimonial[]> {
    return await testimonialRepository.findAll();
  },

  async getTestimonialById(id: string): Promise<ITestimonial | null> {
    return await testimonialRepository.findById(id);
  },

  async getUserTestimonials(userId: string): Promise<ITestimonial[]> {
    return await testimonialRepository.findByUserId(userId);
  },

  async createTestimonial(data: {
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
  }): Promise<ITestimonial> {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Validate comment length
    if (data.comment.length < 10) {
      throw new Error('Comment must be at least 10 characters long');
    }

    if (data.comment.length > 500) {
      throw new Error('Comment must not exceed 500 characters');
    }

    return await testimonialRepository.create(data);
  },

  async updateTestimonialStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<ITestimonial | null> {
    return await testimonialRepository.updateStatus(id, status);
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    return await testimonialRepository.delete(id);
  }
};

export default testimonialService;
