import { JsonDatabase } from '../database/jsonDb.js';

interface IMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const menuRepository = {
  async findAll(): Promise<IMenuItem[]> {
    const items = JsonDatabase.find('menuItems', {});
    return items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  },

  async findById(id: string): Promise<IMenuItem | null> {
    return JsonDatabase.findById('menuItems', id);
  },

  async findByCategory(category: string): Promise<IMenuItem[]> {
    const items = JsonDatabase.find('menuItems', { category });
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  async create(menuData: {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    available?: boolean;
  }): Promise<IMenuItem> {
    return JsonDatabase.create('menuItems', {
      ...menuData,
      available: menuData.available !== false
    });
  },

  async update(id: string, menuData: Partial<IMenuItem>): Promise<IMenuItem | null> {
    return JsonDatabase.update('menuItems', id, menuData);
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('menuItems', id);
  },

  async updateAvailability(id: string, available: boolean): Promise<IMenuItem | null> {
    return JsonDatabase.update('menuItems', id, { available });
  }
};

export default menuRepository;
