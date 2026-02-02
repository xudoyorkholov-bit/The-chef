import testimonialRepository from '../repositories/testimonialRepository.js';
const testimonialService = {
    async getAllTestimonials() {
        return await testimonialRepository.findAll();
    },
    async getTestimonialById(id) {
        return await testimonialRepository.findById(id);
    },
    async getUserTestimonials(userId) {
        return await testimonialRepository.findByUserId(userId);
    },
    async createTestimonial(data) {
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
    async updateTestimonialStatus(id, status) {
        return await testimonialRepository.updateStatus(id, status);
    },
    async deleteTestimonial(id) {
        return await testimonialRepository.delete(id);
    }
};
export default testimonialService;
