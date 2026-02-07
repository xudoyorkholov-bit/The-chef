# Implementation Plan: Sequential Order Numbers

- [x] 1. Extend JsonDatabase with counter support




  - Add `counters` field to database schema initialization
  - Implement `getCounter(name: string): number` method to retrieve counter value
  - Implement `incrementCounter(name: string): number` method for atomic increment
  - Implement `initializeCounter(name: string, value: number): void` method
  - _Requirements: 3.1, 3.2_





- [ ] 1.1 Write property test for counter atomicity
  - **Property 8: Counter increment atomicity**
  - **Validates: Requirements 3.2**

- [ ] 2. Update order repository with sequential numbering
  - Remove old `generateOrderNumber()` method
  - Implement `getNextOrderNumber(): string` method using counter
  - Implement `initializeOrderCounter(): void` method to set initial counter value
  - Update `create()` method to use `getNextOrderNumber()` instead of `generateOrderNumber()`
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2.1 Write property test for sequential numbering
  - **Property 1: Sequential numbering without gaps**
  - **Validates: Requirements 1.1, 1.3**

- [ ] 2.2 Write property test for uniqueness
  - **Property 2: Uniqueness of order numbers**
  - **Validates: Requirements 1.3**

- [ ] 2.3 Write property test for format consistency
  - **Property 6: Format consistency**
  - **Validates: Requirements 1.2**

- [ ] 3. Implement counter initialization logic
  - Add logic to check if counter exists on first order creation
  - Calculate initial counter value from existing orders (count of existing orders)
  - Initialize counter in database if not present
  - _Requirements: 3.1, 1.4_

- [ ] 3.1 Write property test for counter initialization
  - **Property 7: Counter initialization correctness**
  - **Validates: Requirements 3.1**

- [ ] 4. Add order lookup by order number
  - Implement `findByOrderNumber(orderNumber: string): Promise<IOrder | null>` in repository
  - Update order service to support lookup by order number
  - _Requirements: 2.2_

- [ ] 4.1 Write property test for order lookup
  - **Property 2.2: Order lookup by number**
  - **Validates: Requirements 2.2**

- [ ] 5. Ensure deleted order numbers are not reused
  - Verify that `delete()` method does not decrement counter
  - Add test to confirm counter continues incrementing after deletions
  - _Requirements: 2.3_

- [ ] 5.1 Write property test for no reuse of deleted numbers
  - **Property 5: No reuse of cancelled order numbers**
  - **Validates: Requirements 2.3**

- [ ] 6. Test counter persistence across restarts
  - Write integration test that creates orders, reinitializes repository, creates more orders
  - Verify order numbers continue sequentially after reinitialization
  - _Requirements: 1.4, 3.1_

- [ ] 6.1 Write property test for persistence
  - **Property 3: Counter persistence across restarts**
  - **Validates: Requirements 1.4, 3.1**

- [ ] 7. Add monotonic ordering test
  - Verify that orders created later have higher order numbers
  - _Requirements: 1.1_

- [ ] 7.1 Write property test for monotonic increase
  - **Property 4: Monotonic increase**
  - **Validates: Requirements 1.1, 1.3**

- [ ] 8. Update order service and controller
  - Ensure order service uses updated repository methods
  - Verify controller endpoints work with new order numbers
  - Test order creation endpoint returns sequential numbers
  - _Requirements: 1.1, 1.2_

- [ ] 8.1 Write unit tests for service and controller
  - Test order creation with sequential numbers
  - Test order retrieval by order number
  - _Requirements: 1.1, 1.2, 2.2_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
