# Design Document: Order Number Announcement System

## Overview

The Order Number Announcement System adds audio notification capabilities to the restaurant's order management interface. When an administrator marks an order as ready or completed, the system automatically announces the order number using the browser's Web Speech API, helping customers easily identify when their orders are ready for pickup.

The system provides full control over audio settings including enable/disable toggle, volume control, and test functionality. All settings persist in browser local storage for convenience.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   AdminOrders Component                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Audio Announcement Controls UI             │ │
│  │  - Toggle Switch                                   │ │
│  │  - Volume Slider                                   │ │
│  │  - Test Button                                     │ │
│  │  - Status Indicator                                │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │      Order Status Update Handler                   │ │
│  │  - Detects status changes to ready/completed      │ │
│  │  - Triggers announcement                           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│           AudioAnnouncementService                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  - announce(orderNumber)                           │ │
│  │  - setEnabled(boolean)                             │ │
│  │  - setVolume(number)                               │ │
│  │  - testAnnouncement()                              │ │
│  │  - isSupported()                                   │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Web Speech API (Browser)                    │
│  - SpeechSynthesisUtterance                             │
│  - speechSynthesis.speak()                              │
└─────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Admin Updates Order Status**: Admin changes order status to "ready" or "completed"
2. **Status Change Detection**: AdminOrders component detects the status change
3. **Announcement Trigger**: If audio is enabled, component calls AudioAnnouncementService
4. **Speech Generation**: Service creates SpeechSynthesisUtterance with order number
5. **Audio Playback**: Browser's Web Speech API plays the announcement
6. **Visual Feedback**: UI shows speaking indicator during playback

## Components and Interfaces

### 1. AudioAnnouncementService

A singleton service that manages all audio announcement functionality.

```typescript
interface AudioAnnouncementConfig {
  enabled: boolean;
  volume: number; // 0-100
  language: string;
  rate: number; // Speech rate
  pitch: number; // Voice pitch
}

class AudioAnnouncementService {
  private config: AudioAnnouncementConfig;
  private queue: string[];
  private isSpeaking: boolean;
  
  // Initialize service and load settings from localStorage
  constructor();
  
  // Announce an order number
  announce(orderNumber: string): Promise<void>;
  
  // Test announcement with sample order number
  testAnnouncement(): Promise<void>;
  
  // Enable or disable announcements
  setEnabled(enabled: boolean): void;
  
  // Set volume (0-100)
  setVolume(volume: number): void;
  
  // Get current configuration
  getConfig(): AudioAnnouncementConfig;
  
  // Check if Web Speech API is supported
  isSupported(): boolean;
  
  // Get speaking status
  getIsSpeaking(): boolean;
}
```

### 2. AdminOrders Component Updates

Add audio announcement controls and integrate with the service.

```typescript
interface AudioControlsState {
  enabled: boolean;
  volume: number;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
}

// New UI elements to add:
// - Toggle switch for enable/disable
// - Volume slider (0-100)
// - Test button
// - Speaking indicator
// - Error/warning messages
```

### 3. Local Storage Schema

```typescript
interface StoredAudioSettings {
  audioAnnouncementEnabled: boolean;
  audioAnnouncementVolume: number;
}

// Storage keys:
// - 'audioAnnouncementEnabled': boolean
// - 'audioAnnouncementVolume': number (0-100)
```

## Data Models

### AudioAnnouncementConfig

```typescript
interface AudioAnnouncementConfig {
  enabled: boolean;        // Whether announcements are enabled
  volume: number;          // Volume level 0-100
  language: string;        // Language code (e.g., 'uz-UZ')
  rate: number;           // Speech rate (0.1-10, default 1)
  pitch: number;          // Voice pitch (0-2, default 1)
}
```

### AnnouncementEvent

