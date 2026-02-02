import MenuItem from '../models/MenuItem';
const menuRepository = {
    async findAll() {
        return await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    },
    async findById(id) {
        return await MenuItem.findById(id);
    },
    async findByCategory(category) {
        return await MenuItem.find({ category, available: true }).sort({ name: 1 });
    },
    async create(menuData) {
        const menuItem = new MenuItem(menuData);
        return await menuItem.save();
    },
    async update(id, menuData) {
        return await MenuItem.findByIdAndUpdate(id, { ...menuData, updated_at: new Date() }, { new: true });
    },
    async delete(id) {
        const result = await MenuItem.findByIdAndDelete(id);
        return result !== null;
    },
    async updateAvailability(id, available) {
        return await MenuItem.findByIdAndUpdate(id, { available, updated_at: new Date() }, { new: true });
    }
};
export default menuRepository;
