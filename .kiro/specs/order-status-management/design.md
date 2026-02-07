# Design Document: Order Status Management

## Overview

Bu dizayn hujjat buyurtma holati boshqaruvi tizimini tavsiflab beradi. Tizim foydalanuvchilarga buyurtma holatini real vaqtda ko'rish va administratorlarga buyurtma holatini boshqarish imkoniyatini beradi. Mavjud backend va frontend arxitekturasiga integratsiya qilinadi.

## Architecture

Tizim uch qatlamli arxitekturadan foydalanadi:

1. **Backend Layer**: MongoDB ma'lumotlar bazasi bilan ishlaydi, buyurtma holatini saqlaydi va yangilaydi
2. **API Layer**: RESTful API orqali frontend bilan aloqa qiladi
3. **Frontend Layer**: React komponentlari orqali foydalanuvchi va admin interfeyslarini taqdim etadi

### Status Flow

```
Yangi buyurtma → pending (kutilmoqda)
                    ↓
Admin tasdiqlaydi → confirmed (qabul qilindi)
                    ↓
Tayyorlanmoqda → preparing (tayyorlanmoqda) [optional]
                    ↓
Tayyor → ready (tayyor) [optional]
                    ↓
Yetkazilmoqda → delivering (yo'lda)
                    ↓
Yetkazildi → completed (yetib keldi)

Istalgan vaqtda → cancelled (bekor qilindi)
```

## Components and Interfaces

### Backend Components

#### 1. Order Model (Mavjud - Yangilanadi)
- **Location**: `backend/src/models/Order.ts`
- **Changes**: Status enum qiymatlari allaqachon to'g'ri
- **Status Values**: 
  - `pending` - Kutilmoqda
  - `confirmed` - Qabul qilindi  
  - `preparing` - Tayyorlanmoqda
  - `ready` - Tayyor
  - `completed` - Yetib keldi
  - `cancelled` - Bekor qilindi

#### 2. Order Controller (Mavjud - Yangilanadi)
- **Location**: `backend/src/controllers/orderController.ts`
- **New Method**: `updateOrderStatus(orderId, newStatus)`
- **Validation**: Status qiymatlarini tekshirish

#### 3. Order Service (Mavjud - Yangilanadi)
- **Location**: `backend/src/services/orderService.ts`
- **New Method**: `updateStatus(orderId, newStatus)`
- **Business Logic**: Status o'zgarishini boshqarish

#### 4. Order Repository (Mavjud - Yangilanadi)
- **Location**: `backend/src/repositories/orderRepository.ts`
- **New Method**: `updateStatus(orderId, newStatus)`
- **Database Operation**: MongoDB'da status yangilash

### Frontend Components

