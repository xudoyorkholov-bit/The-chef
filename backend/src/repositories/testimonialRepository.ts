import { JsonDatabase } from '../database/jsonDb.js';

interface ITestimonial {
  _id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const testimonialRepository = {
  async findAll(): Promise<ITestimonial[]> {
    const testimonials = JsonDatabase.find('testimonials', {});
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findApproved(): Promise<ITestimonial[]> {
    const testimonials = JsonDatabase.find('testimonials', { status: 'approved' });
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findById(id: string): Promise<ITestimonial | null> {
    return JsonDatabase.findById('testimonials', id);
  },

  async findByUserId(userId: string): Promise<ITestimonial[]> {
    const testimonials = JsonDatabase.find('testimonials', { user_id: userId });
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(testimonialData: {
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
  }): Promise<ITestimonial> {
    return JsonDatabase.create('testimonials', {
      ...testimonialData,
      status: 'pending'
    });
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ITestimonial | null> {
    return JsonDatabase.update('testimonials', id, { status });
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('testimonials', id);
  }
};

export default testimonialRepository;
