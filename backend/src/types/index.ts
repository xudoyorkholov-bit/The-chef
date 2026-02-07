// Data Models

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'beverage';
  image_url: string;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: Date;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: Date;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: Date;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: 'admin' | 'customer';
  created_at: Date;
  last_login: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  items?: OrderItem[];
  created_at: Date;
  updated_at: Date;
}

// Request/Response types
export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: 'food' | 'beverage';
  image_url: string;
  available?: boolean;
}

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
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: string;
  items: Array<{
    menu_item_id: string;
    menu_item_name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  notes?: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}
