# Admin Panel Design Document

## Overview

Admin panel - bu restoran administratorlari uchun maxsus interfeys bo'lib, menyu, buyurtmalar, rezervatsiyalar, xabarlar va galereyani boshqarish imkonini beradi. Tizim maxsus yashirin kirish mexanizmi orqali himoyalangan bo'lib, oddiy foydalanuvchilar admin panelni topa olmaydi.

### Key Features
- Yashirin admin kirish tizimi (maxsus telefon raqam va parol)
- Dashboard bilan statistika ko'rish
- Menyu mahsulotlarini CRUD operatsiyalari
- Buyurtmalarni boshqarish va holat o'zgartirish
- Rezervatsiyalarni tasdiqlash/rad etish
- Xabarlarni ko'rish va boshqarish
- Galereyani boshqarish

## Architecture

### Frontend Architecture
```
frontend/src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx      # Asosiy dashboard
│       ├── AdminMenu.tsx           # Menyu boshqaruv
│       ├── AdminOrders.tsx         # Buyurtmalar
│       ├── AdminReservations.tsx   # Rezervatsiyalar
│       ├── AdminMessages.tsx       # Xabarlar
│       └── AdminGallery.tsx        # Galereya
├── components/
│   └── admin/
│       ├── AdminLayout.tsx         # Admin layout
│       ├── AdminSidebar.tsx        # Sidebar navigatsiya
│       ├── StatCard.tsx            # Statistika kartochkasi
│       ├── MenuItemForm.tsx        # Menyu form
│       └── OrderStatusBadge.tsx    # Buyurtma holat badge
└── api/
    └── admin.ts                    # Admin API calls
```

### Backend Architecture
```
backend/src/
├── controllers/
│   └── adminController.ts          # Admin operatsiyalari
├── services/
│   └── adminService.ts             # Admin biznes logikasi
├── middleware/
│   └── adminAuth.ts                # Admin autentifikatsiya
└── routes/
    └── adminRoutes.ts              # Admin API routes
```

## Components and Interfaces

### 1. Secret Admin Access System

**Admin Credentials (Environment Variables)**
```typescript
// backend/.env
ADMIN_PHONE=+998901234567
ADMIN_PASSWORD=SecureAdminPass123!
```

**Registration Logic**
```typescript
// backend/src/services/authService.ts
async register(data: RegisterRequest): Promise<AuthResponse> {
  const isAdmin = 
    data.username === process.env.ADMIN_PHONE && 
    data.password === process.env.ADMIN_PASSWORD;
  
  const role = isAdmin ? 'admin' : 'customer';
  
  // Create user with appropriate role
  const user = await userRepository.create({
    ...data,
    role
  });
  
  return { user, token };
}
```

**Login Redirect Logic**
```typescript
// frontend/src/context/AuthContext.tsx
const login = async (credentials: LoginRequest) => {
  const response = await authApi.login(credentials);
  setUser(response.user);
  
  // Redirect based on role
  if (response.user.role === 'admin') {
    navigate('/admin/dashboard');
  } else {
    navigate('/');
  }
};
```

### 2. Admin Dashboard

**Dashboard Statistics Interface**
```typescript
interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalReservations: number;
  pendingReservations: number;
  totalMessages: number;
  unreadMessages: number;
  totalMenuItems: number;
  totalRevenue: number;
}
```

**API Endpoint**
```typescript
// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', authenticate, requireAdmin, adminController.getDashboardStats);
```

### 3. Menu Management

**Menu Item Form Interface**
```typescript
interface MenuItemFormData {
  name: string;
  name_en: string;
  name_ru: string;
  description: string;
  description_en: string;
  description_ru: string;
  price: number;
  category: 'main' | 'appetizer' | 'soup' | 'dessert' | 'beverage';
  image_url: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  preparation_time: number;
  calories: number;
  allergens: string[];
}
```

**API Endpoints**
```typescript
// POST /api/admin/menu - Create menu item
// PUT /api/admin/menu/:id - Update menu item
// DELETE /api/admin/menu/:id - Delete menu item
```

### 4. Order Management

**Order Status Update Interface**
```typescript
interface OrderStatusUpdate {
  order_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}
```

**API Endpoints**
```typescript
// GET /api/admin/orders - Get all orders with filters
// GET /api/admin/orders/:id - Get order details
// PUT /api/admin/orders/:id/status - Update order status
```

### 5. Reservation Management

**API Endpoints**
```typescript
// GET /api/admin/reservations - Get all reservations
// PUT /api/admin/reservations/:id/confirm - Confirm reservation
// PUT /api/admin/reservations/:id/cancel - Cancel reservation
```

### 6. Message Management

**API Endpoints**
```typescript
// GET /api/admin/messages - Get all messages
// PUT /api/admin/messages/:id/read - Mark as read
// DELETE /api/admin/messages/:id - Delete message
```

