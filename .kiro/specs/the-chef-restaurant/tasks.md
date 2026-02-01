# Implementation Plan

- [ ] 1. Set up project structure and development environment
  - Create frontend directory with React + TypeScript + Vite setup
  - Create backend directory with Node.js + Express + TypeScript setup
  - Configure ESLint, Prettier, and TypeScript configs for both projects
  - Set up package.json with all required dependencies
  - Create .env.example files for environment variables
  - _Requirements: 9.1, 10.4_

- [ ] 2. Set up database schema and connection
  - Create MongoDB database connection with Mongoose
  - Define Mongoose schemas for MenuItem, Reservation, Message, Gallery, User, Order, and Testimonial models
  - Implement database connection utility with connection pooling
  - Create seed script for initial data
  - Add indexes for frequently queried fields (category, reservation_date, status)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 9.5_

- [ ] 3. Implement data models and validation utilities
  - Create TypeScript interfaces for MenuItem, Reservation, ContactMessage, GalleryImage, User, Order, and Testimonial
  - Define Mongoose schemas with validation rules
  - Implement validation functions for email format, date validation, and required fields
  - Create input sanitization utilities to prevent XSS and NoSQL injection
  - _Requirements: 2.2, 2.3, 4.2, 4.3, 9.5_

- [ ] 3.1 Write property test for validation logic
  - **Property 3: Reservation validation**
  - **Property 5: Contact form validation**
  - **Validates: Requirements 2.2, 2.3, 4.2, 4.3**

- [ ] 4. Implement menu repository and service layer
  - Create menuRepository with CRUD operations using Mongoose models
  - Implement menuService with business logic for menu management
  - Add error handling for database operations
  - _Requirements: 1.1, 1.2, 1.4, 5.2, 5.3, 5.4, 5.5, 9.5, 10.1_

- [ ] 4.1 Write property test for menu CRUD operations
  - **Property 7: Menu item CRUD operations**
  - **Validates: Requirements 5.3, 5.4, 5.5, 10.1**

- [ ] 5. Implement menu API endpoints
  - Create Express routes for GET /api/menu, GET /api/menu/:id, POST /api/menu, PUT /api/menu/:id, DELETE /api/menu/:id
  - Implement menuController with request validation using express-validator
  - Add authentication middleware for admin-only endpoints (POST, PUT, DELETE)
  - Return proper HTTP status codes (200, 201, 400, 404, 500)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 5.1 Write property test for API response structure
  - **Property 13: API response structure**
  - **Validates: Requirements 9.2**

- [ ] 5.2 Write property test for API validation responses
  - **Property 14: API validation responses**
  - **Validates: Requirements 9.3, 9.4**

- [ ] 6. Implement reservation repository and service layer
  - Create reservationRepository with CRUD operations
  - Implement reservationService with validation and business logic
  - Add sorting by date and time functionality
  - Add filtering by date, name, and status
  - _Requirements: 2.1, 2.2, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5, 10.2_

- [ ] 6.1 Write property test for reservation persistence
  - **Property 4: Reservation persistence round-trip**
  - **Validates: Requirements 2.4, 10.2**

- [ ] 6.2 Write property test for reservation sorting
  - **Property 8: Reservation sorting**
  - **Validates: Requirements 6.1**

- [ ] 6.3 Write property test for reservation filtering
  - **Property 10: Reservation filtering**
  - **Validates: Requirements 6.4**

- [ ] 7. Implement reservation API endpoints
  - Create Express routes for GET /api/reservations, GET /api/reservations/:id, POST /api/reservations, PUT /api/reservations/:id, DELETE /api/reservations/:id
  - Implement reservationController with validation
  - Add authentication middleware for admin endpoints
  - Send confirmation response on successful reservation creation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4, 6.5, 9.1, 9.2, 9.3, 9.4_

- [ ] 7.1 Write property test for reservation status updates
  - **Property 9: Reservation status updates**
  - **Validates: Requirements 6.3**

- [ ] 7.2 Write property test for reservation deletion
  - **Property 11: Reservation deletion**
  - **Validates: Requirements 6.5**

- [ ] 8. Implement contact message repository and service layer
  - Create messageRepository with create and read operations
  - Implement messageService with validation logic
  - Add functionality to mark messages as read
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 10.3_

- [ ] 8.1 Write property test for contact message persistence
  - **Property 6: Contact message persistence round-trip**
  - **Validates: Requirements 4.4, 10.3**

