/**
 * Firebase Service Layer
 * Centralized Firebase operations for data management
 */
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import { Event, User, Comment } from '../types';

export class FirebaseService {
  // User operations
  static async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Event operations
  static async getEvents(): Promise<Event[]> {
    try {
      const q = query(collection(db, 'events'), orderBy('dateTime', 'asc'));
      const snapshot = await getDocs(q);
      const events: Event[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          dateTime: data.dateTime.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Event);
      });
      
      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  }

  static async getEvent(eventId: string): Promise<Event | null> {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const data = eventDoc.data();
        return {
          id: eventDoc.id,
          ...data,
          dateTime: data.dateTime.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Event;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw error;
    }
  }

  static async createEvent(eventData: Omit<Event, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'events'), eventData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Comment operations
  static async getComments(eventId: string): Promise<Comment[]> {
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
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  static async addComment(commentData: Omit<Comment, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // File upload operations
  static async uploadImage(uri: string, path: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, path);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}