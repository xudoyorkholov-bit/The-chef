import { ContactMessage, CreateMessageRequest } from '../types/index.js';
export declare class MessageService {
    getAllMessages(): Promise<ContactMessage[]>;
    getMessageById(id: string): Promise<ContactMessage>;
    createMessage(data: CreateMessageRequest): Promise<ContactMessage>;
    markAsRead(id: string): Promise<ContactMessage>;
    deleteMessage(id: string): Promise<void>;
}
declare const _default: MessageService;
export default _default;
//# sourceMappingURL=messageService.d.ts.map