```typescript
interface AnnouncementEvent {
  orderNumber: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Announcement triggers on ready status
*For any* order status update to "ready" or "completed", when audio is enabled, the system should call the announcement service with the correct order number.
**Validates: Requirements 1.1, 1.2**

### Property 2: Volume affects playback
*For any* volume setting between 0 and 100, the speech synthesis volume should match the configured value (normalized to 0-1 range).
**Validates: Requirements 3.2, 3.3**

### Property 3: Zero volume prevents playback
*For any* announcement request, when volume is set to 0, no audio should be played.
**Validates: Requirements 3.4**

### Property 4: Settings persistence
*For any* audio configuration change (enabled/disabled or volume), the new setting should be stored in localStorage and retrieved on page reload.
**Validates: Requirements 2.5, 3.5**

### Property 5: Sequential announcement ordering
*For any* sequence of multiple announcement requests, they should be played in the order received with appropriate pauses between them.
**Validates: Requirements 5.4, 5.5**

### Property 6: Uzbek language announcement format
*For any* order number, the announcement text should follow the format "Buyurtma raqami [number]" and be repeated twice.
**Validates: Requirements 5.2, 5.3**

### Property 7: Browser support detection
*For any* browser environment, when Web Speech API is not available, the system should detect this and display a warning without crashing.
**Validates: Requirements 6.4**

## Error Handling

### 1. Browser Compatibility
- **Issue**: Web Speech API not supported in browser
- **Handling**: 
  - Detect support on component mount
  - Display warning message to admin
  - Disable audio controls gracefully
  - Log warning to console

### 2. Speech Synthesis Failure
- **Issue**: speechSynthesis.speak() fails or throws error
- **Handling**:
  - Catch errors in try-catch block
  - Display error message to admin
  - Log error details for debugging
  - Continue normal operation without audio

### 3. Queue Overflow
- **Issue**: Too many announcements queued simultaneously
- **Handling**:
  - Limit queue size to 10 items
  - Drop oldest items if queue is full
  - Log warning when queue limit reached

### 4. Invalid Volume Values
- **Issue**: Volume set outside 0-100 range
- **Handling**:
  - Clamp values to valid range
  - Validate input on slider change
  - Sanitize values from localStorage

### 5. LocalStorage Unavailable
- **Issue**: localStorage blocked or unavailable
- **Handling**:
  - Use in-memory fallback for settings
  - Display info message about settings not persisting
  - Continue with default settings

## Testing Strategy

### Unit Tests

1. **AudioAnnouncementService Tests**
   - Test configuration initialization
   - Test volume clamping (0-100 range)
   - Test enabled/disabled state management
   - Test localStorage read/write
   - Test browser support detection
   - Test announcement text formatting

2. **AdminOrders Component Tests**
   - Test audio controls rendering
   - Test toggle switch functionality
   - Test volume slider updates
   - Test button click handlers
   - Test status change detection

### Property-Based Tests

We will use **fast-check** library for property-based testing in TypeScript/JavaScript.

Configuration: Each property test should run a minimum of 100 iterations.

1. **Property 1: Announcement triggers on ready status**
   - Generate random order objects with various statuses
   - When status changes to "ready" or "completed" and audio is enabled
   - Verify announcement service is called with correct order number
   - **Feature: order-number-announcement, Property 1**

2. **Property 2: Volume affects playback**
   - Generate random volume values (0-100)
   - Set volume and create speech utterance
   - Verify utterance.volume equals input/100
   - **Feature: order-number-announcement, Property 2**

3. **Property 3: Zero volume prevents playback**
   - Generate random order numbers
   - Set volume to 0
   - Verify speechSynthesis.speak() is not called
   - **Feature: order-number-announcement, Property 3**

4. **Property 4: Settings persistence**
   - Generate random enabled states and volume values
   - Save to localStorage
   - Clear service instance
   - Reload and verify settings match
   - **Feature: order-number-announcement, Property 4**

5. **Property 5: Sequential announcement ordering**
   - Generate array of random order numbers (2-5 items)
   - Queue all announcements
   - Verify they play in correct order
   - **Feature: order-number-announcement, Property 5**

6. **Property 6: Uzbek language announcement format**
   - Generate random order numbers
   - Create announcement text
   - Verify format: "Buyurtma raqami [number]. Buyurtma raqami [number]."
   - **Feature: order-number-announcement, Property 6**

7. **Property 7: Browser support detection**
   - Mock speechSynthesis as undefined
   - Initialize service
   - Verify isSupported() returns false
   - Verify no errors thrown
   - **Feature: order-number-announcement, Property 7**

### Integration Tests

1. Test full flow: status update → announcement → audio playback
2. Test settings persistence across page reloads
3. Test multiple rapid status changes
4. Test audio controls interaction with actual Web Speech API

### Manual Testing Checklist

1. Test in different browsers (Chrome, Firefox, Safari, Edge)
2. Test with different system volumes
3. Test in noisy environment to verify audibility
4. Test Uzbek pronunciation quality
5. Test with screen readers for accessibility
6. Test on mobile devices

## Implementation Notes

### Web Speech API Considerations

1. **Browser Support**: 
   - Well supported in Chrome, Edge, Safari
   - Limited support in Firefox
   - Not supported in older browsers

2. **Voice Selection**:
   - Use `speechSynthesis.getVoices()` to find Uzbek voice
   - Fallback to default voice if Uzbek not available
   - Voice loading is asynchronous

3. **Rate and Pitch**:
   - Rate: 0.9 (slightly slower for clarity)
   - Pitch: 1.0 (normal)

4. **Language Code**:
   - Primary: 'uz-UZ' (Uzbek)
   - Fallback: 'ru-RU' (Russian, widely understood)

### UI/UX Considerations

1. **Visual Feedback**:
   - Show speaker icon when announcing
   - Animate icon during speech
   - Show checkmark on completion

2. **Accessibility**:
   - Ensure controls are keyboard accessible
   - Add ARIA labels for screen readers
   - Provide visual alternatives to audio

3. **Mobile Responsiveness**:
   - Ensure controls work on touch devices
   - Test volume slider on mobile
   - Consider mobile browser limitations

### Performance Considerations

1. **Queue Management**:
   - Limit queue size to prevent memory issues
   - Clear queue on page unload

2. **Event Listeners**:
   - Clean up speech synthesis event listeners
   - Prevent memory leaks

3. **LocalStorage**:
   - Minimize localStorage writes
   - Batch updates when possible

## Future Enhancements

1. **Multiple Language Support**: Allow switching between Uzbek, Russian, English
2. **Custom Voice Selection**: Let admin choose preferred voice
3. **Announcement History**: Log all announcements for review
4. **Sound Effects**: Add notification sound before announcement
5. **Remote Speakers**: Support for external speaker systems
6. **Announcement Templates**: Customizable announcement text
7. **Priority Queue**: Urgent orders announced first
8. **Volume Auto-Adjustment**: Adjust based on ambient noise
