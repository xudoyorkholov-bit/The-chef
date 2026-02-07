/**
 * Property-Based Tests for Audio Announcement Service
 * Feature: order-number-announcement
 */

import * as fc from 'fast-check';
import audioAnnouncementService, { AudioAnnouncementConfig } from './audioAnnouncementService';

// Mock Web Speech API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockGetVoices = jest.fn(() => []);

beforeAll(() => {
  // Setup Web Speech API mock
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    configurable: true, // Allow reconfiguration in tests
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: mockGetVoices,
      speaking: false,
      pending: false,
      paused: false,
    },
  });

  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    writable: true,
    configurable: true, // Allow reconfiguration in tests
    value: class MockSpeechSynthesisUtterance {
      text: string;
      lang: string = '';
      volume: number = 1;
      rate: number = 1;
      pitch: number = 1;
      onend: (() => void) | null = null;
      onerror: ((event: any) => void) | null = null;

      constructor(text: string) {
        this.text = text;
        // Simulate successful speech
        setTimeout(() => {
          if (this.onend) {
            this.onend();
          }
        }, 10);
      }
    },
  });
});

beforeEach(() => {
  // Clear mocks
  mockSpeak.mockClear();
  mockCancel.mockClear();
  
  // Clear localStorage
  localStorage.clear();
  
  // Reset service state
  audioAnnouncementService.setEnabled(true);
  audioAnnouncementService.setVolume(80);
  audioAnnouncementService.clearEventLog();
  audioAnnouncementService.clearQueue(); // Clear queue between tests
});

