import { MenuItem, CreateMenuItemRequest } from '../types/index.js';
export declare class MenuService {
    /**
     * Get all menu items
     */
    getAllMenuItems(): Promise<MenuItem[]>;
    /**
     * Get menu items by category
     */
    getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
    /**
     * Get a single menu item by ID
     */
    getMenuItemById(id: string): Promise<MenuItem>;
    /**
     * Create a new menu item
     */
    createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem>;
    /**
     * Update a menu item
     */
    updateMenuItem(id: string, data: Partial<CreateMenuItemRequest>): Promise<MenuItem>;
    /**
     * Delete a menu item
     */
    deleteMenuItem(id: string): Promise<void>;
}
declare const _default: MenuService;
export default _default;
//# sourceMappingURL=menuService.d.ts.map