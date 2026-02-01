import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { CreateOrderRequest } from '../types';

export const orderController = {
  // Foydalanuvchining buyurtmalarini olish
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      // Agar foydalanuvchi tizimga kirgan bo'lsa, faqat uning buyurtmalarini ko'rsatamiz
      const orders = userId 
        ? await orderService.getUserOrders(userId)
        : await orderService.getAllOrders();
      
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        error: {
          message: 'Buyurtmalarni yuklashda xatolik',
          code: 'FETCH_ORDERS_ERROR'
        }
      });
    }
  },

  // ID bo'yicha buyurtmani olish
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const order = await orderService.getOrderById(id, userId);
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Buyurtma topilmadi') {
          res.status(404).json({
            error: {
              message: error.message,
              code: 'ORDER_NOT_FOUND'
            }
          });
          return;
        }
        
        if (error.message === 'Ruxsat yo\'q') {
          res.status(403).json({
            error: {
              message: error.message,
              code: 'ACCESS_DENIED'
            }
          });
          return;
        }
      }
      
      res.status(500).json({
        error: {
          message: 'Buyurtmani yuklashda xatolik',
          code: 'FETCH_ORDER_ERROR'
        }
      });
    }
  },

  // Yangi buyurtma yaratish
  async create(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderRequest = req.body;
      const userId = (req as any).user?.id;
      
      console.log('=== ORDER CREATE REQUEST ===');
      console.log('Received order data:', JSON.stringify(orderData, null, 2));
      console.log('User ID:', userId);
      console.log('Request headers:', req.headers);
      
      // Validatsiya
      if (!orderData.items || orderData.items.length === 0) {
        console.log('Validation failed: No items in order');
        res.status(400).json({
          error: {
            message: 'Buyurtmada kamida bitta mahsulot bo\'lishi kerak',
            code: 'INVALID_ORDER_DATA'
          }
        });
        return;
      }
      
      if (!orderData.total || orderData.total <= 0) {
        console.log('Validation failed: Invalid total');
        res.status(400).json({
          error: {
            message: 'Buyurtma summasi noto\'g\'ri',
            code: 'INVALID_ORDER_TOTAL'
          }
        });
        return;
      }
      
      console.log('Validation passed, creating order...');
      const order = await orderService.createOrder(orderData, userId);
      console.log('Order created successfully:', order);
      res.status(201).json(order);
    } catch (error) {
      console.error('=== ORDER CREATE ERROR ===');
      console.error('Error creating order:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      res.status(500).json({
        error: {
          message: 'Buyurtma yaratishda xatolik',
          code: 'CREATE_ORDER_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  },

  // Buyurtma statusini yangilash
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = (req as any).user?.id;
      
      if (!status) {
        res.status(400).json({
          error: {
            message: 'Status ko\'rsatilmagan',
            code: 'MISSING_STATUS'
          }
        });
        return;
      }
      
      const order = await orderService.updateOrderStatus(id, status, userId);
      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Buyurtma topilmadi') {
          res.status(404).json({
            error: {
              message: error.message,
              code: 'ORDER_NOT_FOUND'
            }
          });
          return;
        }
        
        if (error.message === 'Noto\'g\'ri status') {
          res.status(400).json({
            error: {
              message: error.message,
              code: 'INVALID_STATUS'
            }
          });
          return;
        }

        if (error.message === 'Ruxsat yo\'q') {
          res.status(403).json({
            error: {
              message: error.message,
              code: 'ACCESS_DENIED'
            }
          });
          return;
        }
      }
      
      res.status(500).json({
        error: {
          message: 'Buyurtma statusini yangilashda xatolik',
          code: 'UPDATE_ORDER_STATUS_ERROR'
        }
      });
    }
  },

  // Buyurtmani o'chirish
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      await orderService.deleteOrder(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting order:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Buyurtma topilmadi') {
          res.status(404).json({
            error: {
              message: error.message,
              code: 'ORDER_NOT_FOUND'
            }
          });
          return;
        }

        if (error.message === 'Ruxsat yo\'q') {
          res.status(403).json({
            error: {
              message: error.message,
              code: 'ACCESS_DENIED'
            }
          });
          return;
        }
      }
      
      res.status(500).json({
        error: {
          message: 'Buyurtmani o\'chirishda xatolik',
          code: 'DELETE_ORDER_ERROR'
        }
      });
    }
  }
};