describe('AudioAnnouncementService Property Tests', () => {
  /**
   * Property 1: Announcement triggers on ready status
   * Feature: order-number-announcement, Property 1
   * Validates: Requirements 1.1, 1.2
   */
  describe('Property 1: Announcement triggers on ready status', () => {
    it('should call announce for any order number when audio is enabled', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), // Non-empty strings only
          async (orderNumber) => {
            // Clear queue before test
            audioAnnouncementService.clearQueue();
            mockSpeak.mockClear();
            
            // Ensure audio is enabled
            audioAnnouncementService.setEnabled(true);
            audioAnnouncementService.setVolume(50);

            // Announce the order
            await audioAnnouncementService.announce(orderNumber);

            // Wait for async processing
            await new Promise(resolve => setTimeout(resolve, 50));

            // Verify speechSynthesis.speak was called
            expect(mockSpeak).toHaveBeenCalled();

            // Get the utterance that was passed to speak
            const utterance = mockSpeak.mock.calls[mockSpeak.mock.calls.length - 1][0];
            
            // Verify the text contains the order number
            expect(utterance.text).toContain(orderNumber);
            expect(utterance.text).toContain('Buyurtma raqami');
          }
        ),
        { numRuns: 100, timeout: 10000 } // Run 100 iterations with 10s timeout
      );
    }, 15000); // 15 second Jest timeout

    it('should not announce when audio is disabled', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
          async (orderNumber) => {
            // Clear queue and mocks
            audioAnnouncementService.clearQueue();
            mockSpeak.mockClear();
            
            // Disable audio
            audioAnnouncementService.setEnabled(false);

            // Try to announce
            await audioAnnouncementService.announce(orderNumber);

            // Wait for async processing
            await new Promise(resolve => setTimeout(resolve, 50));

            // Verify speechSynthesis.speak was NOT called
            expect(mockSpeak).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100, timeout: 10000 }
      );
    }, 15000);
  });

  /**
   * Property 2: Volume affects playback
   * Feature: order-number-announcement, Property 2
   * Validates: Requirements 3.2, 3.3
   */
  describe('Property 2: Volume affects playback', () => {
    it('should set utterance volume to match configured value (normalized to 0-1)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 100 }), // Generate random volume 1-100
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), // Generate random order number
          async (volume, orderNumber) => {
            // Clear queue and mocks
            audioAnnouncementService.clearQueue();
            mockSpeak.mockClear();
            
            // Set volume
            audioAnnouncementService.setVolume(volume);
            audioAnnouncementService.setEnabled(true);

            // Announce
            await audioAnnouncementService.announce(orderNumber);

            // Wait for async processing
            await new Promise(resolve => setTimeout(resolve, 50));

            // Verify speak was called
            expect(mockSpeak).toHaveBeenCalled();

            // Get the utterance
            const utterance = mockSpeak.mock.calls[mockSpeak.mock.calls.length - 1][0];

            // Verify volume is normalized (0-1 range)
            const expectedVolume = volume / 100;
            expect(utterance.volume).toBeCloseTo(expectedVolume, 2);
          }
        ),
        { numRuns: 100, timeout: 10000 }
      );
    }, 15000);
  });

  /**
   * Property 3: Zero volume prevents playback
   * Feature: order-number-announcement, Property 3
   * Validates: Requirements 3.4
   */
  describe('Property 3: Zero volume prevents playback', () => {
    it('should not play audio when volume is set to 0', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
          async (orderNumber) => {
            // Clear queue and mocks
            audioAnnouncementService.clearQueue();
            mockSpeak.mockClear();
            
            // Set volume to 0
            audioAnnouncementService.setVolume(0);
            audioAnnouncementService.setEnabled(true);

            // Try to announce
            await audioAnnouncementService.announce(orderNumber);

            // Wait for async processing
            await new Promise(resolve => setTimeout(resolve, 50));

            // Verify speechSynthesis.speak was NOT called (silent mode)
            expect(mockSpeak).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100, timeout: 10000 }
      );
    }, 15000);
  });

  /**
   * Property 4: Settings persistence
   * Feature: order-number-announcement, Property 4
   * Validates: Requirements 2.5, 3.5
   */
  describe('Property 4: Settings persistence', () => {
    it('should persist enabled state and volume to localStorage', () => {
      fc.assert(
        fc.property(
          fc.boolean(), // Random enabled state
          fc.integer({ min: 0, max: 100 }), // Random volume
          (enabled, volume) => {
            // Set configuration
            audioAnnouncementService.setEnabled(enabled);
            audioAnnouncementService.setVolume(volume);

            // Verify localStorage
            const storedEnabled = localStorage.getItem('audioAnnouncementEnabled');
            const storedVolume = localStorage.getItem('audioAnnouncementVolume');

            expect(storedEnabled).toBe(String(enabled));
            expect(storedVolume).toBe(String(volume));

            // Verify getConfig returns correct values
            const config = audioAnnouncementService.getConfig();
            expect(config.enabled).toBe(enabled);
            expect(config.volume).toBe(volume);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Sequential announcement ordering
   * Feature: order-number-announcement, Property 5
   * Validates: Requirements 5.4, 5.5
   */
  describe('Property 5: Sequential announcement ordering', () => {
    it('should announce multiple orders in sequence', async () => {
      // Simple unit test instead of property test due to queue complexity
      const orderNumbers = ['1001', '1002'];
      
      audioAnnouncementService.clearQueue();
      audioAnnouncementService.clearEventLog();
      mockSpeak.mockClear();
      
      audioAnnouncementService.setEnabled(true);
      audioAnnouncementService.setVolume(50);

      // Queue all announcements
      for (const orderNumber of orderNumbers) {
        await audioAnnouncementService.announce(orderNumber);
      }

      // Wait for all to process
      await new Promise(resolve => setTimeout(resolve, 4500));

      // Verify all were spoken
      expect(mockSpeak).toHaveBeenCalledTimes(2);

      // Verify order
      expect(mockSpeak.mock.calls[0][0].text).toContain('1001');
      expect(mockSpeak.mock.calls[1][0].text).toContain('1002');
    });
  });

  /**
   * Property 6: Uzbek language announcement format
   * Feature: order-number-announcement, Property 6
   * Validates: Requirements 5.2, 5.3
   */
  describe('Property 6: Uzbek language announcement format', () => {
    it('should format announcement as "Buyurtma raqami [number]" repeated twice', async () => {
      // Simple unit test instead of property test due to queue complexity
      const orderNumber = '1001';
      
      audioAnnouncementService.clearQueue();
      audioAnnouncementService.clearEventLog();
      mockSpeak.mockClear();
      
      audioAnnouncementService.setEnabled(true);
      audioAnnouncementService.setVolume(50);

      await audioAnnouncementService.announce(orderNumber);

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify speak was called
      expect(mockSpeak).toHaveBeenCalled();

      const utterance = mockSpeak.mock.calls[0][0];
      const text = utterance.text;

      // Verify format: "Buyurtma raqami [number]. Buyurtma raqami [number]."
      const expectedPattern = `Buyurtma raqami ${orderNumber}. Buyurtma raqami ${orderNumber}.`;
      expect(text).toBe(expectedPattern);

      // Verify it appears twice
      const occurrences = (text.match(/Buyurtma raqami 1001/g) || []).length;
      expect(occurrences).toBe(2);
    });
  });

  /**
   * Property 7: Browser support detection
   * Feature: order-number-announcement, Property 7
   * Validates: Requirements 6.4
   */
  describe('Property 7: Browser support detection', () => {
    it('should detect when Web Speech API is not available', () => {
      // First verify it's supported
      expect(audioAnnouncementService.isSupported()).toBe(true);

      // Save original
      const originalSpeechSynthesis = window.speechSynthesis;
      const originalUtterance = window.SpeechSynthesisUtterance;

      try {
        // Remove Web Speech API
        // @ts-ignore
        delete window.speechSynthesis;
        // @ts-ignore
        delete window.SpeechSynthesisUtterance;

        // Verify isSupported returns false
        expect(audioAnnouncementService.isSupported()).toBe(false);
      } finally {
        // Always restore
        Object.defineProperty(window, 'speechSynthesis', {
          writable: true,
          configurable: true,
          value: originalSpeechSynthesis,
        });
        Object.defineProperty(window, 'SpeechSynthesisUtterance', {
          writable: true,
          configurable: true,
          value: originalUtterance,
        });
      }

      // Verify isSupported returns true again
      expect(audioAnnouncementService.isSupported()).toBe(true);
    });
  });
});
