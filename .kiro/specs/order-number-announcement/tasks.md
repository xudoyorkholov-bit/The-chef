# Implementation Plan: Order Number Announcement System

- [x] 1. Create AudioAnnouncementService



  - Create new service file at `frontend/src/services/audioAnnouncementService.ts`
  - Implement singleton pattern for service instance
  - Add methods: announce(), testAnnouncement(), setEnabled(), setVolume(), getConfig(), isSupported(), getIsSpeaking()
  - Implement localStorage integration for settings persistence
  - Add queue management for sequential announcements
  - Implement Web Speech API integration with error handling
  - Format announcement text as "Buyurtma raqami [number]" repeated twice
  - Add 2-second pause between sequential announcements
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4, 3.2, 3.3, 3.4, 3.5, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.4_



- [ ] 1.1 Write property test for announcement triggering
  - **Property 1: Announcement triggers on ready status**

  - **Validates: Requirements 1.1, 1.2**

- [x] 1.2 Write property test for volume control

  - **Property 2: Volume affects playback**
  - **Validates: Requirements 3.2, 3.3**


- [ ] 1.3 Write property test for zero volume
  - **Property 3: Zero volume prevents playback**
  - **Validates: Requirements 3.4**


- [ ] 1.4 Write property test for settings persistence
  - **Property 4: Settings persistence**

  - **Validates: Requirements 2.5, 3.5**

- [x] 1.5 Write property test for sequential announcements

  - **Property 5: Sequential announcement ordering**


  - **Validates: Requirements 5.4, 5.5**

- [ ] 1.6 Write property test for Uzbek format
  - **Property 6: Uzbek language announcement format**
  - **Validates: Requirements 5.2, 5.3**

- [ ] 1.7 Write property test for browser support detection
  - **Property 7: Browser support detection**
  - **Validates: Requirements 6.4**


- [ ] 2. Add audio controls UI to AdminOrders component
  - Add state management for audio controls (enabled, volume, isSpeaking, isSupported, error)
  - Create toggle switch for enable/disable audio announcements
  - Create volume slider (0-100 range) with visual feedback
  - Create "Test Audio" button
  - Add visual indicator for speaking status (animated speaker icon)
  - Add error/warning message display for unsupported browsers


  - Initialize AudioAnnouncementService on component mount
  - Load saved settings from service on component mount
  - _Requirements: 2.1, 2.2, 3.1, 4.1, 4.2, 6.1, 6.2, 6.3, 6.4_


- [x] 3. Integrate announcement with order status updates

  - Detect order status changes to "ready" or "completed" in AdminOrders
  - Call AudioAnnouncementService.announce() with order number when status changes
  - Only trigger announcement if audio is enabled
  - Handle announcement errors gracefully with user feedback
  - Update speaking indicator during announcement
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3_

- [x] 3.1 Write unit tests for status change detection


  - Test that status changes to "ready" trigger announcements
  - Test that status changes to "completed" trigger announcements
  - Test that other status changes do not trigger announcements
  - Test that announcements are skipped when audio is disabled
  - _Requirements: 1.1, 1.2, 2.3_


- [ ] 4. Add CSS styling for audio controls
  - Style toggle switch with smooth animation
  - Style volume slider with custom track and thumb
  - Style test button with hover and active states
  - Style speaking indicator with pulse animation
  - Style error/warning messages with appropriate colors
  - Ensure responsive design for mobile devices
  - Add accessibility focus styles


  - _Requirements: 2.1, 3.1, 4.1, 6.1_

- [ ] 5. Add language context integration
  - Import LanguageContext to get current language
  - Update announcement text based on selected language (Uzbek/Russian)
  - Use "Buyurtma raqami" for Uzbek

  - Use "Номер заказа" for Russian
  - Update UI labels based on language
  - _Requirements: 5.2_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Add integration tests
  - Test full flow: status update → announcement → audio playback
  - Test settings persistence across simulated page reloads
  - Test multiple rapid status changes
  - Test audio controls interaction with mocked Web Speech API
  - _Requirements: All_
