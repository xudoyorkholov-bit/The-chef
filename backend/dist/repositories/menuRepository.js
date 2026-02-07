import { JsonDatabase } from '../database/jsonDb.js';
const menuRepository = {
    async findAll() {
        const items = JsonDatabase.find('menuItems', {});
        return items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    },
    async findById(id) {
        return JsonDatabase.findById('menuItems', id);
    },
    async findByCategory(category) {
        const items = JsonDatabase.find('menuItems', { category });
        return items.sort((a, b) => a.name.localeCompare(b.name));
    },
    async create(menuData) {
        return JsonDatabase.create('menuItems', {
            ...menuData,
            available: menuData.available !== false
        });
    },
    async update(id, menuData) {
        return JsonDatabase.update('menuItems', id, menuData);
    },
    async delete(id) {
        return JsonDatabase.delete('menuItems', id);
    },
    async updateAvailability(id, available) {
        return JsonDatabase.update('menuItems', id, { available });
    }
};
export default menuRepository;
