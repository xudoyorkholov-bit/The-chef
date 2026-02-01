import MenuItem from '../models/MenuItem';
import { IMenuItem } from '../models/MenuItem';

const menuRepository = {
  async findAll(): Promise<IMenuItem[]> {
    return await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
  },

  async findById(id: string): Promise<IMenuItem | null> {
    return await MenuItem.findById(id);
  },

  async findByCategory(category: string): Promise<IMenuItem[]> {
    return await MenuItem.find({ category, available: true }).sort({ name: 1 });
  },

  async create(menuData: {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    available?: boolean;
  }): Promise<IMenuItem> {
    const menuItem = new MenuItem(menuData);
    return await menuItem.save();
  },

  async update(id: string, menuData: Partial<IMenuItem>): Promise<IMenuItem | null> {
    return await MenuItem.findByIdAndUpdate(
      id,
      { ...menuData, updated_at: new Date() },
      { new: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    const result = await MenuItem.findByIdAndDelete(id);
    return result !== null;
  },

  async updateAvailability(id: string, available: boolean): Promise<IMenuItem | null> {
    return await MenuItem.findByIdAndUpdate(
      id,
      { available, updated_at: new Date() },
      { new: true }
    );
  }
};

export default menuRepository;
