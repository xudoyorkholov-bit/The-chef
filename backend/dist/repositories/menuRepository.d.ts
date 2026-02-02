import { IMenuItem } from '../models/MenuItem';
declare const menuRepository: {
    findAll(): Promise<IMenuItem[]>;
    findById(id: string): Promise<IMenuItem | null>;
    findByCategory(category: string): Promise<IMenuItem[]>;
    create(menuData: {
        name: string;
        description: string;
        price: number;
        category: string;
        image_url: string;
        available?: boolean;
    }): Promise<IMenuItem>;
    update(id: string, menuData: Partial<IMenuItem>): Promise<IMenuItem | null>;
    delete(id: string): Promise<boolean>;
    updateAvailability(id: string, available: boolean): Promise<IMenuItem | null>;
};
export default menuRepository;
//# sourceMappingURL=menuRepository.d.ts.map