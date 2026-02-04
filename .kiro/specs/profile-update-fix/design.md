# Design Document

## Overview

Profil yangilash funksiyasida kritik muammo mavjud: foydalanuvchi profil ma'lumotlarini (ism, telefon, parol) yangilaganda, o'zgarishlar backend ma'lumotlar bazasiga to'liq saqlanmayapti. Asosiy muammo - `userService.updateProfile` funksiyasi parol yangilashni qo'llab-quvvatlamaydi va parol xeshlash mexanizmi yo'q.

Bu dizayn hujjat quyidagi yechimlarni taqdim etadi:
- Backend service va repository qatlamlarida parol yangilash qo'llab-quvvatlash
- Parol xeshlash mexanizmini qo'shish
- Frontend va backend o'rtasida to'g'ri ma'lumot uzatish
- Validatsiya va xatoliklarni boshqarish

## Architecture

### Current Architecture Issues

1. **userService.updateProfile** - faqat `full_name` va `phone` qabul qiladi, `password` yo'q
2. **userRepository.updateProfile** - parol yangilashni qo'llab-quvvatlamaydi
3. **userController.updateProfile** - parolni qabul qiladi lekin xeshlamaydi
4. **Frontend ProfilePage** - parolni yuboradi lekin backend uni qayta ishlamaydi

### Proposed Architecture

```
Frontend (ProfilePage)
    ↓ (HTTP PUT /api/users/profile)
    ↓ { full_name, phone, password? }
    ↓
Controller (userController.updateProfile)
    ↓ Validate input
    ↓ Check if password needs hashing
    ↓
Service (userService.updateProfile)
    ↓ Hash password if provided
    ↓ Prepare update data
    ↓
Repository (userRepository.updateProfile)
    ↓ Update database
    ↓ Return updated user
    ↓
Database (db.json)
```

## Components and Interfaces

### 1. Backend Service Layer

**File:** `backend/src/services/userService.ts`

**Changes:**
- `updateProfile` funksiyasiga `password` parametrini qo'shish
- Parol xeshlash logikasini qo'shish
- `authService.hashPassword` metodidan foydalanish

**Interface:**
```typescript
interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  password?: string;
}

async updateProfile(userId: string, data: UpdateProfileData): Promise<IUser | null>
```

### 2. Backend Repository Layer

**File:** `backend/src/repositories/userRepository.ts`

**Changes:**
- `updateProfile` funksiyasiga `password_hash` parametrini qo'shish
- Parol yangilashni qo'llab-quvvatlash

**Interface:**
```typescript
interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  password_hash?: string;
}

async updateProfile(id: string, data: UpdateProfileData): Promise<IUser | null>
```

### 3. Backend Controller Layer

**File:** `backend/src/controllers/userController.ts`

**Changes:**
- Request body'dan `password` ni qabul qilish
- Parolni service layer'ga uzatish
- Validatsiya qo'shish

### 4. Frontend ProfilePage

**File:** `frontend/src/pages/ProfilePage.tsx`

**Current Implementation:** To'g'ri ishlayapti - parolni yuboradi va "********" ni tekshiradi

**No changes needed** - frontend allaqachon to'g'ri ishlayapti

## Data Models

### User Model

**File:** `backend/src/models/User.ts`

```typescript
interface IUser {
  _id: string;
  username: string;
  password_hash: string;  // Xeshlangan parol
  email: string;
  phone?: string;
  full_name?: string;
  role: 'admin' | 'customer';
  profile_picture_url?: string;
  payment_methods?: Array<PaymentMethod>;
  last_login?: Date;
  createdAt: string;
  updatedAt: string;
}
```

### Update Profile Request

```typescript
interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  password?: string;  // Oddiy matn (xeshlanmagan)
}
```

### Update Profile Response

