import { JsonDatabase } from '../database/jsonDb.js';

interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

const messageRepository = {
  async findAll(): Promise<IMessage[]> {
    const messages = JsonDatabase.find('messages');
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findById(id: string): Promise<IMessage | null> {
    return JsonDatabase.findById('messages', id);
  },

  async findUnread(): Promise<IMessage[]> {
    const messages = JsonDatabase.find('messages', { read: false });
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<IMessage> {
    return JsonDatabase.create('messages', {
      ...messageData,
      read: false
    });
  },

  async markAsRead(id: string): Promise<IMessage | null> {
    return JsonDatabase.update('messages', id, { read: true });
  },

  async delete(id: string): Promise<boolean> {
    return JsonDatabase.delete('messages', id);
  }
};

export default messageRepository;
