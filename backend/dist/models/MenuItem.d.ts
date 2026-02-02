import mongoose, { Document } from 'mongoose';
export interface IMenuItem extends Document {
    name: string;
    name_ru?: string;
    description: string;
    description_ru?: string;
    price: number;
    category: 'appetizer' | 'main' | 'dessert' | 'beverage';
    image_url: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IMenuItem, {}, {}, {}, mongoose.Document<unknown, {}, IMenuItem, {}, mongoose.DefaultSchemaOptions> & IMenuItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMenuItem>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map