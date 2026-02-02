import mongoose, { Document } from 'mongoose';
export interface IGallery extends Document {
    title: string;
    image_url: string;
    thumbnail_url: string;
    display_order: number;
    created_at: Date;
}
declare const _default: mongoose.Model<IGallery, {}, {}, {}, mongoose.Document<unknown, {}, IGallery, {}, mongoose.DefaultSchemaOptions> & IGallery & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGallery>;
export default _default;
//# sourceMappingURL=Gallery.d.ts.map