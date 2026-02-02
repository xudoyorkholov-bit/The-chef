import { Request, Response } from 'express';
export declare class GalleryController {
    getAllImages(_req: Request, res: Response): Promise<void>;
    createImage(req: Request, res: Response): Promise<void>;
    deleteImage(req: Request, res: Response): Promise<void>;
}
declare const _default: GalleryController;
export default _default;
//# sourceMappingURL=galleryController.d.ts.map