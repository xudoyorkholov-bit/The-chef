import messageRepository from '../repositories/messageRepository.js';
import { ContactMessage, CreateMessageRequest } from '../types/index.js';
import { validateMessageData, sanitizeString } from '../utils/validation.js';

export class MessageService {
  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      return await messageRepository.findAll();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  async getMessageById(id: string): Promise<ContactMessage> {
    try {
      const message = await messageRepository.findById(id);
      if (!message) {
        throw new Error('Message not found');
      }
      return message;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  async createMessage(data: CreateMessageRequest): Promise<ContactMessage> {
    try {
      const validation = validateMessageData(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      const sanitizedData: CreateMessageRequest = {
        name: sanitizeString(data.name),
        email: data.email,
        subject: sanitizeString(data.subject),
        message: sanitizeString(data.message)
      };

      return await messageRepository.create(sanitizedData);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    try {
      const message = await messageRepository.markAsRead(id);
      if (!message) {
        throw new Error('Message not found');
      }
      return message;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      const deleted = await messageRepository.delete(id);
      if (!deleted) {
        throw new Error('Message not found');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export default new MessageService();
