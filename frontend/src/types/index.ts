// Data Models
export interface MenuItem {
  id: string;
  name: string;
  name_ru?: string;
  description: string;
  description_ru?: string;
  price: number;
  category: 'food' | 'beverage';
  image_url: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Alias for Message type
export type Message = ContactMessage;

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  full_name?: string;
  profile_picture_url?: string;
  role: 'admin' | 'customer';
  created_at?: string;
  payment_methods?: Array<{
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }>;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

// Request types
export interface CreateReservationRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
}

export interface CreateMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  full_name?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  total: number;
}
