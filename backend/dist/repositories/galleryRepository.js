import Gallery from '../models/Gallery.js';
const galleryRepository = {
    async findAll() {
        return await Gallery.find().sort({ display_order: 1, created_at: -1 });
    },
    async findById(id) {
        return await Gallery.findById(id);
    },
    async create(galleryData) {
        const gallery = new Gallery(galleryData);
        return await gallery.save();
    },
    async update(id, galleryData) {
        return await Gallery.findByIdAndUpdate(id, galleryData, { new: true });
    },
    async delete(id) {
        const result = await Gallery.findByIdAndDelete(id);
        return result !== null;
    },
    async updateDisplayOrder(id, display_order) {
        return await Gallery.findByIdAndUpdate(id, { display_order }, { new: true });
    }
};
export default galleryRepository;
