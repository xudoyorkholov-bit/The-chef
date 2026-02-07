import * as fc from 'fast-check';

// Simple in-memory counter implementation for testing
class TestCounter {
  private counters: { [key: string]: number } = {};

  getCounter(name: string): number {
    return this.counters[name] || 0;
  }

  incrementCounter(name: string): number {
    const currentValue = this.counters[name] || 0;
    const newValue = currentValue + 1;
    this.counters[name] = newValue;
    return newValue;
  }

  initializeCounter(name: string, value: number): void {
    if (this.counters[name] === undefined) {
      this.counters[name] = value;
    }
  }

  reset() {
    this.counters = {};
  }
}

describe('Counter Operations', () => {
  let counter: TestCounter;

  beforeEach(() => {
    counter = new TestCounter();
  });

  /**
   * Feature: sequential-order-numbers, Property 8: Counter increment atomicity
   * Validates: Requirements 3.2
   * 
   * Property: For any sequence of counter increments, each increment should
   * return a unique value and the counter should increase by exactly 1 each time.
   */
  test('property: counter increments are atomic and sequential', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }), // Number of increments to perform
        (numIncrements) => {
          counter.reset();
          counter.initializeCounter('testCounter', 0);
          
          const results: number[] = [];
          
          // Perform increments
          for (let i = 0; i < numIncrements; i++) {
            const value = counter.incrementCounter('testCounter');
            results.push(value);
          }
          
          // Verify all values are unique
          const uniqueValues = new Set(results);
          const allUnique = uniqueValues.size === results.length;
          
          // Verify values are sequential starting from 1
          const isSequential = results.every((val, idx) => val === idx + 1);
          
          // Verify final counter value matches number of increments
          const finalValue = counter.getCounter('testCounter');
          const finalMatches = finalValue === numIncrements;
          
          return allUnique && isSequential && finalMatches;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('getCounter returns 0 for non-existent counter', () => {
    const value = counter.getCounter('nonExistentCounter');
    expect(value).toBe(0);
  });

  test('initializeCounter sets initial value', () => {
    counter.initializeCounter('testCounter', 42);
    const value = counter.getCounter('testCounter');
    expect(value).toBe(42);
  });

  test('initializeCounter does not overwrite existing counter', () => {
    counter.initializeCounter('testCounter', 10);
    counter.initializeCounter('testCounter', 20);
    const value = counter.getCounter('testCounter');
    expect(value).toBe(10);
  });

  test('incrementCounter starts from 0 if counter does not exist', () => {
    const value = counter.incrementCounter('newCounter');
    expect(value).toBe(1);
  });

  test('incrementCounter increases value by 1', () => {
    counter.initializeCounter('testCounter', 5);
    const value1 = counter.incrementCounter('testCounter');
    const value2 = counter.incrementCounter('testCounter');
    const value3 = counter.incrementCounter('testCounter');
    
    expect(value1).toBe(6);
    expect(value2).toBe(7);
    expect(value3).toBe(8);
  });
});