```typescript
interface UpdateProfileResponse {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  profile_picture_url?: string;
  role: string;
  // password_hash qaytarilmaydi (xavfsizlik)
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Password Hashing Consistency
*For any* user profile update request containing a password, the system SHALL hash the password using bcrypt before storing it in the database, and the stored password_hash SHALL be verifiable against the original password using bcrypt.compare.

**Validates: Requirements 3.1, 5.1**

### Property 2: Profile Update Persistence
*For any* user profile update (name, phone, or password), after the update completes successfully, querying the user profile SHALL return the updated values.

**Validates: Requirements 1.1, 2.1, 3.1**

### Property 3: Masked Password Preservation
*For any* profile update request where the password field equals "********", the system SHALL NOT modify the existing password_hash in the database.

**Validates: Requirements 3.3**

### Property 4: Authentication with Updated Credentials
*For any* user who updates their password, logging out and then logging in with the new password SHALL succeed, and logging in with the old password SHALL fail.

**Validates: Requirements 3.2, 3.5**

### Property 5: Partial Update Support
*For any* profile update request containing only a subset of fields (e.g., only full_name), the system SHALL update only the specified fields and leave other fields unchanged.

**Validates: Requirements 4.2**

### Property 6: Password Validation
*For any* profile update request with a password shorter than 6 characters, the system SHALL reject the request with a validation error.

**Validates: Requirements 3.4**

### Property 7: Empty Field Rejection
*For any* profile update request with an empty full_name field, the system SHALL reject the request with a validation error.

**Validates: Requirements 1.3**

### Property 8: Phone Format Validation
*For any* profile update request with an invalid phone format, the system SHALL reject the request with a validation error.

**Validates: Requirements 2.3**

## Error Handling

### Validation Errors

1. **Empty Name**
   - Status: 400 Bad Request
   - Message: "Ism bo'sh bo'lishi mumkin emas"

2. **Invalid Phone Format**
   - Status: 400 Bad Request
   - Message: "Telefon raqam formati noto'g'ri"

3. **Short Password**
   - Status: 400 Bad Request
   - Message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak"

### Database Errors

1. **User Not Found**
   - Status: 404 Not Found
   - Message: "Foydalanuvchi topilmadi"

2. **Update Failed**
   - Status: 500 Internal Server Error
   - Message: "Profilni yangilashda xatolik yuz berdi"

### Authentication Errors

1. **Unauthorized**
   - Status: 401 Unauthorized
   - Message: "Autentifikatsiya talab qilinadi"

## Testing Strategy

### Unit Tests

1. **userService.updateProfile**
   - Test updating only full_name
   - Test updating only phone
   - Test updating only password
   - Test updating all fields together
   - Test password hashing
   - Test masked password ("********") handling

2. **userRepository.updateProfile**
   - Test database update with full_name
   - Test database update with phone
   - Test database update with password_hash
   - Test partial updates

3. **userController.updateProfile**
   - Test request validation
   - Test successful update response
   - Test error responses

### Integration Tests

1. **Full Profile Update Flow**
   - Register user → Update profile → Logout → Login with new credentials
   - Update password → Verify old password fails → Verify new password succeeds

2. **Partial Update Flow**
   - Update only name → Verify other fields unchanged
   - Update only phone → Verify other fields unchanged

### Property-Based Tests

Property-based tests will be implemented using a suitable testing library for TypeScript/JavaScript (e.g., fast-check). Each test should run a minimum of 100 iterations.

1. **Property 1: Password Hashing Consistency**
   - Generate random passwords
   - Hash them
   - Verify bcrypt.compare returns true

2. **Property 2: Profile Update Persistence**
   - Generate random user data
   - Update profile
   - Verify data persists

3. **Property 3: Masked Password Preservation**
   - Update profile with "********"
   - Verify password_hash unchanged

4. **Property 4: Authentication with Updated Credentials**
   - Update password
   - Test login with new password
   - Test login with old password fails

5. **Property 5: Partial Update Support**
   - Generate random partial updates
   - Verify only specified fields change

6. **Property 6: Password Validation**
   - Generate passwords < 6 characters
   - Verify rejection

7. **Property 7: Empty Field Rejection**
   - Test empty name
   - Verify rejection

8. **Property 8: Phone Format Validation**
   - Generate invalid phone formats
   - Verify rejection

## Implementation Notes

### Password Hashing

- Use bcrypt with salt rounds = 10 (already configured in authService)
- Import authService into userService to reuse hashPassword method
- Never store plain text passwords

### Database Updates

- Use JsonDatabase.update method
- Ensure atomic updates
- Handle concurrent update scenarios

### Security Considerations

1. Never return password_hash to client
2. Always hash passwords before storing
3. Validate all input data
4. Use authentication middleware for all profile endpoints

### Performance Considerations

1. Bcrypt hashing is CPU-intensive - acceptable for profile updates (infrequent operation)
2. Database writes are synchronous in current JSON implementation
3. Consider caching user data after updates

## Migration Strategy

This is a bug fix, not a breaking change:
1. No database schema changes required
2. No API contract changes (password field already accepted)
3. Backward compatible with existing clients
4. Can be deployed without downtime
