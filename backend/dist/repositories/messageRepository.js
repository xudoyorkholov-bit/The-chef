import Message from '../models/Message.js';
const messageRepository = {
    async findAll() {
        return await Message.find().sort({ created_at: -1 });
    },
    async findById(id) {
        return await Message.findById(id);
    },
    async findUnread() {
        return await Message.find({ read: false }).sort({ created_at: -1 });
    },
    async create(messageData) {
        const message = new Message(messageData);
        return await message.save();
    },
    async markAsRead(id) {
        return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    },
    async delete(id) {
        const result = await Message.findByIdAndDelete(id);
        return result !== null;
    }
};
export default messageRepository;
