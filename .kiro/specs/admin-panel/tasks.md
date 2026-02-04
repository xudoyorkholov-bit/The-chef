# Admin Panel Implementation Tasks

- [ ] 1. Setup admin environment and authentication
  - Environment variables da admin credentials qo'shish
  - Backend middleware yaratish (requireAdmin)
  - Frontend AdminRoute component yaratish
  - _Requirements: 1.1, 1.3_

- [ ] 1.1 Add admin credentials to environment variables
  - backend/.env fayliga ADMIN_PHONE va ADMIN_PASSWORD qo'shish
  - _Requirements: 1.1_

- [ ] 1.2 Update authService to detect admin registration
  - Register funksiyasida admin credentials tekshirish
  - Admin bo'lsa role='admin' qilish
  - _Requirements: 1.1_

- [ ] 1.3 Create requireAdmin middleware
  - backend/src/middleware/adminAuth.ts yaratish
  - User rolini tekshirish
  - _Requirements: 1.3_

- [ ] 1.4 Update AuthContext to redirect based on role
  - Login va register da user rolini tekshirish
  - Admin bo'lsa /admin/dashboard ga yo'naltirish
  - Customer bo'lsa / ga yo'naltirish
  - _Requirements: 1.2, 1.4_

- [ ] 1.5 Create AdminRoute component
  - frontend/src/components/AdminRoute.tsx yaratish
  - Admin rolini tekshirish va redirect qilish
  - _Requirements: 1.3_

- [ ] 1.6 Write property test for admin access control
  - **Property 1: Admin Access Control**
  - **Validates: Requirements 1.3**

- [ ] 2. Create admin layout and navigation
  - AdminLayout component yaratish
  - AdminSidebar component yaratish
  - Admin routes qo'shish (App.tsx)
  - _Requirements: 1.2, 8.1_

- [ ] 2.1 Create AdminLayout component
  - frontend/src/components/admin/AdminLayout.tsx yaratish
  - Sidebar va top bar qo'shish
  - Logout va "Asosiy saytga qaytish" tugmalari
  - _Requirements: 8.1, 8.2_

- [ ] 2.2 Create AdminSidebar component
  - frontend/src/components/admin/AdminSidebar.tsx yaratish
  - Navigation links (Dashboard, Menu, Orders, Reservations, Messages, Gallery)
  - Active link highlighting
  - _Requirements: 1.2_

- [ ] 2.3 Add admin routes to App.tsx
  - /admin/dashboard route qo'shish
  - /admin/menu route qo'shish
  - /admin/orders route qo'shish
  - /admin/reservations route qo'shish
  - /admin/messages route qo'shish
  - /admin/gallery route qo'shish
  - _Requirements: 1.2_

- [ ] 2.4 Create admin CSS files
  - AdminLayout.css yaratish
  - AdminSidebar.css yaratish
  - _Requirements: 1.2_

- [ ] 3. Implement admin dashboard
  - AdminDashboard page yaratish
  - Dashboard statistics API yaratish
  - StatCard component yaratish
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.1 Create adminController and adminService
  - backend/src/controllers/adminController.ts yaratish
  - backend/src/services/adminService.ts yaratish
  - getDashboardStats funksiyasi
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.2 Create admin API routes
  - backend/src/routes/adminRoutes.ts yaratish
  - GET /api/admin/dashboard/stats endpoint
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.3 Create admin API client
  - frontend/src/api/admin.ts yaratish
  - getDashboardStats funksiyasi
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.4 Create StatCard component
  - frontend/src/components/admin/StatCard.tsx yaratish
  - StatCard.css yaratish
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.5 Create AdminDashboard page
  - frontend/src/pages/admin/AdminDashboard.tsx yaratish
  - Dashboard statistics ko'rsatish
  - AdminDashboard.css yaratish
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.6 Write property test for dashboard statistics
  - **Property 4: Dashboard Statistics Accuracy**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ] 4. Implement menu management
  - AdminMenu page yaratish
  - Menu CRUD API endpoints yaratish
  - MenuItemForm component yaratish
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4.1 Add admin menu endpoints to backend
  - POST /api/admin/menu endpoint (create)
  - PUT /api/admin/menu/:id endpoint (update)
  - DELETE /api/admin/menu/:id endpoint (delete)
  - adminController da funksiyalar yaratish
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ] 4.2 Create menu API client functions
  - frontend/src/api/admin.ts ga qo'shish
  - createMenuItem, updateMenuItem, deleteMenuItem
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ] 4.3 Create MenuItemForm component
  - frontend/src/components/admin/MenuItemForm.tsx yaratish
  - Form validation
  - Image upload support
  - MenuItemForm.css yaratish
  - _Requirements: 3.2, 3.4_

- [ ] 4.4 Create AdminMenu page
  - frontend/src/pages/admin/AdminMenu.tsx yaratish
  - Menu items ro'yxati
  - Add, Edit, Delete funksiyalari
  - AdminMenu.css yaratish
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4.5 Write property test for menu CRUD operations
  - **Property 5: Menu Item CRUD Operations**
  - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

