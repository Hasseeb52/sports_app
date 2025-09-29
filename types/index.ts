// TypeScript type definitions for the Local Sports Hub app
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  role: 'user' | 'organizer';
  createdAt: Date;
  updatedAt: Date;
}

export type EventType = 'Yoga' | 'Run' | 'Match';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Ages' | 'Low' | 'High' | 'Mixed' | 'Amateur' | 'Family & Kids';

export interface EventLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  dateTime: Date;
  duration: number; // in minutes
  location: EventLocation;
  difficulty: DifficultyLevel;
  imageURL?: string;
  description: string;
  shortDescription: string;
  hostId: string;
  hostName: string;
  rsvpCount: number;
  rsvpList: string[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: Date;
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role?: 'user' | 'organizer') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface EventsContextType {
  events: Event[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'hostId' | 'hostName' | 'rsvpCount' | 'rsvpList' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  toggleRSVP: (eventId: string) => Promise<void>;
  addComment: (eventId: string, content: string) => Promise<void>;
  getComments: (eventId: string) => Promise<Comment[]>;
}