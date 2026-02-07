import messageService from '../services/messageService.js';
export class MessageController {
    async getAllMessages(_req, res) {
        try {
            const messages = await messageService.getAllMessages();
            res.json(messages);
        }
        catch (error) {
            console.error('Error in getAllMessages:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to fetch messages',
                    code: 'INTERNAL_ERROR'
                }
            });
        }
    }
    async createMessage(req, res) {
        try {
            const data = req.body;
            const message = await messageService.createMessage(data);
            res.status(201).json(message);
        }
        catch (error) {
            console.error('Error in createMessage:', error);
            const err = error;
            res.status(400).json({
                error: {
                    message: err.message || 'Failed to create message',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
    }
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            await messageService.deleteMessage(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error in deleteMessage:', error);
            const err = error;
            if (err.message === 'Message not found') {
                res.status(404).json({
                    error: {
                        message: 'Message not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Failed to delete message',
                        code: 'INTERNAL_ERROR'
                    }
                });
            }
        }
    }
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await messageService.markAsRead(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error in markAsRead:', error);
            const err = error;
            if (err.message === 'Message not found') {
                res.status(404).json({
                    error: {
                        message: 'Message not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Failed to mark message as read',
                        code: 'INTERNAL_ERROR'
                    }
                });
            }
        }
    }
}
export default new MessageController();