#### 1. AdminOrders Component (Mavjud - Tuzatiladi)
- **Location**: `frontend/src/pages/admin/AdminOrders.tsx`
- **Current Issues**:
  - Status mapping noto'g'ri (`delivering` o'rniga `ready` ishlatilishi kerak)
  - Dropdown options backend bilan mos kelmaydi
- **Fixes Needed**:
  - Status mapping to'g'rilash
  - Dropdown options yangilash
  - Filter buttons yangilash

#### 2. OrdersPage Component (Mavjud - Tuzatiladi)
- **Location**: `frontend/src/pages/OrdersPage.tsx`
- **Current Issues**:
  - `ready` status uchun tarjima yo'q
  - Status mapping to'liq emas
- **Fixes Needed**:
  - Barcha statuslar uchun tarjima qo'shish
  - Status display to'g'rilash

#### 3. Orders API (Mavjud - Yangilanadi)
- **Location**: `frontend/src/api/orders.ts`
- **Current**: `updateStatus` metodi mavjud
- **Verification**: API chaqiruvi to'g'ri ishlashini tekshirish

## Data Models

### Order Interface (Mavjud)

```typescript
interface IOrder {
  id: string;
  user_id?: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Status Mapping

**Backend → Frontend Mapping:**
- `pending` → "Kutilmoqda" (uz) / "Ожидается" (ru)
- `confirmed` → "Qabul qilindi" (uz) / "Подтверждено" (ru)
- `preparing` → "Tayyorlanmoqda" (uz) / "Готовится" (ru)
- `ready` → "Tayyor" (uz) / "Готово" (ru)
- `completed` → "Yetib keldi" (uz) / "Доставлено" (ru)
- `cancelled` → "Bekor qilindi" (uz) / "Отменено" (ru)

### Status Colors

```typescript
const statusColors = {
  pending: '#f59e0b',    // Orange
  confirmed: '#3b82f6',  // Blue
  preparing: '#8b5cf6',  // Purple
  ready: '#10b981',      // Green
  completed: '#10b981',  // Green
  cancelled: '#ef4444'   // Red
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: New orders default to pending status
*For any* newly created order, the initial status should be set to "pending"
**Validates: Requirements 1.1**

### Property 2: Status updates persist correctly
*For any* order and valid status value, when an admin updates the status, querying the order should return the updated status
**Validates: Requirements 2.1, 2.2**

### Property 3: Only valid statuses are accepted
*For any* status update request, the system should only accept status values from the defined enum: pending, confirmed, preparing, ready, completed, cancelled
**Validates: Requirements 2.5**

### Property 4: Status display matches database value
*For any* order displayed to a user, the status text shown should correspond to the current status value in the database
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 5: Status colors are consistent
*For any* status value, the color displayed should match the defined color mapping
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

### Property 6: Filter counts are accurate
*For any* status filter, the count displayed should equal the number of orders with that status
**Validates: Requirements 4.4**

## Error Handling

### Backend Error Scenarios

1. **Invalid Status Value**
   - Error: 400 Bad Request
   - Message: "Invalid status value"
   - Action: Return error to client

2. **Order Not Found**
   - Error: 404 Not Found
   - Message: "Order not found"
   - Action: Return error to client

3. **Database Error**
   - Error: 500 Internal Server Error
   - Message: "Failed to update order status"
   - Action: Log error, return generic message

### Frontend Error Handling

1. **API Request Failure**
   - Action: Display error toast
   - Message: "Status yangilashda xatolik"
   - Fallback: Refresh orders list

2. **Network Error**
   - Action: Display error toast
   - Message: "Tarmoq xatosi"
   - Fallback: Retry mechanism

## Testing Strategy

### Unit Tests

1. **Backend Tests**
   - Test status validation logic
   - Test database update operations
   - Test error handling scenarios

2. **Frontend Tests**
   - Test status display mapping
   - Test color mapping
   - Test filter functionality
   - Test status update UI interaction

### Integration Tests

1. **API Integration**
   - Test complete status update flow
   - Test order retrieval with correct status
   - Test concurrent status updates

2. **UI Integration**
   - Test admin status change reflects in user view
   - Test filter updates after status change
   - Test real-time status synchronization

### Manual Testing Checklist

1. Create new order → Verify status is "kutilmoqda"
2. Admin changes to "qabul qilindi" → Verify user sees "qabul qilindi"
3. Admin changes to "yo'lda" → Verify user sees "yo'lda"
4. Admin changes to "yetib keldi" → Verify user sees "yetib keldi"
5. Admin changes to "bekor qilindi" → Verify user sees "bekor qilindi"
6. Verify all status colors display correctly
7. Verify filter counts are accurate
8. Verify filter functionality works correctly

## Implementation Notes

### Key Changes Required

1. **AdminOrders.tsx**
   - Fix status mapping (remove `delivering`, ensure all 6 statuses)
   - Update dropdown options to match backend
   - Fix filter buttons to use correct status values
   - Update `getStatusText` function

2. **OrdersPage.tsx**
   - Add missing status translations (`ready`, `preparing`)
   - Ensure status mapping is complete
   - Update `getStatusText` function

3. **Backend (Minimal Changes)**
   - Verify `updateStatus` endpoint works correctly
   - Ensure status validation is in place
   - Confirm all 6 status values are supported

### Database Considerations

- No schema changes required
- Existing orders may have old status values - migration not needed as enum already supports all values
- `updated_at` field automatically updates on status change

### Performance Considerations

- Status updates are lightweight operations
- No caching needed for status values
- Real-time updates achieved through page refresh (polling or WebSocket can be added later)

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live status updates
2. **Status History**: Track all status changes with timestamps
3. **Notifications**: Push notifications when status changes
4. **Status Restrictions**: Prevent invalid status transitions (e.g., completed → pending)
5. **Bulk Operations**: Update multiple order statuses at once
