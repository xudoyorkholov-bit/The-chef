import testimonialService from '../services/testimonialService.js';
const testimonialController = {
    async getAllTestimonials(req, res) {
        try {
            // Admin uchun barcha fikrlarni qaytarish
            const testimonials = await testimonialService.getAllTestimonials();
            res.json(testimonials);
        }
        catch (error) {
            console.error('Get testimonials error:', error);
            res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
    },
    async getApprovedTestimonials(req, res) {
        try {
            // Foydalanuvchilar uchun faqat tasdiqlangan fikrlarni qaytarish
            const testimonials = await testimonialService.getApprovedTestimonials();
            res.json(testimonials);
        }
        catch (error) {
            console.error('Get approved testimonials error:', error);
            res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
    },
    async getTestimonialById(req, res) {
        try {
            const { id } = req.params;
            const testimonial = await testimonialService.getTestimonialById(id);
            if (!testimonial) {
                res.status(404).json({ error: 'Testimonial not found' });
                return;
            }
            res.json(testimonial);
        }
        catch (error) {
            console.error('Get testimonial error:', error);
            res.status(500).json({ error: 'Failed to fetch testimonial' });
        }
    },
    async getUserTestimonials(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const testimonials = await testimonialService.getUserTestimonials(userId);
            res.json(testimonials);
        }
        catch (error) {
            console.error('Get user testimonials error:', error);
            res.status(500).json({ error: 'Failed to fetch user testimonials' });
        }
    },
    async createTestimonial(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { rating, comment } = req.body;
            // Validation
            if (!rating || !comment) {
                res.status(400).json({ error: 'Rating and comment are required' });
                return;
            }
            // Get user name from request (populated by auth middleware)
            const userName = req.user?.username || 'Anonymous';
            const testimonial = await testimonialService.createTestimonial({
                user_id: userId,
                user_name: userName,
                rating: Number(rating),
                comment: comment.trim()
            });
            res.status(201).json(testimonial);
        }
        catch (error) {
            console.error('Create testimonial error:', error);
            res.status(400).json({ error: error.message || 'Failed to create testimonial' });
        }
    },
    async updateTestimonialStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                res.status(400).json({ error: 'Invalid status' });
                return;
            }
            const testimonial = await testimonialService.updateTestimonialStatus(id, status);
            if (!testimonial) {
                res.status(404).json({ error: 'Testimonial not found' });
                return;
            }
            res.json(testimonial);
        }
        catch (error) {
            console.error('Update testimonial status error:', error);
            res.status(500).json({ error: 'Failed to update testimonial status' });
        }
    },
    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            // Get testimonial to check ownership
            const testimonial = await testimonialService.getTestimonialById(id);
            if (!testimonial) {
                res.status(404).json({ error: 'Testimonial not found' });
                return;
            }
            // Check if user owns this testimonial or is admin
            if (testimonial.user_id.toString() !== userId && req.user?.role !== 'admin') {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const deleted = await testimonialService.deleteTestimonial(id);
            if (!deleted) {
                res.status(404).json({ error: 'Testimonial not found' });
                return;
            }
            res.json({ message: 'Testimonial deleted successfully' });
        }
        catch (error) {
            console.error('Delete testimonial error:', error);
            res.status(500).json({ error: 'Failed to delete testimonial' });
        }
    }
};
export default testimonialController;
