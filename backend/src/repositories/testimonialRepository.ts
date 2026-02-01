import Testimonial from '../models/Testimonial';
import { ITestimonial } from '../models/Testimonial';

const testimonialRepository = {
  async findAll(): Promise<ITestimonial[]> {
    return await Testimonial.find({ status: 'approved' })
      .sort({ created_at: -1 })
      .populate('user_id', 'username full_name');
  },

  async findById(id: string): Promise<ITestimonial | null> {
    return await Testimonial.findById(id).populate('user_id', 'username full_name');
  },

  async findByUserId(userId: string): Promise<ITestimonial[]> {
    return await Testimonial.find({ user_id: userId }).sort({ created_at: -1 });
  },

  async create(testimonialData: {
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
  }): Promise<ITestimonial> {
    const testimonial = new Testimonial(testimonialData);
    return await testimonial.save();
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ITestimonial | null> {
    return await Testimonial.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    const result = await Testimonial.findByIdAndDelete(id);
    return result !== null;
  }
};

export default testimonialRepository;
