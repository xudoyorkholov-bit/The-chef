# Design Document - The Chef Restaurant Website

## Overview

The Chef is a full-stack restaurant website built with modern web technologies. The system consists of a React-based frontend with TypeScript for type safety, and a Node.js/Express backend with MongoDB database. The application follows a RESTful API architecture with clear separation between presentation and business logic layers.

The design emphasizes a warm, professional aesthetic with a cream background (#FFF8E7), green accent buttons (#4CAF50), smooth green-to-liver gradient hover effects (linear-gradient from #4CAF50 to #8B4513), black/dark liver brown text (#000000 / #654321), and white cards with soft shadows (box-shadow: 0 2px 8px rgba(0,0,0,0.1)).

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  State Mgmt  │  │  API Client  │      │
│  │  Components  │  │   (Context)  │  │   (Axios)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────┬───────────────────────────┘
                                  │ HTTP/REST
┌─────────────────────────────────┴───────────────────────────┐
│                         Backend API                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Controllers │  │   Services   │      │
│  │   Routes     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                  ┌──────────────┐                           │
│                  │ Repositories │                           │
│                  └──────────────┘                           │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────┐
│                    MongoDB Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  menuitems   │  │ reservations │  │   messages   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    users     │  │   galleries  │  │    orders    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │ testimonials │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Axios for API communication
- CSS Modules for styling
- Vite for build tooling

**Backend:**
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose ODM
- bcrypt for password hashing
- JWT for authentication
- express-validator for input validation
- multer for file uploads

**Development:**
- ESLint and Prettier for code quality
- Jest for unit testing
- fast-check for property-based testing

## Components and Interfaces

### Frontend Components

**Layout Components:**
- `Header`: Navigation bar with logo and menu links
- `Footer`: Contact information and social media links
- `Layout`: Wrapper component with consistent header/footer

**Page Components:**
- `HomePage`: Landing page with hero section and featured items
- `MenuPage`: Display all menu items with filtering
- `GalleryPage`: Image gallery with lightbox
- `ReservationPage`: Reservation form
- `ContactPage`: Contact form
- `AdminDashboard`: Admin panel for content management

**UI Components:**
- `Button`: Reusable button with green styling and gradient hover
- `Card`: White card container with soft shadow
- `Modal`: Overlay dialog for detailed views
- `Form`: Form wrapper with validation display
- `Input`: Styled input fields
- `Loader`: Loading spinner

### Backend API Endpoints

**Menu Endpoints:**
```
GET    /api/menu              - Get all menu items
GET    /api/menu/:id          - Get single menu item
POST   /api/menu              - Create menu item (admin)
PUT    /api/menu/:id          - Update menu item (admin)
DELETE /api/menu/:id          - Delete menu item (admin)
```

**Reservation Endpoints:**
```
GET    /api/reservations      - Get all reservations (admin)
GET    /api/reservations/:id  - Get single reservation
POST   /api/reservations      - Create reservation
PUT    /api/reservations/:id  - Update reservation (admin)
DELETE /api/reservations/:id  - Delete reservation (admin)
```

**Contact Endpoints:**
```
GET    /api/messages          - Get all messages (admin)
POST   /api/messages          - Submit contact form
DELETE /api/messages/:id      - Delete message (admin)
```

**Gallery Endpoints:**
```
GET    /api/gallery           - Get all gallery images
POST   /api/gallery           - Upload image (admin)
DELETE /api/gallery/:id       - Delete image (admin)
```

**Auth Endpoints:**
```
POST   /api/auth/login        - Admin login
POST   /api/auth/logout       - Admin logout
GET    /api/auth/verify       - Verify JWT token
```

**User Profile Endpoints:**
```
GET    /api/users/profile     - Get current user profile
PUT    /api/users/profile     - Update user profile
POST   /api/users/profile/picture - Upload profile picture
DELETE /api/users/profile/picture - Delete profile picture
```

## Data Models

### MenuItem
```typescript
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image_url: string;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Reservation
```typescript
interface Reservation {
  _id: string;
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
```

### ContactMessage
```typescript
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: Date;
}
```

### GalleryImage
```typescript
interface GalleryImage {
  _id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: Date;
}
```

### User
```typescript
interface User {
  _id: string;
  username: string;
  password_hash: string;
  email: string;
  role: 'admin' | 'customer';
  profile_picture_url?: string;
  full_name?: string;
  phone?: string;
  created_at: Date;
  last_login: Date;
}
```

### Order
```typescript
interface Order {
  _id: string;
  user_id: string;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  delivery_address?: string;
  special_instructions?: string;
  created_at: Date;
  updated_at: Date;
}

interface OrderItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}
```

### Testimonial
```typescript
interface Testimonial {
  _id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable properties from the prework analysis, the following consolidations and eliminations have been identified:

**Redundancies to address:**
- Properties 2.4, 4.4, 5.3, 10.1, 10.2, and 10.3 all test round-trip persistence (create/submit → verify in database). These can be consolidated into comprehensive CRUD properties.
- Properties 5.4 and 5.5 test update and delete operations which are part of the same CRUD pattern.
- Properties 6.3 and 6.5 test update and delete for reservations, similar to menu items.
- Properties 2.2, 2.3, 4.2, and 4.3 all test validation and error handling, which can be combined into comprehensive validation properties.
- Properties 1.2 and 6.2 both test that rendered output contains all required fields.

**Consolidated approach:**
- Create comprehensive CRUD properties that test create, read, update, delete operations together
- Create comprehensive validation properties that test both valid and invalid inputs
- Create comprehensive rendering properties that verify all required fields are present

### Correctness Properties

**Property 1: Menu item categorization**
*For any* collection of menu items with various categories, when displayed on the menu page, all items should be grouped by their category field.
**Validates: Requirements 1.1**

**Property 2: Complete field rendering**
*For any* menu item or reservation, when rendered in the UI, the output should contain all required fields (name, description, price, image for menu items; customer details, date, time, party size, status for reservations).
**Validates: Requirements 1.2, 6.2**

**Property 3: Reservation validation**
*For any* reservation data, the validation function should reject submissions with missing required fields (name, email, phone, date, time, party_size) or invalid formats (invalid email, past dates, party size < 1).
**Validates: Requirements 2.2, 2.3**

**Property 4: Reservation persistence round-trip**
*For any* valid reservation data, after submitting to the API and storing in the database, retrieving the reservation should return equivalent data with matching customer details, date, time, and party size.
**Validates: Requirements 2.4, 10.2**

**Property 5: Contact form validation**
*For any* contact form data, the validation function should reject submissions with missing required fields (name, email, subject, message) or invalid email formats.
**Validates: Requirements 4.2, 4.3**

**Property 6: Contact message persistence round-trip**
*For any* valid contact message, after submitting to the API and storing in the database, retrieving the message should return equivalent data with matching name, email, subject, and message content.
**Validates: Requirements 4.4, 10.3**

**Property 7: Menu item CRUD operations**
*For any* menu item, the system should support: (1) creating and retrieving the item with all fields intact, (2) updating any field and retrieving the updated values, (3) deleting the item and confirming it no longer exists in the database.
**Validates: Requirements 5.3, 5.4, 5.5, 10.1**

**Property 8: Reservation sorting**
*For any* collection of reservations with different dates and times, when displayed in the admin dashboard, they should be ordered chronologically by reservation_date and reservation_time.
**Validates: Requirements 6.1**

**Property 9: Reservation status updates**
*For any* reservation, when an administrator updates the status field to a new value ('pending', 'confirmed', or 'cancelled'), retrieving the reservation should reflect the updated status.
**Validates: Requirements 6.3**

**Property 10: Reservation filtering**
*For any* collection of reservations and a search query (date, name, or status), the filter function should return only reservations that match the query criteria.
**Validates: Requirements 6.4**

**Property 11: Reservation deletion**
*For any* reservation, after deleting it through the admin interface, attempting to retrieve that reservation should return a not-found result.
**Validates: Requirements 6.5**

**Property 12: Responsive layout preservation**
*For any* viewport size change (mobile, tablet, desktop), all interactive functionality (forms, buttons, navigation) should remain accessible and operational.
**Validates: Requirements 8.4**

**Property 13: API response structure**
*For any* successful API request for menu items, reservations, or gallery images, the response should be valid JSON containing all required fields for each entity type.
**Validates: Requirements 9.2**

**Property 14: API validation responses**
*For any* API request with invalid data, the system should return an appropriate HTTP error status code (400 for validation errors, 404 for not found, 500 for server errors) and a meaningful error message.
**Validates: Requirements 9.3, 9.4**

**Property 15: Database error handling**
*For any* database operation that fails (connection error, constraint violation, query error), the system should log the error and return an appropriate error response to the client without exposing sensitive database details.
**Validates: Requirements 10.5**

**Property 16: Profile picture upload validation**
*For any* file upload attempt, the system should accept only valid image files (JPEG, PNG, WebP) under 5MB and reject all other files with appropriate error messages.
**Validates: Requirements 11.3, 11.4**

**Property 17: Profile picture persistence**
*For any* valid profile picture upload, after storing the image and updating the user profile, retrieving the user profile should return the correct image URL.
**Validates: Requirements 11.5**

**Property 18: Profile picture deletion**
*For any* user with a profile picture, after deleting the picture, retrieving the user profile should return null or empty for the profile_picture_url field.
**Validates: Requirements 11.7**

## Error Handling

### Frontend Error Handling

**Network Errors:**
- Display user-friendly error messages when API requests fail
- Implement retry logic for transient failures
- Show loading states during async operations
- Provide fallback UI when data cannot be loaded

**Validation Errors:**
- Display inline validation errors on form fields
- Prevent form submission until all errors are resolved
- Highlight invalid fields with red borders
- Show clear, actionable error messages

**Authentication Errors:**
- Redirect to login page when JWT token expires
- Display error messages for invalid credentials
- Clear sensitive data from memory on logout

### Backend Error Handling

**Request Validation:**
- Use express-validator middleware to validate all inputs
- Return 400 Bad Request with detailed validation errors
- Sanitize inputs to prevent XSS attacks
- Validate data types, formats, and constraints

**Database Errors:**
- Catch and log all database errors
- Return 500 Internal Server Error for unexpected failures
- Return 404 Not Found for missing resources
- Handle MongoDB connection errors gracefully
- Implement proper error handling for Mongoose operations

**Authentication Errors:**
- Return 401 Unauthorized for invalid or missing tokens
- Return 403 Forbidden for insufficient permissions
- Hash passwords with bcrypt before storage
- Use secure JWT signing with expiration

**General Error Handling:**
- Implement global error handler middleware
- Log all errors with timestamps and context
- Never expose stack traces or sensitive data to clients
- Return consistent error response format:
```typescript
{
  error: {
    message: string;
    code: string;
    details?: any;
  }
}
```

## Testing Strategy

### Unit Testing

The system will use Jest as the primary unit testing framework for both frontend and backend code. Unit tests will focus on:

**Frontend Unit Tests:**
- Component rendering with various props
- Form validation logic
- State management and context providers
- API client error handling
- Utility functions

**Backend Unit Tests:**
- Controller request/response handling
- Service business logic
- Repository database queries
- Validation middleware
- Authentication and authorization logic

Unit tests will cover specific examples and edge cases:
- Empty inputs and boundary values
- Invalid data formats
- Error conditions and exceptions
- Integration between layers

### Property-Based Testing

The system will use **fast-check** as the property-based testing library for JavaScript/TypeScript. Property-based tests will verify universal properties across randomly generated inputs.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Tests will use custom generators for domain-specific data types
- Each test MUST be tagged with a comment referencing the design document property

**Tag Format:**
```typescript
// Feature: the-chef-restaurant, Property 1: Menu item categorization
```

**Property Test Coverage:**
- CRUD operations (create, read, update, delete) for all entities
- Validation logic for forms and API inputs
- Data transformation and serialization
- Sorting and filtering algorithms
- Round-trip persistence (save → retrieve → verify)

**Example Property Test Structure:**
```typescript
import fc from 'fast-check';

// Feature: the-chef-restaurant, Property 7: Menu item CRUD operations
test('menu item CRUD operations preserve data integrity', () => {
  fc.assert(
    fc.property(
      menuItemArbitrary(), // Custom generator
      async (menuItem) => {
        // Create
        const created = await createMenuItem(menuItem);
        expect(created).toMatchObject(menuItem);
        
        // Read
        const retrieved = await getMenuItem(created.id);
        expect(retrieved).toEqual(created);
        
        // Update
        const updated = await updateMenuItem(created.id, { price: 99.99 });
        expect(updated.price).toBe(99.99);
        
        // Delete
        await deleteMenuItem(created.id);
        await expect(getMenuItem(created.id)).rejects.toThrow();
      }
    ),
    { numRuns: 100 }
  );
});
```

**Custom Generators:**
The test suite will implement custom generators for:
- MenuItem with valid categories, prices, and names
- Reservation with valid dates, times, and party sizes
- ContactMessage with valid email formats
- User credentials for authentication testing

### Integration Testing

Integration tests will verify:
- Frontend-backend API communication
- Database operations with real PostgreSQL instance
- Authentication flow from login to protected routes
- File upload and storage for gallery images

### Test Organization

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── pages/
│   │   │   ├── MenuPage.tsx
│   │   │   └── MenuPage.test.tsx
│   │   └── utils/
│   │       ├── validation.ts
│   │       └── validation.test.ts
│   └── tests/
│       ├── properties/
│       │   ├── menu.property.test.ts
│       │   ├── reservation.property.test.ts
│       │   └── validation.property.test.ts
│       └── integration/
│           └── api.integration.test.ts
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── menuController.ts
    │   │   └── menuController.test.ts
    │   ├── services/
    │   │   ├── menuService.ts
    │   │   └── menuService.test.ts
    │   └── repositories/
    │       ├── menuRepository.ts
    │       └── menuRepository.test.ts
    └── tests/
        ├── properties/
        │   ├── crud.property.test.ts
        │   └── validation.property.test.ts
        └── integration/
            └── database.integration.test.ts
```

## Security Considerations

**Authentication:**
- JWT tokens with 24-hour expiration
- Secure password hashing with bcrypt (10 rounds)
- HTTP-only cookies for token storage
- CSRF protection for state-changing operations

**Input Validation:**
- Server-side validation for all inputs
- Parameterized database queries to prevent SQL injection
- Input sanitization to prevent XSS attacks
- File upload validation (type, size, content)

**Data Protection:**
- HTTPS for all communications in production
- Environment variables for sensitive configuration
- No sensitive data in client-side code or logs
- Regular security updates for dependencies

## Deployment Considerations

**Frontend:**
- Build optimized production bundle with Vite
- Deploy to static hosting (Vercel, Netlify, or CDN)
- Configure environment variables for API endpoints
- Enable gzip compression and caching headers

**Backend:**
- Deploy to Node.js hosting (Heroku, DigitalOcean, AWS, Vercel)
- Configure MongoDB database connection (MongoDB Atlas recommended)
- Set up environment variables for secrets
- Enable CORS for frontend domain
- Configure logging and monitoring

**Database:**
- Use managed MongoDB service (MongoDB Atlas) for reliability
- Configure automated backups
- Set up connection pooling with Mongoose
- Create indexes for frequently queried fields (category, reservation_date, status)

## Performance Optimization

**Frontend:**
- Code splitting for route-based lazy loading
- Image optimization and lazy loading
- Memoization for expensive computations
- Debouncing for search and filter inputs

**Backend:**
- Database query optimization with indexes
- Response caching for frequently accessed data
- Connection pooling with Mongoose
- Pagination for large result sets

**General:**
- CDN for static assets
- Compression for API responses
- Monitoring and profiling for bottlenecks