- [ ] 9. Implement contact message API endpoints
  - Create Express routes for GET /api/messages, POST /api/messages, DELETE /api/messages/:id
  - Implement messageController with validation
  - Add authentication middleware for admin endpoints
  - Return success confirmation on message submission
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4_

- [ ] 10. Implement authentication system
  - Create userRepository with login credential verification
  - Implement authService with bcrypt password hashing and JWT token generation
  - Create authentication middleware to verify JWT tokens
  - Implement authorization middleware to check admin role
  - _Requirements: 5.1, 9.1_

- [ ] 11. Implement authentication API endpoints
  - Create Express routes for POST /api/auth/login, POST /api/auth/logout, GET /api/auth/verify
  - Implement authController with credential validation
  - Set HTTP-only cookies for JWT tokens
  - Return appropriate error messages for invalid credentials
  - _Requirements: 5.1_

- [ ] 12. Implement gallery repository and service layer
  - Create galleryRepository with CRUD operations
  - Implement galleryService with image upload handling
  - Add sorting by display_order
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 13. Implement gallery API endpoints
  - Create Express routes for GET /api/gallery, POST /api/gallery, DELETE /api/gallery/:id
  - Implement galleryController with file upload validation
  - Add authentication middleware for admin endpoints
  - Validate image file types and sizes
  - _Requirements: 3.1, 3.2, 3.3, 9.1, 9.2_

- [ ] 14. Implement global error handling middleware
  - Create error handler middleware to catch all errors
  - Log errors with timestamps and context
  - Return consistent error response format
  - Prevent exposure of stack traces and sensitive data
  - _Requirements: 9.4, 10.5_

- [ ] 14.1 Write property test for database error handling
  - **Property 15: Database error handling**
  - **Validates: Requirements 10.5**

