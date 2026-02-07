# Design Document: Sequential Order Numbers

## Overview

This design implements a sequential order numbering system that replaces the current random timestamp-based approach. The system will maintain a persistent counter in the database that increments with each new order, ensuring simple, memorable order numbers starting from 1.

## Architecture

The sequential order number system consists of three main components:

1. **Order Counter Storage**: A new field in the database to store the current counter value
2. **Order Number Generator**: Updated logic in the order repository to generate sequential numbers
3. **Counter Initialization**: Logic to initialize the counter based on existing orders

### Current vs. New Approach

**Current:**
```
generateOrderNumber() → "#" + timestamp(6) + random(3) → "#722321804"
```

**New:**
```
getNextOrderNumber() → counter++ → "#1", "#2", "#3", ...
```

## Components and Interfaces

### 1. Database Schema Extension

The JSON database will be extended to include a `counters` collection:

```typescript
interface Database {
  users: any[];
  menuItems: any[];
  orders: any[];
  reservations: any[];
  messages: any[];
  testimonials: any[];
  gallery: any[];
  counters: { [key: string]: number };  // NEW
}
```

The `counters` object will store:
```json
{
  "counters": {
    "orderNumber": 42  // Last used order number
  }
}
```

### 2. Order Repository Updates

The `orderRepository` will be updated with new methods:

```typescript
interface OrderRepository {
  // Existing methods...
  findByUserId(userId: string): Promise<IOrder[]>;
  findAll(): Promise<IOrder[]>;
  findById(id: string): Promise<IOrder | null>;
  create(orderData: any): Promise<IOrder>;
  updateStatus(id: string, status: string): Promise<IOrder | null>;
  delete(id: string): Promise<boolean>;
  
  // NEW methods
  getNextOrderNumber(): string;
  initializeOrderCounter(): void;
}
```

### 3. JsonDatabase Counter Methods

New methods will be added to `JsonDatabase` class:

```typescript
class JsonDatabase {
  // Existing methods...
  
  // NEW: Get counter value
  static getCounter(name: string): number;
  
  // NEW: Increment counter atomically
  static incrementCounter(name: string): number;
  
  // NEW: Initialize counter if not exists
  static initializeCounter(name: string, value: number): void;
}
```

## Data Models

### Counter Storage

```typescript
interface Counters {
  orderNumber: number;  // Current order number counter
}
```

### Order Model (Updated)

The `IOrder` interface remains the same, but the `order_number` field will now contain sequential values:

```typescript
interface IOrder {
  _id: string;
  user_id?: string;
  order_number: string;  // Format: "#1", "#2", "#3", etc.
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items: IOrderItem[];
  total: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Sequential numbering without gaps

*For any* sequence of order creations, the order numbers SHALL be consecutive integers starting from 1, with no gaps in the sequence (unless orders are created, which should not create gaps in future numbering).

**Validates: Requirements 1.1, 1.3**

### Property 2: Uniqueness of order numbers

*For any* two distinct orders in the system, their order numbers SHALL be different.

**Validates: Requirements 1.3**

### Property 3: Counter persistence across restarts

*For any* system state before restart, if the last order number was N, then after restart the next order SHALL receive number N+1.

**Validates: Requirements 1.4, 3.1**

### Property 4: Monotonic increase

*For any* two orders where order A is created before order B, the order number of A SHALL be less than the order number of B.

**Validates: Requirements 1.1, 1.3**

### Property 5: No reuse of cancelled order numbers

*For any* order that is cancelled or deleted, its order number SHALL never be assigned to a new order.

**Validates: Requirements 2.3**

### Property 6: Format consistency

*For any* order number generated, it SHALL match the format "#N" where N is a positive integer.

**Validates: Requirements 1.2**

## Error Handling

### Counter Initialization Errors

- **Scenario**: Database file is corrupted or missing counters field
- **Handling**: Initialize counter to 0 or calculate from existing orders
- **Recovery**: Log warning and continue with calculated value

### Concurrent Order Creation

- **Scenario**: Multiple orders created simultaneously
- **Handling**: Use file system locking or atomic read-modify-write operations
- **Recovery**: Ensure each order gets a unique number through synchronization

### Counter Overflow

- **Scenario**: Order number exceeds safe integer limits
- **Handling**: JavaScript safe integer limit is 2^53-1 (9,007,199,254,740,991)
- **Recovery**: This is not a practical concern for restaurant operations

## Testing Strategy

### Unit Tests

Unit tests will verify:
- Counter initialization from empty database
- Counter initialization from existing orders
- Sequential number generation
- Format of generated order numbers
- Counter persistence after multiple operations

### Property-Based Tests

Property-based tests will use the `fast-check` library for TypeScript to verify:

1. **Sequential Property**: Generate N random order creation requests, verify numbers are 1, 2, 3, ..., N
2. **Uniqueness Property**: Generate random concurrent order creations, verify all numbers are unique
3. **Persistence Property**: Generate orders, simulate restart, generate more orders, verify continuity
4. **Format Property**: Generate random order numbers, verify all match "#\d+" pattern
5. **Monotonic Property**: Generate orders with timestamps, verify order numbers increase with time

Each property-based test will run a minimum of 100 iterations to ensure statistical confidence.

Property-based tests will be tagged with comments in this format:
```typescript
// Feature: sequential-order-numbers, Property 1: Sequential numbering without gaps
```

## Implementation Plan

### Phase 1: Database Extension
1. Add `counters` field to database schema
2. Implement counter methods in JsonDatabase class
3. Add initialization logic for order counter

### Phase 2: Repository Updates
1. Replace `generateOrderNumber()` with `getNextOrderNumber()`
2. Update `create()` method to use new number generator
3. Add counter initialization on first use

### Phase 3: Migration
1. Calculate highest existing order number
2. Initialize counter to that value
3. Ensure backward compatibility with existing orders

### Phase 4: Testing
1. Write unit tests for counter operations
2. Write property-based tests for correctness properties
3. Test migration with existing data

## Migration Strategy

For existing systems with random order numbers:

1. **Scan existing orders**: Find the highest numeric value in existing order numbers (if any)
2. **Initialize counter**: Set counter to max(existing_orders.length, 0)
3. **Preserve old orders**: Keep existing order numbers unchanged
4. **New orders**: Start sequential numbering from counter + 1

Example:
- Existing orders: #722321804, #722321805, #722321806 (3 orders)
- Initialize counter to: 3
- Next new order: #4

This ensures no conflicts and provides a clean transition to sequential numbering.
