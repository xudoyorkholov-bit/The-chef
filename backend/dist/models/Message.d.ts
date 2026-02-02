import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    created_at: Date;
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export default _default;
//# sourceMappingURL=Message.d.ts.map