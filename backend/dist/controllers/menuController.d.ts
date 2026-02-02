import { Request, Response } from 'express';
export declare class MenuController {
    /**
     * GET /api/menu - Get all menu items
     */
    getAllMenuItems(_req: Request, res: Response): Promise<void>;
    /**
     * GET /api/menu/:id - Get a single menu item
     */
    getMenuItemById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/menu - Create a new menu item (admin only)
     */
    createMenuItem(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/menu/:id - Update a menu item (admin only)
     */
    updateMenuItem(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/menu/:id - Delete a menu item (admin only)
     */
    deleteMenuItem(req: Request, res: Response): Promise<void>;
}
declare const _default: MenuController;
export default _default;
//# sourceMappingURL=menuController.d.ts.map