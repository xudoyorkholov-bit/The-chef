import { IGallery } from '../models/Gallery';
declare const galleryRepository: {
    findAll(): Promise<IGallery[]>;
    findById(id: string): Promise<IGallery | null>;
    create(galleryData: {
        title: string;
        image_url: string;
        thumbnail_url: string;
        display_order?: number;
    }): Promise<IGallery>;
    update(id: string, galleryData: Partial<IGallery>): Promise<IGallery | null>;
    delete(id: string): Promise<boolean>;
    updateDisplayOrder(id: string, display_order: number): Promise<IGallery | null>;
};
export default galleryRepository;
//# sourceMappingURL=galleryRepository.d.ts.map