import { JsonDatabase } from '../database/jsonDb.js';
const messageRepository = {
    async findAll() {
        const messages = JsonDatabase.find('messages');
        return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async findById(id) {
        return JsonDatabase.findById('messages', id);
    },
    async findUnread() {
        const messages = JsonDatabase.find('messages', { read: false });
        return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async create(messageData) {
        return JsonDatabase.create('messages', {
            ...messageData,
            read: false
        });
    },
    async markAsRead(id) {
        return JsonDatabase.update('messages', id, { read: true });
    },
    async delete(id) {
        return JsonDatabase.delete('messages', id);
    }
};
export default messageRepository;
