# Implementation Plan

- [ ] 1. Update backend service layer to support password updates
  - [x] 1.1 Modify userService.updateProfile to accept password parameter


    - Import authService to access hashPassword method
    - Add password parameter to UpdateProfileData interface
    - Add logic to hash password if provided and not masked ("********")
    - Pass hashed password to repository layer
    - _Requirements: 3.1, 5.1_

  - [ ] 1.2 Write property test for password hashing consistency
    - **Property 1: Password Hashing Consistency**
    - **Validates: Requirements 3.1, 5.1**



- [ ] 2. Update backend repository layer to support password updates
  - [ ] 2.1 Modify userRepository.updateProfile to accept password_hash parameter
    - Add password_hash to UpdateProfileData interface
    - Update JsonDatabase.update call to include password_hash
    - Ensure password_hash is only updated when provided
    - _Requirements: 3.1, 5.1_

  - [ ] 2.2 Write property test for profile update persistence
    - **Property 2: Profile Update Persistence**



    - **Validates: Requirements 1.1, 2.1, 3.1**

- [ ] 3. Update backend controller layer with validation
  - [ ] 3.1 Modify userController.updateProfile to handle password
    - Extract password from request body
    - Add validation for password length (min 6 characters)
    - Add validation for empty full_name
    - Add validation for phone format
    - Pass password to service layer
    - Handle validation errors with appropriate status codes
    - _Requirements: 1.3, 2.3, 3.4_

  - [ ] 3.2 Write property test for password validation
    - **Property 6: Password Validation**
    - **Validates: Requirements 3.4**

  - [ ] 3.3 Write property test for empty field rejection
    - **Property 7: Empty Field Rejection**
    - **Validates: Requirements 1.3**




  - [ ] 3.4 Write property test for phone format validation
    - **Property 8: Phone Format Validation**
    - **Validates: Requirements 2.3**

- [ ] 4. Add masked password handling
  - [ ] 4.1 Implement masked password check in userService
    - Check if password equals "********"
    - Skip password update if masked
    - Only hash and update if password is changed
    - _Requirements: 3.3_

  - [ ] 4.2 Write property test for masked password preservation
    - **Property 3: Masked Password Preservation**
    - **Validates: Requirements 3.3**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add support for partial updates
  - [ ] 6.1 Ensure service layer handles partial updates correctly
    - Only include fields that are provided in update data
    - Don't overwrite fields that aren't in the request
    - Test updating only full_name
    - Test updating only phone
    - Test updating only password
    - _Requirements: 4.2_

  - [ ] 6.2 Write property test for partial update support
    - **Property 5: Partial Update Support**
    - **Validates: Requirements 4.2**

- [ ] 7. Add authentication flow tests
  - [ ] 7.1 Write property test for authentication with updated credentials
    - **Property 4: Authentication with Updated Credentials**
    - **Validates: Requirements 3.2, 3.5**
    - Test login with new password succeeds
    - Test login with old password fails

  - [ ] 7.2 Write integration test for full profile update flow
    - Register user
    - Update profile (name, phone, password)
    - Logout
    - Login with new credentials
    - Verify all fields updated
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2_

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
