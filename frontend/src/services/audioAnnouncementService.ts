/**
 * Audio Announcement Service
 * Manages audio announcements for order numbers using Web Speech API
 */

export interface AudioAnnouncementConfig {
  enabled: boolean;
  volume: number; // 0-100
  language: string;
  rate: number; // Speech rate (0.1-10)
  pitch: number; // Voice pitch (0-2)
}

interface AnnouncementEvent {
  orderNumber: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

class AudioAnnouncementService {
  private static instance: AudioAnnouncementService;
  private config: AudioAnnouncementConfig;
  private queue: string[] = [];
  private isSpeaking: boolean = false;
  private eventLog: AnnouncementEvent[] = [];
  private readonly MAX_QUEUE_SIZE = 10;
  private readonly PAUSE_BETWEEN_ANNOUNCEMENTS = 2000; // 2 seconds

  private constructor() {
    // Load settings from localStorage or use defaults
    this.config = this.loadConfig();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AudioAnnouncementService {
    if (!AudioAnnouncementService.instance) {
      AudioAnnouncementService.instance = new AudioAnnouncementService();
    }
    return AudioAnnouncementService.instance;
  }

  /**
   * Load configuration from localStorage
   */
  private loadConfig(): AudioAnnouncementConfig {
    try {
      const enabled = localStorage.getItem('audioAnnouncementEnabled');
      const volume = localStorage.getItem('audioAnnouncementVolume');

      return {
        enabled: enabled !== null ? enabled === 'true' : true,
        volume: volume !== null ? parseInt(volume, 10) : 80,
        language: 'uz-UZ',
        rate: 0.9, // Slightly slower for clarity
        pitch: 1.0,
      };
    } catch (error) {
      console.warn('Failed to load audio settings from localStorage:', error);
      // Return defaults if localStorage is unavailable
      return {
        enabled: true,
        volume: 80,
        language: 'uz-UZ',
        rate: 0.9,
        pitch: 1.0,
      };
    }
  }

  /**
   * Save configuration to localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem('audioAnnouncementEnabled', String(this.config.enabled));
      localStorage.setItem('audioAnnouncementVolume', String(this.config.volume));
    } catch (error) {
      console.warn('Failed to save audio settings to localStorage:', error);
    }
  }

  /**
   * Check if Web Speech API is supported
   */
  public isSupported(): boolean {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  /**
   * Get current speaking status
   */
  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get current configuration
   */
  public getConfig(): AudioAnnouncementConfig {
    return { ...this.config };
  }

  /**
   * Enable or disable announcements
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  /**
   * Set volume (0-100)
   */
  public setVolume(volume: number): void {
    // Clamp volume to valid range
    this.config.volume = Math.max(0, Math.min(100, volume));
    this.saveConfig();
  }

  /**
   * Format announcement text
   */
  private formatAnnouncementText(orderNumber: string, language: string = 'uz-UZ'): string {
    const prefix = language === 'ru-RU' ? 'Номер заказа' : 'Buyurtma raqami';
    // Repeat twice for clarity
    return `${prefix} ${orderNumber}. ${prefix} ${orderNumber}.`;
  }

  /**
   * Set language for announcements
   */
  public setLanguage(language: string): void {
    this.config.language = language;
  }

  /**
   * Create and configure speech utterance
   */
  private createUtterance(text: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.language;
    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume / 100; // Convert 0-100 to 0-1

    return utterance;
  }

  /**
   * Process the announcement queue
   */
  private async processQueue(): Promise<void> {
    if (this.isSpeaking || this.queue.length === 0) {
      return;
    }

    this.isSpeaking = true;
    const orderNumber = this.queue.shift()!;

    try {
      await this.speakOrderNumber(orderNumber);
      this.logEvent(orderNumber, true);

      // Wait before processing next announcement
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.PAUSE_BETWEEN_ANNOUNCEMENTS));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to announce order number:', error);
      this.logEvent(orderNumber, false, errorMessage);
    } finally {
      this.isSpeaking = false;
      // Process next item in queue
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  /**
   * Speak the order number using Web Speech API
   */
  private speakOrderNumber(orderNumber: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Web Speech API is not supported'));
        return;
      }

      if (this.config.volume === 0) {
        // Silent mode - don't speak
        resolve();
        return;
      }

      const text = this.formatAnnouncementText(orderNumber, this.config.language);
      const utterance = this.createUtterance(text);

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Log announcement event
   */
  private logEvent(orderNumber: string, success: boolean, error?: string): void {
    const event: AnnouncementEvent = {
      orderNumber,
      timestamp: new Date(),
      success,
      error,
    };
    this.eventLog.push(event);
    console.log('Audio announcement event:', event);
  }

  /**
   * Announce an order number
   */
  public async announce(orderNumber: string, language: string = 'uz-UZ'): Promise<void> {
    if (!this.config.enabled) {
      console.log('Audio announcements are disabled');
      return;
    }

    if (!this.isSupported()) {
      throw new Error('Web Speech API is not supported in this browser');
    }

    // Update language for this announcement
    const previousLanguage = this.config.language;
    this.config.language = language;

    // Add to queue
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      console.warn('Announcement queue is full, dropping oldest item');
      this.queue.shift();
    }

    this.queue.push(orderNumber);
    this.processQueue();

    // Restore previous language
    this.config.language = previousLanguage;
  }

  /**
   * Test announcement with sample order number
   */
  public async testAnnouncement(): Promise<void> {
    await this.announce('1001');
  }

  /**
   * Get event log for debugging
   */
  public getEventLog(): AnnouncementEvent[] {
    return [...this.eventLog];
  }

  /**
   * Clear event log
   */
  public clearEventLog(): void {
    this.eventLog = [];
  }

  /**
   * Clear announcement queue (for testing)
   */
  public clearQueue(): void {
    this.queue = [];
    this.isSpeaking = false;
  }
}

// Export singleton instance
export const audioAnnouncementService = AudioAnnouncementService.getInstance();
export default audioAnnouncementService;
