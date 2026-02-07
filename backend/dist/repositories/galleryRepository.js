import { JsonDatabase } from '../database/jsonDb.js';
const galleryRepository = {
    async findAll() {
        const items = JsonDatabase.find('gallery');
        return items.sort((a, b) => {
            const orderCompare = (a.display_order || 0) - (b.display_order || 0);
            if (orderCompare !== 0)
                return orderCompare;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    },
    async findById(id) {
        return JsonDatabase.findById('gallery', id);
    },
    async create(galleryData) {
        return JsonDatabase.create('gallery', {
            ...galleryData,
            display_order: galleryData.display_order || 0
        });
    },
    async update(id, galleryData) {
        return JsonDatabase.update('gallery', id, galleryData);
    },
    async delete(id) {
        return JsonDatabase.delete('gallery', id);
    },
    async updateDisplayOrder(id, display_order) {
        return JsonDatabase.update('gallery', id, { display_order });
    },
    async reorder(images) {
        for (const img of images) {
            await JsonDatabase.update('gallery', img.id, { display_order: img.display_order });
        }
    }
};
export default galleryRepository;
