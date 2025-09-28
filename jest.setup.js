// Jest setup file for Local Sports Hub
// Configures testing environment and mocks

import 'react-native-gesture-handler/jestSetup';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  initializeAuth: jest.fn(() => ({})),
  getReactNativePersistence: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  setDoc: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(() => ({})),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() => 
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }]
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  scheduleNotificationAsync: jest.fn(),
  cancelNotificationAsync: jest.fn(),
}));

// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
    Linking: {
      openURL: jest.fn(),
    },
  };
});

// Mock Lucide React Native icons
jest.mock('lucide-react-native', () => ({
  Home: 'Home',
  Calendar: 'Calendar',
  User: 'User',
  Plus: 'Plus',
  Search: 'Search',
  Filter: 'Filter',
  MapPin: 'MapPin',
  Clock: 'Clock',
  Users: 'Users',
  MessageCircle: 'MessageCircle',
  Send: 'Send',
  ExternalLink: 'ExternalLink',
  Star: 'Star',
  Settings: 'Settings',
  LogOut: 'LogOut',
  Edit3: 'Edit3',
  Save: 'Save',
  X: 'X',
  Check: 'Check',
  Mail: 'Mail',
  Lock: 'Lock',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Shield: 'Shield',
  Camera: 'Camera',
  FileText: 'FileText',
  Award: 'Award',
}));

// Mock date-time picker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
);

// Setup fake timers for date testing
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-01-15T10:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});