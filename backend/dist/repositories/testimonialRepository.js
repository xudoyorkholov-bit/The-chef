import Testimonial from '../models/Testimonial.js';
const testimonialRepository = {
    async findAll() {
        return await Testimonial.find({ status: 'approved' })
            .sort({ created_at: -1 })
            .populate('user_id', 'username full_name');
    },
    async findById(id) {
        return await Testimonial.findById(id).populate('user_id', 'username full_name');
    },
    async findByUserId(userId) {
        return await Testimonial.find({ user_id: userId }).sort({ created_at: -1 });
    },
    async create(testimonialData) {
        const testimonial = new Testimonial(testimonialData);
        return await testimonial.save();
    },
    async updateStatus(id, status) {
        return await Testimonial.findByIdAndUpdate(id, { status, updated_at: new Date() }, { new: true });
    },
    async delete(id) {
        const result = await Testimonial.findByIdAndDelete(id);
        return result !== null;
    }
};
export default testimonialRepository;