### 7. Gallery Management

**API Endpoints**
```typescript
// POST /api/admin/gallery - Upload image
// DELETE /api/admin/gallery/:id - Delete image
```

## Data Models

### Admin User
```typescript
interface AdminUser extends User {
  role: 'admin';
  // Admin foydalanuvchi oddiy User modelidan meros oladi
  // Faqat role maydoni 'admin' qiymatiga ega
}
```

### Dashboard Stats
```typescript
interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
  };
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  menu: {
    total: number;
    available: number;
    unavailable: number;
  };
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Admin Access Control
*For any* user attempting to access admin panel, if the user's role is not 'admin', then the system should redirect them to the home page
**Validates: Requirements 1.3**

### Property 2: Admin Auto-Redirect on Login
*For any* user with admin role logging in, the system should automatically redirect them to the admin dashboard
**Validates: Requirements 1.2**

### Property 3: Secret Admin Registration
*For any* registration attempt with the exact admin phone and password from environment variables, the system should create a user with 'admin' role
**Validates: Requirements 1.1**

### Property 4: Dashboard Statistics Accuracy
*For any* dashboard stats request, the returned counts should match the actual database counts for orders, reservations, messages, and menu items
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Menu Item CRUD Operations
*For any* menu item creation, update, or deletion by admin, the changes should be immediately reflected in the database and visible to all users
**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

### Property 6: Order Status Update Persistence
*For any* order status update by admin, the new status should be saved to the database and visible to the order owner
**Validates: Requirements 4.3**

### Property 7: Reservation Status Update
*For any* reservation confirmation or cancellation by admin, the status should be updated in the database
**Validates: Requirements 5.2, 5.3**

### Property 8: Message Read Status
*For any* message marked as read by admin, the read status should persist in the database
**Validates: Requirements 6.3**

### Property 9: Gallery Image Upload
*For any* image uploaded by admin, the image should be saved to the server and the URL should be stored in the database
**Validates: Requirements 7.3**

### Property 10: Admin Panel Invisibility
*For any* non-admin user, no UI elements or navigation links to admin panel should be visible
**Validates: Requirements 1.4**

## Error Handling

### Authentication Errors
- Invalid admin credentials → Show error message
- Non-admin trying to access admin panel → Redirect to home
- Expired token → Redirect to login

### Validation Errors
- Invalid menu item data → Show validation errors
- Invalid order status → Show error message
- Invalid file upload → Show file type/size error

### Server Errors
- Database connection error → Show retry option
- File upload error → Show error and allow retry
- Network error → Show offline message

## Testing Strategy

### Unit Tests
- Admin authentication middleware
- Admin service methods
- Dashboard statistics calculation
- Menu CRUD operations
- Order status updates

### Integration Tests
- Admin login flow
- Menu item creation flow
- Order management flow
- Image upload flow

### Property-Based Tests
- Test admin access control with random user roles
- Test dashboard stats with random database states
- Test menu CRUD with random menu item data
- Test order status updates with random statuses

## Security Considerations

### Admin Credentials
- Admin telefon raqam va parol environment variables da saqlanadi
- Hech qachon frontend kodida yoki API response da ko'rinmaydi
- Faqat backend registration/login paytida tekshiriladi

### Route Protection
- Barcha admin routes `authenticate` va `requireAdmin` middleware bilan himoyalangan
- Frontend da `ProtectedRoute` component admin rolini tekshiradi
- Non-admin foydalanuvchilar admin panelga kirish imkoniyatiga ega emas

### Data Validation
- Barcha admin input lar backend da validatsiya qilinadi
- File upload lar type va size bo'yicha cheklangan
- SQL injection va XSS hujumlaridan himoyalangan

## UI/UX Design

### Admin Layout
- Sidebar navigatsiya (Dashboard, Menu, Orders, Reservations, Messages, Gallery)
- Top bar (Admin nomi, Logout, Asosiy saytga qaytish)
- Responsive design (mobile va desktop)

### Color Scheme
- Primary: #2563eb (Blue)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Danger: #ef4444 (Red)
- Background: #f9fafb (Light Gray)

### Components
- StatCard: Statistika ko'rsatish uchun
- DataTable: Ro'yxatlarni ko'rsatish uchun
- Modal: Form va tasdiqlash uchun
- Badge: Status ko'rsatish uchun
- Button: Actionlar uchun

## Implementation Notes

### Environment Variables
```env
# Admin credentials (backend/.env)
ADMIN_PHONE=+998901234567
ADMIN_PASSWORD=SecureAdminPass123!
```

### Middleware
```typescript
// backend/src/middleware/adminAuth.ts
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### Frontend Route Protection
```typescript
// frontend/src/components/AdminRoute.tsx
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
```
