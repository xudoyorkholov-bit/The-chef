import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import { User, RegisterRequest } from '../types/index.js';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  async register(data: RegisterRequest): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByUsername(data.username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const existingEmail = await userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // Hash password
      const password_hash = await this.hashPassword(data.password);

      // Create user
      const user = await userRepository.create({
        username: data.username,
        email: data.email,
        password_hash,
        phone: data.phone,
        full_name: data.full_name,
        role: 'customer'
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      // Convert Mongoose document to plain object
      const userObj = user.toObject ? user.toObject() : user;
      const { password_hash: _, ...userWithoutPassword } = userObj;

      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    try {
      const user = await userRepository.findByUsername(username);
      
      if (!user) {
        throw new Error('Telefon raqam yoki parol noto\'g\'ri');
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Telefon raqam yoki parol noto\'g\'ri');
      }

      await userRepository.updateLastLogin(user.id);

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      // Convert Mongoose document to plain object
      const userObj = user.toObject ? user.toObject() : user;
      const { password_hash, ...userWithoutPassword } = userObj;

      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  verifyToken(token: string): { id: string; username: string; role: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string; username: string; role: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return null;
      }
      // Convert Mongoose document to plain object
      const userObj = user.toObject ? user.toObject() : user;
      const { password_hash, ...userWithoutPassword } = userObj;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}

export default new AuthService();
