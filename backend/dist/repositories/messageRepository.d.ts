import { IMessage } from '../models/Message';
declare const messageRepository: {
    findAll(): Promise<IMessage[]>;
    findById(id: string): Promise<IMessage | null>;
    findUnread(): Promise<IMessage[]>;
    create(messageData: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<IMessage>;
    markAsRead(id: string): Promise<IMessage | null>;
    delete(id: string): Promise<boolean>;
};
export default messageRepository;
//# sourceMappingURL=messageRepository.d.ts.map