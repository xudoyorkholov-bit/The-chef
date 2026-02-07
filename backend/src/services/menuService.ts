import menuRepository from '../repositories/menuRepository.js';
import { MenuItem, CreateMenuItemRequest } from '../types/index.js';
import { sanitizeString } from '../utils/validation.js';

export class MenuService {
  /**
   * Get all menu items
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      return await menuRepository.findAll();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const validCategories = ['food', 'beverage'];
      if (!validCategories.includes(category)) {
        throw new Error('Invalid category');
      }
      return await menuRepository.findByCategory(category);
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
  }

  /**
   * Get a single menu item by ID
   */
  async getMenuItemById(id: string): Promise<MenuItem> {
    try {
      const menuItem = await menuRepository.findById(id);
      if (!menuItem) {
        throw new Error('Menu item not found');
      }
      return menuItem;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    try {
      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        throw new Error('Missing required fields');
      }

      // Validate price
      if (data.price < 0) {
        throw new Error('Price must be non-negative');
      }

      // Validate category
      const validCategories = ['food', 'beverage'];
      if (!validCategories.includes(data.category)) {
        throw new Error('Invalid category');
      }

      // Sanitize string inputs
      const sanitizedData: CreateMenuItemRequest = {
        name: sanitizeString(data.name),
        description: sanitizeString(data.description),
        price: data.price,
        category: data.category,
        image_url: data.image_url || '',
        available: data.available ?? true
      };

      return await menuRepository.create(sanitizedData);
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }

  /**
   * Update a menu item
   */
  async updateMenuItem(id: string, data: Partial<CreateMenuItemRequest>): Promise<MenuItem> {
    try {
      // Check if menu item exists
      const existingItem = await menuRepository.findById(id);
      if (!existingItem) {
        throw new Error('Menu item not found');
      }

      // Validate price if provided
      if (data.price !== undefined && data.price < 0) {
        throw new Error('Price must be non-negative');
      }

      // Validate category if provided
      if (data.category) {
        const validCategories = ['food', 'beverage'];
        if (!validCategories.includes(data.category)) {
          throw new Error('Invalid category');
        }
      }

      // Sanitize string inputs
      const sanitizedData: Partial<CreateMenuItemRequest> = {};
      if (data.name) sanitizedData.name = sanitizeString(data.name);
      if (data.description) sanitizedData.description = sanitizeString(data.description);
      if (data.price !== undefined) sanitizedData.price = data.price;
      if (data.category) sanitizedData.category = data.category;
      if (data.image_url !== undefined) sanitizedData.image_url = data.image_url;
      if (data.available !== undefined) sanitizedData.available = data.available;

      const updated = await menuRepository.update(id, sanitizedData);
      if (!updated) {
        throw new Error('Failed to update menu item');
      }
      return updated;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: string): Promise<void> {
    try {
      const deleted = await menuRepository.delete(id);
      if (!deleted) {
        throw new Error('Menu item not found');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
}

export default new MenuService();
