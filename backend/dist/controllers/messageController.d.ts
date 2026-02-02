import { Request, Response } from 'express';
export declare class MessageController {
    getAllMessages(_req: Request, res: Response): Promise<void>;
    createMessage(req: Request, res: Response): Promise<void>;
    deleteMessage(req: Request, res: Response): Promise<void>;
}
declare const _default: MessageController;
export default _default;
//# sourceMappingURL=messageController.d.ts.map