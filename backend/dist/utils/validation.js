// Validation utilities
/**
 * Validates email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validates that a date is not in the past
 */
export function isValidFutureDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
}
/**
 * Validates phone number format (basic validation)
 */
export function isValidPhone(phone) {
    // Allow various formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}
/**
 * Validates time format (HH:MM)
 */
export function isValidTime(time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}
/**
 * Validates that required fields are present and not empty
 */
export function validateRequiredFields(data, requiredFields) {
    const missing = [];
    for (const field of requiredFields) {
        const value = data[field];
        if (value === undefined || value === null || value === '') {
            missing.push(field);
        }
    }
    return {
        valid: missing.length === 0,
        missing
    };
}
/**
 * Sanitizes string input to prevent XSS attacks
 */
export function sanitizeString(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
export function validateReservationData(data) {
    const errors = [];
    // Check required fields
    const required = validateRequiredFields(data, [
        'customer_name',
        'customer_email',
        'customer_phone',
        'reservation_date',
        'reservation_time',
        'party_size'
    ]);
    if (!required.valid) {
        errors.push(`Missing required fields: ${required.missing.join(', ')}`);
        return { valid: false, errors };
    }
    // Validate email
    if (data.customer_email && !isValidEmail(data.customer_email)) {
        errors.push('Invalid email format');
    }
    // Validate phone
    if (data.customer_phone && !isValidPhone(data.customer_phone)) {
        errors.push('Invalid phone number format');
    }
    // Validate date
    if (data.reservation_date && !isValidFutureDate(data.reservation_date)) {
        errors.push('Reservation date must be in the future');
    }
    // Validate time
    if (data.reservation_time && !isValidTime(data.reservation_time)) {
        errors.push('Invalid time format (use HH:MM)');
    }
    // Validate party size
    if (data.party_size !== undefined && data.party_size < 1) {
        errors.push('Party size must be at least 1');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
export function validateMessageData(data) {
    const errors = [];
    // Check required fields
    const required = validateRequiredFields(data, [
        'name',
        'email',
        'subject',
        'message'
    ]);
    if (!required.valid) {
        errors.push(`Missing required fields: ${required.missing.join(', ')}`);
        return { valid: false, errors };
    }
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
