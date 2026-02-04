import { Request, Response } from 'express';
import userService from '../services/userService.js';
import fs from 'fs';
import path from 'path';

interface AuthRequest extends Request {
  userId?: string;
}

const userController = {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await userService.getProfile(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Don't send password hash to client
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        profile_picture_url: user.profile_picture_url,
        role: user.role,
        payment_methods: user.payment_methods || [],
        created_at: user.createdAt
      };

      res.json(userResponse);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  },

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      
      console.log('📝 Update profile request:', {
        userId,
        body: req.body
      });
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { full_name, phone, password } = req.body;
      
      // Validation: Check if full_name is empty
      if (full_name !== undefined && full_name.trim() === '') {
        console.log('❌ Validation failed: empty full_name');
        res.status(400).json({ error: 'Ism bo\'sh bo\'lishi mumkin emas' });
        return;
      }

      // Validation: Check password length (min 6 characters)
      if (password && password !== '********' && password.length < 6) {
        console.log('❌ Validation failed: password too short');
        res.status(400).json({ error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' });
        return;
      }

      // Validation: Check phone format (basic validation)
      if (phone !== undefined && phone.trim() !== '') {
        // Phone should start with + and contain only digits, spaces, and dashes
        const phoneRegex = /^\+?[\d\s-]+$/;
        if (!phoneRegex.test(phone)) {
          console.log('❌ Validation failed: invalid phone format');
          res.status(400).json({ error: 'Telefon raqam formati noto\'g\'ri' });
          return;
        }
      }
      
      console.log('✅ Validation passed, updating profile...');
      const updatedUser = await userService.updateProfile(userId, {
        full_name,
        phone,
        password
      });

      if (!updatedUser) {
        console.log('❌ User not found');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      console.log('✅ Profile updated successfully');
      const userResponse = {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        phone: updatedUser.phone,
        profile_picture_url: updatedUser.profile_picture_url,
        role: updatedUser.role
      };

      res.json(userResponse);
    } catch (error) {
      console.error('❌ Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },

  async uploadProfilePicture(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized - No user ID found' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      console.log('Uploading profile picture for user:', userId);
      console.log('File details:', {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Validate file
      const validation = userService.validateImageFile(req.file);
      if (!validation.valid) {
        // Delete uploaded file
        fs.unlinkSync(req.file.path);
        res.status(400).json({ error: validation.error });
        return;
      }

      // Get current user to delete old profile picture
      const currentUser = await userService.getProfile(userId);
      if (currentUser?.profile_picture_url) {
        const oldImagePath = path.join(process.cwd(), 'uploads', 'profiles', path.basename(currentUser.profile_picture_url));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Deleted old profile picture:', oldImagePath);
        }
      }

      // Save new profile picture URL
      const imageUrl = `/uploads/profiles/${req.file.filename}`;
      const updatedUser = await userService.updateProfilePicture(userId, imageUrl);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      console.log('Profile picture uploaded successfully:', imageUrl);
      res.json({
        message: 'Profile picture uploaded successfully',
        profile_picture_url: imageUrl
      });
    } catch (error) {
      console.error('Upload profile picture error:', error);
      res.status(500).json({ error: 'Failed to upload profile picture' });
    }
  },

  async deleteProfilePicture(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized - No user ID found' });
        return;
      }

      console.log('Deleting profile picture for user:', userId);

      // Get current user to delete profile picture file
      const currentUser = await userService.getProfile(userId);
      if (currentUser?.profile_picture_url) {
        const imagePath = path.join(process.cwd(), 'uploads', 'profiles', path.basename(currentUser.profile_picture_url));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Deleted profile picture file:', imagePath);
        }
      }

      const updatedUser = await userService.deleteProfilePicture(userId);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      console.log('Profile picture deleted successfully');
      res.json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
      console.error('Delete profile picture error:', error);
      res.status(500).json({ error: 'Failed to delete profile picture' });
    }
  },

  async addPaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id, cardNumber, cardHolder, expiryDate, isDefault } = req.body;

      if (!id || !cardNumber || !cardHolder || !expiryDate) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const updatedUser = await userService.addPaymentMethod(userId, {
        id,
        cardNumber,
        cardHolder,
        expiryDate,
        isDefault: isDefault || false
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: 'Payment method added successfully',
        payment_methods: updatedUser.payment_methods
      });
    } catch (error) {
      console.error('Add payment method error:', error);
      res.status(500).json({ error: 'Failed to add payment method' });
    }
  },

  async updatePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { cardId } = req.params;
      const { isDefault } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const updatedUser = await userService.updatePaymentMethod(userId, cardId, isDefault);

      if (!updatedUser) {
        res.status(404).json({ error: 'User or payment method not found' });
        return;
      }

      res.json({
        message: 'Payment method updated successfully',
        payment_methods: updatedUser.payment_methods
      });
    } catch (error) {
      console.error('Update payment method error:', error);
      res.status(500).json({ error: 'Failed to update payment method' });
    }
  },

  async deletePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { cardId } = req.params;
      
      console.log('Delete payment method - userId:', userId, 'cardId:', cardId);
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user to see current payment methods
      const currentUser = await userService.getProfile(userId);
      console.log('Current payment methods:', JSON.stringify(currentUser?.payment_methods, null, 2));

      const updatedUser = await userService.deletePaymentMethod(userId, cardId);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      console.log('Updated payment methods:', JSON.stringify(updatedUser.payment_methods, null, 2));

      res.json({
        message: 'Payment method deleted successfully',
        payment_methods: updatedUser.payment_methods
      });
    } catch (error) {
      console.error('Delete payment method error:', error);
      res.status(500).json({ error: 'Failed to delete payment method' });
    }
  }
};

export default userController;
