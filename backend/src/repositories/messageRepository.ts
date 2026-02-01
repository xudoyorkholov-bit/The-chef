import Message from '../models/Message';
import { IMessage } from '../models/Message';

const messageRepository = {
  async findAll(): Promise<IMessage[]> {
    return await Message.find().sort({ created_at: -1 });
  },

  async findById(id: string): Promise<IMessage | null> {
    return await Message.findById(id);
  },

  async findUnread(): Promise<IMessage[]> {
    return await Message.find({ read: false }).sort({ created_at: -1 });
  },

  async create(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<IMessage> {
    const message = new Message(messageData);
    return await message.save();
  },

  async markAsRead(id: string): Promise<IMessage | null> {
    return await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    const result = await Message.findByIdAndDelete(id);
    return result !== null;
  }
};

export default messageRepository;
