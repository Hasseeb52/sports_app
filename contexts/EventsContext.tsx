/**
 * Events Context Provider
 * Handles event management, RSVP functionality, comments, and offline caching
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove, where, getDocs, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import { Event, Comment, EventsContextType } from '../types';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load cached events on startup
  useEffect(() => {
    loadCachedEvents();
  }, []);

  // Real-time events subscription
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('dateTime', 'asc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const eventsData: Event[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            ...data,
            dateTime: data.dateTime.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as Event);
        });
        
        setEvents(eventsData);
        setLoading(false);
        
        // Cache events
        cacheEvents(eventsData);
      },
      (error) => {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loadCachedEvents = async () => {
    try {
      const cachedEvents = await AsyncStorage.getItem('events');
      if (cachedEvents) {
        const parsed = JSON.parse(cachedEvents).map((event: any) => ({
          ...event,
          dateTime: new Date(event.dateTime),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));
        setEvents(parsed);
      }
    } catch (error) {
      console.error('Error loading cached events:', error);
    }
  };

  const cacheEvents = async (eventsData: Event[]) => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(eventsData));
    } catch (error) {
      console.error('Error caching events:', error);
    }
  };

  const refreshEvents = async () => {
    setLoading(true);
    // The real-time listener will handle the refresh
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'hostId' | 'hostName' | 'rsvpCount' | 'rsvpList' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User must be logged in');
    if (user.role !== 'organizer') throw new Error('Only organizers can create events');

    try {
      const newEvent = {
        ...eventData,
        hostId: user.uid,
        hostName: user.displayName,
        rsvpCount: 0,
        rsvpList: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'events'), newEvent);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const toggleRSVP = async (eventId: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const eventRef = doc(db, 'events', eventId);
      const event = events.find(e => e.id === eventId);
      
      if (!event) throw new Error('Event not found');

      const isRSVPed = event.rsvpList.includes(user.uid);

      if (isRSVPed) {
        // Remove RSVP
        await updateDoc(eventRef, {
          rsvpList: arrayRemove(user.uid),
          rsvpCount: event.rsvpCount - 1,
          updatedAt: new Date(),
        });
      } else {
        // Add RSVP
        await updateDoc(eventRef, {
          rsvpList: arrayUnion(user.uid),
          rsvpCount: event.rsvpCount + 1,
          updatedAt: new Date(),
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const addComment = async (eventId: string, content: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const commentData = {
        eventId,
        userId: user.uid,
        userName: user.displayName,
        userPhotoURL: user.photoURL || '',
        content,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'comments'), commentData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const getComments = async (eventId: string): Promise<Comment[]> => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('eventId', '==', eventId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const comments: Comment[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Comment);
      });

      return comments;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const value: EventsContextType = {
    events,
    loading,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleRSVP,
    addComment,
    getComments,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};