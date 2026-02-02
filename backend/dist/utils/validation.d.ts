/**
 * Validates email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validates that a date is not in the past
 */
export declare function isValidFutureDate(dateString: string): boolean;
/**
 * Validates phone number format (basic validation)
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Validates time format (HH:MM)
 */
export declare function isValidTime(time: string): boolean;
/**
 * Validates that required fields are present and not empty
 */
export declare function validateRequiredFields(data: Record<string, unknown>, requiredFields: string[]): {
    valid: boolean;
    missing: string[];
};
/**
 * Sanitizes string input to prevent XSS attacks
 */
export declare function sanitizeString(input: string): string;
/**
 * Validates reservation data
 */
export interface ReservationValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateReservationData(data: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    reservation_date?: string;
    reservation_time?: string;
    party_size?: number;
}): ReservationValidationResult;
/**
 * Validates contact message data
 */
export interface MessageValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateMessageData(data: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}): MessageValidationResult;
//# sourceMappingURL=validation.d.ts.map