import { JsonDatabase } from '../database/jsonDb.js';
const testimonialRepository = {
    async findAll() {
        const testimonials = JsonDatabase.find('testimonials', {});
        return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async findApproved() {
        const testimonials = JsonDatabase.find('testimonials', { status: 'approved' });
        return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async findById(id) {
        return JsonDatabase.findById('testimonials', id);
    },
    async findByUserId(userId) {
        const testimonials = JsonDatabase.find('testimonials', { user_id: userId });
        return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async create(testimonialData) {
        return JsonDatabase.create('testimonials', {
            ...testimonialData,
            status: 'pending'
        });
    },
    async updateStatus(id, status) {
        return JsonDatabase.update('testimonials', id, { status });
    },
    async delete(id) {
        return JsonDatabase.delete('testimonials', id);
    }
};
export default testimonialRepository;