- [ ] 15. Set up frontend project structure and routing
  - Create React app with TypeScript and Vite
  - Set up React Router with routes for home, menu, gallery, reservations, contact, and admin
  - Create Layout component with Header and Footer
  - Configure CSS with cream background (#FFF8E7) and color variables
  - _Requirements: 7.1, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 16. Implement reusable UI components
  - Create Button component with green styling (#4CAF50) and green-to-liver gradient hover effect
  - Create Card component with white background and soft shadow (box-shadow: 0 2px 8px rgba(0,0,0,0.1))
  - Create Input component with validation error display
  - Create Modal component for detailed views
  - Create Loader component for loading states
  - _Requirements: 7.2, 7.3, 7.5_

- [ ] 17. Implement API client utility
  - Create Axios instance with base URL configuration
  - Implement error interceptor for network errors
  - Add request interceptor for JWT token attachment
  - Create typed API functions for all endpoints
  - _Requirements: 1.4, 2.4, 3.3, 4.4, 9.2_

- [ ] 18. Implement MenuPage component
  - Create MenuPage with category filtering UI
  - Fetch menu items from GET /api/menu endpoint
  - Display menu items in Card components grouped by category
  - Show dish name, description, price, and image for each item
  - Implement Modal for detailed menu item view
  - Add loading state with Loader component
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 18.1 Write property test for menu item categorization
  - **Property 1: Menu item categorization**
  - **Validates: Requirements 1.1**

- [ ] 18.2 Write property test for complete field rendering
  - **Property 2: Complete field rendering**
  - **Validates: Requirements 1.2, 6.2**

- [ ] 19. Implement ReservationPage component
  - Create reservation form with fields for name, email, phone, date, time, and party_size
  - Implement client-side validation for required fields and formats
  - Display inline validation errors with red borders
  - Submit reservation to POST /api/reservations endpoint
  - Show success confirmation message on successful submission
  - Show error messages on validation or submission failures
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 20. Implement GalleryPage component
  - Create GalleryPage with image grid layout
  - Fetch gallery images from GET /api/gallery endpoint
  - Display images in Card components with thumbnails
  - Implement Modal with full-size image view and navigation controls
  - Add loading indicators with Loader component
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 21. Implement ContactPage component
  - Create contact form with fields for name, email, subject, and message
  - Implement client-side validation for required fields and email format
  - Display inline validation errors
  - Submit message to POST /api/messages endpoint
  - Show success confirmation on successful submission
  - Show error messages on validation or submission failures
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 22. Implement admin authentication flow
  - Create LoginPage with username and password fields
  - Submit credentials to POST /api/auth/login endpoint
  - Store JWT token in HTTP-only cookie
  - Implement ProtectedRoute component to guard admin routes
  - Redirect to login page when token is invalid or expired
  - _Requirements: 5.1_

- [ ] 23. Implement AdminDashboard for menu management
  - Create admin menu management page with list of all menu items
  - Add create, edit, and delete buttons for each menu item
  - Implement forms for creating and updating menu items
  - Call POST /api/menu, PUT /api/menu/:id, DELETE /api/menu/:id endpoints
  - Show success/error messages for operations
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 24. Implement AdminDashboard for reservation management
  - Create admin reservations page with list sorted by date and time
  - Display customer details, date, time, party size, and status for each reservation
  - Add search/filter functionality by date, name, and status
  - Implement status update functionality
  - Add delete button for reservations
  - Call GET /api/reservations, PUT /api/reservations/:id, DELETE /api/reservations/:id endpoints
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 25. Implement AdminDashboard for message management
  - Create admin messages page with list of all contact messages
  - Display message details with read/unread status
  - Add delete button for messages
  - Call GET /api/messages, DELETE /api/messages/:id endpoints
  - _Requirements: 4.1_

- [ ] 26. Implement AdminDashboard for gallery management
  - Create admin gallery page with list of all images
  - Add image upload functionality with file validation
  - Add delete button for images
  - Call POST /api/gallery, DELETE /api/gallery/:id endpoints
  - _Requirements: 3.1_

- [ ] 27. Implement responsive design for all pages
  - Add CSS media queries for mobile (< 768px), tablet (768px - 1024px), and desktop (> 1024px)
  - Test layout adaptation on different screen sizes
  - Ensure all forms, buttons, and navigation remain functional on all devices
  - Preserve cream, green, and liver color scheme across all breakpoints
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 27.1 Write property test for responsive layout preservation
  - **Property 12: Responsive layout preservation**
  - **Validates: Requirements 8.4**

- [ ] 28. Implement HomePage with hero section
  - Create HomePage with hero section featuring restaurant name and tagline
  - Add featured menu items section
  - Add call-to-action buttons for reservations and menu
  - Apply cream background and green button styling
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 29. Implement Header and Footer components
  - Create Header with navigation links to all pages
  - Add logo and restaurant name to Header
  - Create Footer with contact information and social media links
  - Apply consistent styling with color scheme
  - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [ ] 30. Set up testing infrastructure
  - Configure Jest for both frontend and backend
  - Install and configure fast-check for property-based testing
  - Create custom generators for MenuItem, Reservation, ContactMessage, GalleryImage, Order, and Testimonial
  - Set up test database for integration tests (MongoDB Memory Server)
  - _Requirements: All_

- [ ] 31. Implement user profile picture upload functionality
  - Add profile_picture_url field to users table in database schema
  - Create file upload middleware with multer for image handling
  - Implement userRepository methods for updating profile picture URL
  - Create userService with image validation logic (file type, size limits)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 31.1 Write property test for profile picture upload validation
  - **Property 16: Profile picture upload validation**
  - **Validates: Requirements 11.3, 11.4**

- [ ] 31.2 Write property test for profile picture persistence
  - **Property 17: Profile picture persistence**
  - **Validates: Requirements 11.5**

- [ ] 32. Implement user profile API endpoints
  - Create Express routes for GET /api/users/profile, PUT /api/users/profile, POST /api/users/profile/picture, DELETE /api/users/profile/picture
  - Implement userController with authentication middleware
  - Add file upload handling for profile picture endpoint
  - Validate image file types (JPEG, PNG, WebP) and size (max 5MB)
  - Store uploaded images in public/uploads/profiles directory
  - Return appropriate error messages for invalid uploads
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7_

- [ ] 32.1 Write property test for profile picture deletion
  - **Property 18: Profile picture deletion**
  - **Validates: Requirements 11.7**

- [ ] 33. Implement profile picture UI in ProfilePage
  - Add file input for profile picture upload in personal info modal
  - Display current profile picture or default avatar in profile header
  - Add click handler to open file selection dialog
  - Implement client-side validation for file type and size
  - Show upload progress indicator during upload
  - Display success/error messages using Toast component
  - Add delete button for removing profile picture
  - Update profile picture display in Header component
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 34. Final integration and testing checkpoint
  - Ensure all tests pass, ask the user if questions arise
  - Verify all API endpoints work correctly with frontend
  - Test authentication flow end-to-end
  - Verify responsive design on multiple devices
  - Check error handling for all edge cases
  - _Requirements: All_
