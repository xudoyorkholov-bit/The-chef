import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';

// JSON Database uchun User interface
interface IUser {
  _id: string;
  username: string;
  password_hash: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: 'admin' | 'customer';
  profile_picture_url?: string;
  payment_methods?: Array<{
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }>;
  last_login?: Date;
  createdAt: string;
  updatedAt: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  full_name?: string;
}

export class AuthService {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

  async register(data: RegisterRequest): Promise<{ token: string; user: Omit<IUser, 'password_hash'> }> {
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
        { id: user._id.toString(), username: user.username, role: user.role },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Remove password_hash from response
      const { password_hash: _, ...userWithoutPassword } = user;

      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<{ token: string; user: Omit<IUser, 'password_hash'> }> {
    try {
      const user = await userRepository.findByUsername(username);
      
      if (!user) {
        throw new Error('Telefon raqam yoki parol noto\'g\'ri');
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Telefon raqam yoki parol noto\'g\'ri');
      }

      await userRepository.updateLastLogin(user._id.toString());

      const token = jwt.sign(
        { id: user._id.toString(), username: user.username, role: user.role },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;

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

  async getUserById(id: string): Promise<Omit<IUser, 'password_hash'> | null> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return null;
      }
      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;
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
