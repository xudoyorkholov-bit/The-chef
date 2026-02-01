import { Request, Response } from 'express';
import menuService from '../services/menuService.js';
import { CreateMenuItemRequest } from '../types/index.js';

export class MenuController {
  /**
   * GET /api/menu - Get all menu items
   */
  async getAllMenuItems(_req: Request, res: Response): Promise<void> {
    try {
      const menuItems = await menuService.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error('Error in getAllMenuItems:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch menu items',
          code: 'INTERNAL_ERROR'
        }
      });
    }
  }

  /**
   * GET /api/menu/:id - Get a single menu item
   */
  async getMenuItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const menuItem = await menuService.getMenuItemById(id);
      res.json(menuItem);
    } catch (error) {
      console.error('Error in getMenuItemById:', error);
      const err = error as Error;
      if (err.message === 'Menu item not found') {
        res.status(404).json({
          error: {
            message: 'Menu item not found',
            code: 'NOT_FOUND'
          }
        });
      } else {
        res.status(500).json({
          error: {
            message: 'Failed to fetch menu item',
            code: 'INTERNAL_ERROR'
          }
        });
      }
    }
  }

  /**
   * POST /api/menu - Create a new menu item (admin only)
   */
  async createMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateMenuItemRequest = req.body;
      const menuItem = await menuService.createMenuItem(data);
      res.status(201).json(menuItem);
    } catch (error) {
      console.error('Error in createMenuItem:', error);
      const err = error as Error;
      res.status(400).json({
        error: {
          message: err.message || 'Failed to create menu item',
          code: 'VALIDATION_ERROR'
        }
      });
    }
  }

  /**
   * PUT /api/menu/:id - Update a menu item (admin only)
   */
  async updateMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<CreateMenuItemRequest> = req.body;
      const menuItem = await menuService.updateMenuItem(id, data);
      res.json(menuItem);
    } catch (error) {
      console.error('Error in updateMenuItem:', error);
      const err = error as Error;
      if (err.message === 'Menu item not found') {
        res.status(404).json({
          error: {
            message: 'Menu item not found',
            code: 'NOT_FOUND'
          }
        });
      } else {
        res.status(400).json({
          error: {
            message: err.message || 'Failed to update menu item',
            code: 'VALIDATION_ERROR'
          }
        });
      }
    }
  }

  /**
   * DELETE /api/menu/:id - Delete a menu item (admin only)
   */
  async deleteMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await menuService.deleteMenuItem(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteMenuItem:', error);
      const err = error as Error;
      if (err.message === 'Menu item not found') {
        res.status(404).json({
          error: {
            message: 'Menu item not found',
            code: 'NOT_FOUND'
          }
        });
      } else {
        res.status(500).json({
          error: {
            message: 'Failed to delete menu item',
            code: 'INTERNAL_ERROR'
          }
        });
      }
    }
  }
}

export default new MenuController();