- [ ] 5. Implement order management
  - AdminOrders page yaratish
  - Order status update API yaratish
  - OrderStatusBadge component yaratish
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5.1 Add admin order endpoints to backend
  - GET /api/admin/orders endpoint (with filters)
  - GET /api/admin/orders/:id endpoint (details)
  - PUT /api/admin/orders/:id/status endpoint (update status)
  - adminController da funksiyalar yaratish
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5.2 Create order API client functions
  - frontend/src/api/admin.ts ga qo'shish
  - getOrders, getOrderDetails, updateOrderStatus
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.3 Create OrderStatusBadge component
  - frontend/src/components/admin/OrderStatusBadge.tsx yaratish
  - Status ranglar (pending, confirmed, preparing, ready, delivered, cancelled)
  - OrderStatusBadge.css yaratish
  - _Requirements: 4.1, 4.3_

- [ ] 5.4 Create AdminOrders page
  - frontend/src/pages/admin/AdminOrders.tsx yaratish
  - Orders ro'yxati
  - Status filter
  - Order details modal
  - Status update funksiyasi
  - AdminOrders.css yaratish
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5.5 Write property test for order status updates
  - **Property 6: Order Status Update Persistence**
  - **Validates: Requirements 4.3**

- [ ] 6. Implement reservation management
  - AdminReservations page yaratish
  - Reservation confirm/cancel API yaratish
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6.1 Add admin reservation endpoints to backend
  - GET /api/admin/reservations endpoint
  - PUT /api/admin/reservations/:id/confirm endpoint
  - PUT /api/admin/reservations/:id/cancel endpoint
  - adminController da funksiyalar yaratish
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6.2 Create reservation API client functions
  - frontend/src/api/admin.ts ga qo'shish
  - getReservations, confirmReservation, cancelReservation
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6.3 Create AdminReservations page
  - frontend/src/pages/admin/AdminReservations.tsx yaratish
  - Reservations ro'yxati
  - Confirm va Cancel tugmalari
  - Reservation details
  - AdminReservations.css yaratish
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6.4 Write property test for reservation status updates
  - **Property 7: Reservation Status Update**
  - **Validates: Requirements 5.2, 5.3**

- [ ] 7. Implement message management
  - AdminMessages page yaratish
  - Message read/delete API yaratish
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 7.1 Add admin message endpoints to backend
  - GET /api/admin/messages endpoint
  - PUT /api/admin/messages/:id/read endpoint
  - DELETE /api/admin/messages/:id endpoint
  - adminController da funksiyalar yaratish
  - _Requirements: 6.1, 6.3, 6.4_

- [ ] 7.2 Create message API client functions
  - frontend/src/api/admin.ts ga qo'shish
  - getMessages, markMessageAsRead, deleteMessage
  - _Requirements: 6.1, 6.3, 6.4_

- [ ] 7.3 Create AdminMessages page
  - frontend/src/pages/admin/AdminMessages.tsx yaratish
  - Messages ro'yxati
  - Message details modal
  - Mark as read va Delete funksiyalari
  - AdminMessages.css yaratish
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 7.4 Write property test for message read status
  - **Property 8: Message Read Status**
  - **Validates: Requirements 6.3**

- [ ] 8. Implement gallery management
  - AdminGallery page yaratish
  - Image upload/delete API yaratish
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8.1 Add admin gallery endpoints to backend
  - POST /api/admin/gallery endpoint (upload)
  - DELETE /api/admin/gallery/:id endpoint (delete)
  - adminController da funksiyalar yaratish
  - Multer configuration for image upload
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 8.2 Create gallery API client functions
  - frontend/src/api/admin.ts ga qo'shish
  - uploadGalleryImage, deleteGalleryImage
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 8.3 Create AdminGallery page
  - frontend/src/pages/admin/AdminGallery.tsx yaratish
  - Gallery images grid
  - Upload button va form
  - Delete funksiyasi
  - AdminGallery.css yaratish
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8.4 Write property test for gallery image upload
  - **Property 9: Gallery Image Upload**
  - **Validates: Requirements 7.3**

- [ ] 9. Final integration and testing
  - Barcha admin routes ni App.tsx ga qo'shish
  - Admin panel navigation testlash
  - Logout va "Asosiy saytga qaytish" funksiyalarini testlash
  - _Requirements: 8.1, 8.2_

- [ ] 9.1 Register admin routes in server.ts
  - backend/src/server.ts ga adminRoutes import qilish
  - /api/admin prefix bilan qo'shish
  - _Requirements: 1.2_

- [ ] 9.2 Test admin authentication flow
  - Admin credentials bilan register qilish
  - Admin dashboard ga avtomatik redirect
  - Non-admin foydalanuvchi admin panelga kira olmasligini tekshirish
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 9.3 Test all admin features
  - Dashboard statistics
  - Menu CRUD operations
  - Order status updates
  - Reservation confirm/cancel
  - Message read/delete
  - Gallery upload/delete
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
