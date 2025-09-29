/**
 * Authentication Context Provider
 * Handles user authentication, registration, profile management using Firebase Auth
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { User, AuthContextType } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          let userData;
          if (userDoc.exists()) {
            userData = userDoc.data();
          } else {
            // Create basic user data if document doesn't exist
            userData = {
              displayName: firebaseUser.displayName || 'User',
              role: 'user',
              bio: '',
              photoURL: firebaseUser.photoURL || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            // Try to create the document
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...userData,
                uid: firebaseUser.uid,
                email: firebaseUser.email,
              });
            } catch (error) {
              console.warn('Could not create user document:', error);
            }
          }

          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: userData.displayName,
            photoURL: userData.photoURL || '',
            bio: userData.bio || '',
            role: userData.role || 'user',
            createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date(),
            updatedAt: userData.updatedAt?.toDate ? userData.updatedAt.toDate() : new Date(),
          };
          
          setUser(user);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          console.log('User set:', user.email);
        } catch (error) {
          // Check if it's an offline error and log as warning instead of error
          if (error && typeof error === 'object' && 'code' in error && error.code === 'unavailable') {
            console.warn('Firestore temporarily unavailable (offline):', error);
          } else {
            console.error('Error fetching user data:', error);
          }
          
          // Create basic user from Firebase Auth
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL || '',
            bio: '',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          setUser(basicUser);
          await AsyncStorage.setItem('user', JSON.stringify(basicUser));
        }
      } else {
        console.log('No user, clearing state');
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user.email);
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: 'user' | 'organizer' = 'user') => {
    try {
      console.log('Attempting sign up for:', email);
      
      // Create user account
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created:', firebaseUser.email);
      
      // Update Firebase Auth profile
      await updateProfile(firebaseUser, { displayName });
      console.log('Profile updated');

      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        role,
        bio: '',
        photoURL: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('Firestore document created');
      
      return firebaseUser;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message);
    }
  };

  const updateProfileData = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(userRef, updateData);
      
      // Update local state
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile: updateProfileData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};