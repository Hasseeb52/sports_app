// Firebase Configuration
// TODO: Replace with your actual Firebase project configuration
// Get these values from Firebase Console > Project Settings > General > Your apps
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgP3QUKhvRvNDbxy4MvtpPycKjPTWtIZs",
  authDomain: "sports-app-9e572.firebaseapp.com",
  projectId: "sports-app-9e572",
  storageBucket: "sports-app-9e572.firebasestorage.app",
  messagingSenderId: "418110981173",
  appId: "1:418110981173:web:c9e80c354348d1bece1d7c",
  measurementId: "G-1MZDYZ1Z31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
export const auth = Platform.OS === 'web' 
  ? initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    })
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

// Initialize other Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;