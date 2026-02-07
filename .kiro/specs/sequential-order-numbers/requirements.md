# Requirements Document

## Introduction

This feature implements sequential order numbering for The Chef Restaurant system. Currently, order numbers are generated using random timestamps and numbers (e.g., #722321804), which makes it difficult for customers and staff to reference orders. The system will be updated to use simple, sequential order numbers starting from 1 (e.g., Order #1, Order #2, Order #3, etc.).

## Glossary

- **Order System**: The backend system component responsible for creating and managing customer orders
- **Order Number**: A unique sequential identifier assigned to each order, starting from 1
- **Order Counter**: A persistent counter that tracks the next available order number
- **Database**: The JSON-based data storage system used by the application

## Requirements

### Requirement 1

**User Story:** As a customer, I want to see simple sequential order numbers, so that I can easily remember and reference my orders.

#### Acceptance Criteria

1. WHEN a new order is created THEN the Order System SHALL assign the next sequential number starting from 1
2. WHEN displaying an order number THEN the Order System SHALL format it with a hash prefix (e.g., "#1", "#2", "#3")
3. WHEN multiple orders are created THEN the Order System SHALL ensure each order receives a unique sequential number without gaps
4. WHEN the system restarts THEN the Order System SHALL resume numbering from the last assigned number plus one

### Requirement 2

**User Story:** As a restaurant staff member, I want order numbers to be sequential and predictable, so that I can quickly locate and process orders.

#### Acceptance Criteria

1. WHEN viewing the order list THEN the Order System SHALL display orders with their sequential numbers
2. WHEN searching for an order THEN the Order System SHALL allow lookup by sequential order number
3. WHEN an order is cancelled or deleted THEN the Order System SHALL not reuse that order number

### Requirement 3

**User Story:** As a system administrator, I want the order counter to be persistent and reliable, so that order numbers remain consistent across system restarts.

#### Acceptance Criteria

1. WHEN the Order Counter is initialized THEN the Order System SHALL read the last order number from the Database
2. WHEN an order is created THEN the Order System SHALL increment and persist the Order Counter atomically
3. WHEN concurrent orders are created THEN the Order System SHALL prevent duplicate order numbers through proper synchronization
