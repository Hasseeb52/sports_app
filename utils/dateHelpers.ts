/**
 * Date Helper Functions
 * Utilities for date formatting and manipulation
 */

export const formatEventDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const eventDate = new Date(date);
  
  // Check if it's today
  if (eventDate.toDateString() === today.toDateString()) {
    return `Today at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if it's tomorrow
  if (eventDate.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if it's this week
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilEvent <= 7 && daysUntilEvent > 0) {
    const dayName = eventDate.toLocaleDateString([], { weekday: 'long' });
    return `${dayName} at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Default format
  return eventDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  }) + ` at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const formatEventDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

export const isEventUpcoming = (eventDate: Date): boolean => {
  return eventDate.getTime() > Date.now();
};

export const isEventToday = (eventDate: Date): boolean => {
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
};

export const getTimeUntilEvent = (eventDate: Date): string => {
  const now = new Date();
  const timeDiff = eventDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return 'Event has started';
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

export const createDateRange = (startDate: Date, days: number): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};