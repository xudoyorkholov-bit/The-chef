import { GalleryImage } from '../types/index.js';
export declare class GalleryService {
    getAllImages(): Promise<GalleryImage[]>;
    createImage(data: {
        title: string;
        image_url: string;
        thumbnail_url: string;
        display_order?: number;
    }): Promise<GalleryImage>;
    deleteImage(id: string): Promise<void>;
}
declare const _default: GalleryService;
export default _default;
//# sourceMappingURL=galleryService.d.ts.map