/**
 * Date Helper Functions Unit Tests
 * Tests for date formatting and manipulation utilities
 */
import {
  formatEventDate,
  formatEventDuration,
  isEventUpcoming,
  isEventToday,
  getTimeUntilEvent,
  createDateRange
} from '../utils/dateHelpers';

describe('Date Helper Functions', () => {
  // Mock current date for consistent testing
  const mockCurrentDate = new Date('2025-01-15T10:00:00Z');
  
  beforeAll(() => {
    // Mock Date.now() to return consistent time
    jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentDate.getTime());
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  describe('formatEventDate', () => {
    test('formats today events correctly', () => {
      const todayEvent = new Date('2025-01-15T18:00:00Z');
      const formatted = formatEventDate(todayEvent);
      expect(formatted).toMatch(/^Today at \d{1,2}:\d{2}\s?(AM|PM)$/);
    });
    
    test('formats tomorrow events correctly', () => {
      const tomorrowEvent = new Date('2025-01-16T18:00:00Z');
      const formatted = formatEventDate(tomorrowEvent);
      expect(formatted).toMatch(/^Tomorrow at \d{1,2}:\d{2}\s?(AM|PM)$/);
    });
    
    test('formats this week events with day name', () => {
      const thisWeekEvent = new Date('2025-01-18T18:00:00Z'); // Saturday
      const formatted = formatEventDate(thisWeekEvent);
      expect(formatted).toMatch(/^Saturday at \d{1,2}:\d{2}\s?(AM|PM)$/);
    });
    
    test('formats distant future events with full date', () => {
      const futureEvent = new Date('2025-03-15T18:00:00Z');
      const formatted = formatEventDate(futureEvent);
      expect(formatted).toMatch(/^Mar \d{1,2} at \d{1,2}:\d{2}\s?(AM|PM)$/);
    });
    
    test('includes year for events in different year', () => {
      const nextYearEvent = new Date('2026-01-15T18:00:00Z');
      const formatted = formatEventDate(nextYearEvent);
      expect(formatted).toMatch(/^Jan \d{1,2}, 2026 at \d{1,2}:\d{2}\s?(AM|PM)$/);
    });
  });
  
  describe('formatEventDuration', () => {
    test('formats minutes only for durations under 1 hour', () => {
      expect(formatEventDuration(30)).toBe('30min');
      expect(formatEventDuration(45)).toBe('45min');
      expect(formatEventDuration(59)).toBe('59min');
    });
    
    test('formats hours only for exact hour durations', () => {
      expect(formatEventDuration(60)).toBe('1h');
      expect(formatEventDuration(120)).toBe('2h');
      expect(formatEventDuration(180)).toBe('3h');
    });
    
    test('formats hours and minutes for mixed durations', () => {
      expect(formatEventDuration(90)).toBe('1h 30min');
      expect(formatEventDuration(135)).toBe('2h 15min');
      expect(formatEventDuration(195)).toBe('3h 15min');
    });
    
    test('handles edge cases', () => {
      expect(formatEventDuration(0)).toBe('0min');
      expect(formatEventDuration(1)).toBe('1min');
      expect(formatEventDuration(61)).toBe('1h 1min');
    });
  });
  
  describe('isEventUpcoming', () => {
    test('returns true for future events', () => {
      const futureEvent = new Date(mockCurrentDate.getTime() + 3600000); // 1 hour later
      expect(isEventUpcoming(futureEvent)).toBe(true);
    });
    
    test('returns false for past events', () => {
      const pastEvent = new Date(mockCurrentDate.getTime() - 3600000); // 1 hour ago
      expect(isEventUpcoming(pastEvent)).toBe(false);
    });
    
    test('returns false for current time', () => {
      const currentEvent = new Date(mockCurrentDate.getTime());
      expect(isEventUpcoming(currentEvent)).toBe(false);
    });
    
    test('handles edge case of events starting in 1 minute', () => {
      const soonEvent = new Date(mockCurrentDate.getTime() + 60000); // 1 minute later
      expect(isEventUpcoming(soonEvent)).toBe(true);
    });
  });
  
  describe('isEventToday', () => {
    test('returns true for events today', () => {
      const todayMorning = new Date('2025-01-15T06:00:00Z');
      const todayEvening = new Date('2025-01-15T22:00:00Z');
      
      expect(isEventToday(todayMorning)).toBe(true);
      expect(isEventToday(todayEvening)).toBe(true);
    });
    
    test('returns false for events on other days', () => {
      const yesterday = new Date('2025-01-14T18:00:00Z');
      const tomorrow = new Date('2025-01-16T18:00:00Z');
      
      expect(isEventToday(yesterday)).toBe(false);
      expect(isEventToday(tomorrow)).toBe(false);
    });
    
    test('handles timezone differences correctly', () => {
      // Test with different timezone but same date
      const sameDateDifferentTime = new Date('2025-01-15T23:59:59Z');
      expect(isEventToday(sameDateDifferentTime)).toBe(true);
    });
  });
  
  describe('getTimeUntilEvent', () => {
    test('returns correct time for events starting soon', () => {
      const in30Minutes = new Date(mockCurrentDate.getTime() + 30 * 60 * 1000);
      expect(getTimeUntilEvent(in30Minutes)).toBe('30m');
    });
    
    test('returns hours and minutes for longer durations', () => {
      const in2Hours30Min = new Date(mockCurrentDate.getTime() + (2.5 * 60 * 60 * 1000));
      expect(getTimeUntilEvent(in2Hours30Min)).toBe('2h 30m');
    });
    
    test('returns days and hours for events days away', () => {
      const in2Days3Hours = new Date(mockCurrentDate.getTime() + (2 * 24 + 3) * 60 * 60 * 1000);
      expect(getTimeUntilEvent(in2Days3Hours)).toBe('2d 3h');
    });
    
    test('handles past events', () => {
      const pastEvent = new Date(mockCurrentDate.getTime() - 3600000);
      expect(getTimeUntilEvent(pastEvent)).toBe('Event has started');
    });
    
    test('handles events starting exactly now', () => {
      const nowEvent = new Date(mockCurrentDate.getTime());
      expect(getTimeUntilEvent(nowEvent)).toBe('Event has started');
    });
  });
  
  describe('createDateRange', () => {
    test('creates correct date range for given days', () => {
      const startDate = new Date('2025-01-15T00:00:00Z');
      const range = createDateRange(startDate, 5);
      
      expect(range).toHaveLength(5);
      expect(range[0].toDateString()).toBe(startDate.toDateString());
      expect(range[4].toDateString()).toBe(new Date('2025-01-19T00:00:00Z').toDateString());
    });
    
    test('handles single day range', () => {
      const startDate = new Date('2025-01-15T00:00:00Z');
      const range = createDateRange(startDate, 1);
      
      expect(range).toHaveLength(1);
      expect(range[0].toDateString()).toBe(startDate.toDateString());
    });
    
    test('handles empty range', () => {
      const startDate = new Date('2025-01-15T00:00:00Z');
      const range = createDateRange(startDate, 0);
      
      expect(range).toHaveLength(0);
    });
    
    test('preserves time while incrementing dates', () => {
      const startDate = new Date('2025-01-15T14:30:00Z');
      const range = createDateRange(startDate, 3);
      
      range.forEach(date => {
        expect(date.getHours()).toBe(14);
        expect(date.getMinutes()).toBe(30);
      });
    });
    
    test('handles month boundaries correctly', () => {
      const endOfMonth = new Date('2025-01-30T00:00:00Z');
      const range = createDateRange(endOfMonth, 5);
      
      expect(range).toHaveLength(5);
      expect(range[0].getDate()).toBe(30);
      expect(range[1].getDate()).toBe(31);
      expect(range[2].getDate()).toBe(1); // February 1st
      expect(range[2].getMonth()).toBe(1); // February (0-indexed)
    });
  });
});

describe('Date Helper Integration Tests', () => {
  test('combines multiple helpers for event display', () => {
    const event = {
      dateTime: new Date('2025-01-16T18:00:00Z'), // Tomorrow
      duration: 90 // 1.5 hours
    };
    
    const dateDisplay = formatEventDate(event.dateTime);
    const durationDisplay = formatEventDuration(event.duration);
    const isUpcoming = isEventUpcoming(event.dateTime);
    const timeUntil = getTimeUntilEvent(event.dateTime);
    
    expect(dateDisplay).toMatch(/^Tomorrow at/);
    expect(durationDisplay).toBe('1h 30min');
    expect(isUpcoming).toBe(true);
    expect(timeUntil).toMatch(/^\d+h \d+m$/);
  });
  
  test('handles edge cases consistently across helpers', () => {
    const edgeCases = [
      new Date('2025-01-15T10:00:00Z'), // Exactly now
      new Date('2025-01-15T10:00:01Z'), // 1 second from now
      new Date('2025-01-15T09:59:59Z'), // 1 second ago
    ];
    
    edgeCases.forEach(eventDate => {
      const upcoming = isEventUpcoming(eventDate);
      const timeUntil = getTimeUntilEvent(eventDate);
      
      if (upcoming) {
        expect(timeUntil).not.toBe('Event has started');
      } else {
        expect(timeUntil).toBe('Event has started');
      }
    });
  });
});