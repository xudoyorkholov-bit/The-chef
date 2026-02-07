# Requirements Document

## Introduction

Bu hujjat restoran buyurtmalarining holati boshqaruvi tizimini tavsiflab beradi. Tizim foydalanuvchilarga buyurtma holatini real vaqtda ko'rish imkonini beradi va administratorlarga buyurtma holatini boshqarish imkoniyatini taqdim etadi.

## Glossary

- **System**: Buyurtma holati boshqaruvi tizimi
- **User**: Restorandan buyurtma beruvchi foydalanuvchi
- **Admin**: Buyurtmalarni boshqaruvchi administrator
- **Order**: Foydalanuvchi tomonidan berilgan buyurtma
- **Order Status**: Buyurtmaning joriy holati (kutilmoqda, qabul qilindi, yo'lda, yetib keldi, bekor qilindi)

## Requirements

### Requirement 1

**User Story:** Foydalanuvchi sifatida, men buyurtma berganimda uning holatini ko'rishni xohlayman, shunda buyurtmam qayerda ekanligini bilaman.

#### Acceptance Criteria

1. WHEN a User creates a new order THEN the System SHALL set the order status to "kutilmoqda" (pending)
2. WHEN a User views their orders page THEN the System SHALL display all orders with their current status
3. WHEN an order status changes THEN the System SHALL display the updated status to the User immediately
4. WHEN a User views an order THEN the System SHALL display the status in Uzbek language with appropriate visual indicators
5. THE System SHALL support the following status values: "kutilmoqda", "qabul qilindi", "yo'lda", "yetib keldi", "bekor qilindi"

### Requirement 2

**User Story:** Administrator sifatida, men buyurtma holatini o'zgartirishni xohlayman, shunda foydalanuvchilar buyurtmalarining holatini bilishadi.

#### Acceptance Criteria

1. WHEN an Admin selects a new status for an order THEN the System SHALL update the order status in the database
2. WHEN an Admin changes order status THEN the System SHALL persist the change immediately
3. WHEN an Admin views the orders page THEN the System SHALL display a dropdown with all available status options
4. THE System SHALL provide status options: "bekor qilindi", "kutilmoqda", "qabul qilindi", "yo'lda", "yetib keldi"
5. WHEN an Admin changes status THEN the System SHALL validate that the new status is one of the allowed values

### Requirement 3

**User Story:** Foydalanuvchi sifatida, men buyurtma holatining o'zgarishini real vaqtda ko'rishni xohlayman, shunda admin panel bilan sinxronlashgan bo'laman.

#### Acceptance Criteria

1. WHEN an Admin changes order status to "qabul qilindi" THEN the System SHALL display "qabul qilindi" to the User
2. WHEN an Admin changes order status to "yo'lda" THEN the System SHALL display "yo'lda" to the User
3. WHEN an Admin changes order status to "yetib keldi" THEN the System SHALL display "yetib keldi" to the User
4. WHEN an Admin changes order status to "bekor qilindi" THEN the System SHALL display "bekor qilindi" to the User
5. WHEN a User refreshes their orders page THEN the System SHALL fetch and display the latest order statuses

### Requirement 4

**User Story:** Administrator sifatida, men buyurtmalarni holati bo'yicha filtrlashni xohlayman, shunda kerakli buyurtmalarni tez topaman.

#### Acceptance Criteria

1. WHEN an Admin views the orders page THEN the System SHALL display filter buttons for each status
2. WHEN an Admin clicks a status filter THEN the System SHALL display only orders with that status
3. WHEN an Admin clicks "Barchasi" filter THEN the System SHALL display all orders regardless of status
4. THE System SHALL display the count of orders for each status in the filter buttons
5. WHEN orders are filtered THEN the System SHALL maintain the filter selection until changed by the Admin

### Requirement 5

**User Story:** Foydalanuvchi sifatida, men buyurtma holatini vizual ko'rsatkichlar bilan ko'rishni xohlayman, shunda holatni tez tushunaman.

#### Acceptance Criteria

1. WHEN the System displays order status THEN the System SHALL use distinct colors for each status
2. WHEN order status is "kutilmoqda" THEN the System SHALL display it with orange color
3. WHEN order status is "qabul qilindi" THEN the System SHALL display it with blue color
4. WHEN order status is "yo'lda" THEN the System SHALL display it with purple color
5. WHEN order status is "yetib keldi" THEN the System SHALL display it with green color
6. WHEN order status is "bekor qilindi" THEN the System SHALL display it with red color
