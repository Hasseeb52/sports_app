# Code Architecture Map

This document provides a comprehensive overview of the Local Sports Hub codebase structure, explaining the purpose and relationships of each file and component.

## 📁 Project Structure Overview

```
local-sports-hub/
├── app/                          # Expo Router navigation structure
├── components/                   # Reusable UI components
├── contexts/                     # React Context providers for state management
├── hooks/                        # Custom React hooks
├── services/                     # Business logic and API services
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions and helpers
├── database-export/              # Sample data for development
├── firebase.config.ts            # Firebase project configuration
└── Documentation files
```

## 🎯 Core Application Files

### firebase.config.ts
**Purpose**: Centralized Firebase project configuration
**Key Functions**:
- Initializes Firebase app instance
- Configures Auth with AsyncStorage persistence
- Exports Firestore, Storage, and Functions instances
- **Critical**: Requires actual Firebase project credentials

```typescript
// TODO: Replace with actual Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  // ... other config values
};
```

## 📱 Navigation Structure (app/)

### app/_layout.tsx
**Purpose**: Root layout wrapper with authentication logic
**Architecture Role**: 
- Wraps entire app with AuthProvider and EventsProvider
- Handles authentication-based navigation routing
- Shows auth screens for unauthenticated users
- Shows main app for authenticated users
**Key Features**:
- Context provider integration
- Conditional screen rendering based on auth state
- Framework ready hook integration

### app/(tabs)/_layout.tsx
**Purpose**: Main tab navigation configuration
**Components**:
- Home (Events Feed)
- Create Event (Organizers only)
- My Events
- Profile
**Dynamic Behavior**:
- Create tab only visible for organizer role
- Uses Lucide icons for consistent design

### app/(tabs)/index.tsx (Events Feed)
**Purpose**: Main events browsing interface
**Key Features**:
- Real-time events list with infinite scroll capability
- Search functionality across event titles, descriptions, locations
- Advanced filtering (type, difficulty, date range)
- RSVP functionality with optimistic updates
- Offline support with cached data
**State Management**: 
- Uses EventsContext for data
- Local state for search and filters
- Loading states for better UX

### app/(tabs)/create.tsx (Create Event)
**Purpose**: Event creation form for organizers
**Security**: Role-based access control (organizers only)
**Form Features**:
- Multi-step form with validation
- Image picker integration
- Date/time selection
- Location input (geocoding ready)
- Type and difficulty selection
**Validation**: Comprehensive client-side validation before submission

### app/(tabs)/events.tsx (My Events)
**Purpose**: User's personal events dashboard
**Tab System**:
- RSVPed Events: Events user has joined
- Organized Events: Events user has created (organizers only)
**Features**:
- Filtered event lists based on user relationship
- Event status indicators (upcoming vs past)
- Quick navigation to event details

### app/(tabs)/profile.tsx (User Profile)
**Purpose**: User account management and statistics
**Features**:
- Editable profile information (name, bio)
- Activity statistics (events joined, organized, upcoming)
- Recent events preview
- Account actions (sign out)
**Edit Mode**: Toggle between view and edit modes with inline editing

## 🔐 Authentication Screens

### app/auth/login.tsx
**Purpose**: User authentication interface
**Security Features**:
- Email/password validation
- Password visibility toggle
- Secure credential handling through Firebase
- Error handling without credential exposure
**UX**: Keyboard-aware layout with proper focus management

### app/auth/register.tsx
**Purpose**: New user registration
**Unique Features**:
- Role selection (User vs Organizer)
- Password confirmation validation
- Email format validation
- Account type explanation
**Security**: Input sanitization and validation before submission

## 📄 Event Details

### app/event/[id].tsx
**Purpose**: Comprehensive event information display
**Real-time Features**:
- Live RSVP count updates
- Real-time comment system with instant updates
- Dynamic event data refresh
**Functionality**:
- RSVP toggle with optimistic updates
- Comment posting and display
- Google Maps integration for location
- Host information display
**Navigation**: Deep linking support for direct event access

## 🧩 Reusable Components

### components/EventCard.tsx
**Purpose**: Standardized event display component
**Props Interface**:
```typescript
{
  event: Event;
  onPress: () => void;
  onRSVP: () => void;
  isRSVPed: boolean;
  showHost?: boolean;
}
```
**Design Features**:
- Responsive card layout
- Event type and difficulty badges
- Image handling with fallback
- Status indicators (upcoming/past)
**Reusability**: Used in multiple screens with consistent appearance

### components/FilterModal.tsx
**Purpose**: Advanced filtering interface for events
**Filter Types**:
- Event type (Yoga, Run, Match)
- Difficulty levels (9 different levels)
- Date range selection
**UX Features**:
- Modal presentation style
- Clear all filters option
- Real-time filter preview
- Date picker integration

### components/PickerModal.tsx
**Purpose**: Generic option selection modal
**Reusability**: Used for event type, difficulty, and other selection tasks
**Features**:
- Customizable title and options
- Selected state indication
- Scroll support for long option lists

## 🏪 State Management (contexts/)

### contexts/AuthContext.tsx
**Purpose**: Centralized authentication state management
**Responsibilities**:
- Firebase Auth integration
- User profile management
- Authentication state persistence
- Error handling for auth operations
**Security Features**:
- Automatic token refresh
- Secure local storage caching
- Proper cleanup on signout
**Integration**: Provides user data to entire application

### contexts/EventsContext.tsx
**Purpose**: Events data management and operations
**Real-time Features**:
- Firestore onSnapshot listeners for live updates
- Real-time RSVP count updates
- Live comment synchronization
**Offline Support**:
- AsyncStorage caching of events
- Graceful offline handling
- Data persistence across app sessions
**Operations**:
- CRUD operations for events
- RSVP management
- Comment system
- Search and filtering logic

## 🛠 Business Logic (services/)

### services/firebaseService.ts
**Purpose**: Abstracted Firebase operations layer
**Architecture Benefit**: Centralizes all Firebase database operations
**Methods**:
- User management (get, update)
- Event operations (CRUD)
- Comment management
- File upload handling
**Error Handling**: Consistent error handling and logging across all operations
**Type Safety**: Full TypeScript integration with custom types

## 📝 Type Definitions (types/)

### types/index.ts
**Purpose**: Comprehensive TypeScript type definitions
**Key Interfaces**:
- `User`: Complete user profile structure
- `Event`: Full event data model
- `Comment`: Comment structure with user info
- `AuthContextType` & `EventsContextType`: Context interface definitions
**Benefits**: 
- Type safety across entire application
- IntelliSense support in development
- Compile-time error detection
- Self-documenting code structure

## 🔧 Utility Functions

### utils/validation.ts
**Purpose**: Input validation and sanitization utilities
**Functions**:
- Email format validation
- Password strength checking
- User input sanitization
- Form field validation
**Security**: Prevents malicious input and ensures data integrity

### utils/dateHelpers.ts
**Purpose**: Date formatting and manipulation utilities
**Functions**:
- Human-readable date formatting
- Event duration formatting
- Time until event calculations
- Date range generation
**UX**: Consistent date display throughout application

## 📊 Sample Data

### database-export/sample-data.json
**Purpose**: Comprehensive sample data for development and testing
**Contents**:
- 5 sample users (mix of roles)
- 10 sample events (matching requirements exactly)
- Sample comments with realistic interactions
**Usage**: Import into Firebase for immediate working demo
**Data Quality**: Production-ready sample data with realistic content

## 🔧 Configuration Files

### package.json
**Purpose**: Project dependencies and scripts
**Key Dependencies**:
- React Native & Expo ecosystem
- Firebase SDK
- Navigation libraries
- UI components (Lucide icons)
**Scripts**: Development, building, and testing commands

### tsconfig.json
**Purpose**: TypeScript compiler configuration
**Features**:
- Strict type checking enabled
- Path mapping for clean imports (@/ alias)
- Expo-specific TypeScript setup

### app.json
**Purpose**: Expo project configuration
**Key Settings**:
- App metadata (name, version, icons)
- Platform-specific configurations
- Plugin configurations (router, fonts, etc.)
**Web Support**: Configured for web deployment

## 🏗 Architecture Patterns

### Component Architecture
- **Functional Components**: All components use modern React hooks
- **TypeScript Props**: Strict typing for all component interfaces
- **Context Pattern**: Centralized state management without Redux complexity
- **Container/Presentational**: Logic separation between contexts and UI components

### Data Flow Pattern
```
Firebase (Source of Truth)
    ↓
Contexts (State Management)
    ↓
Screens (Business Logic)
    ↓
Components (UI Presentation)
```

### Security Architecture
- **Authentication Layer**: Firebase Auth with token-based security
- **Authorization Layer**: Role-based permissions in contexts
- **Data Layer**: Firestore security rules enforce backend security
- **Client Layer**: Input validation and sanitization

## 🔄 Real-time Architecture

### Event Updates
1. **Firestore onSnapshot** listeners in EventsContext
2. **Automatic re-renders** when data changes
3. **Optimistic updates** for immediate UI feedback
4. **Conflict resolution** handled by Firebase

### Comment System
1. **Real-time listeners** per event
2. **Instant comment posting** with optimistic updates
3. **Multi-device synchronization** through Firebase
4. **Automatic cleanup** on component unmount

## 🎯 Performance Optimizations

### Memory Management
- **Proper listener cleanup** in useEffect cleanup functions
- **Component unmounting** removes all subscriptions
- **Selective re-rendering** through proper dependency arrays

### Data Efficiency
- **Firestore query optimization** with proper indexing
- **Local caching** reduces network requests
- **Image optimization** through Expo image handling
- **Lazy loading** of non-critical components

## 🧪 Testing Architecture

### Unit Testing Strategy
- **Authentication flow testing**: Login/logout scenarios
- **RSVP functionality testing**: State changes and persistence
- **Validation testing**: Form inputs and edge cases
- **Utility function testing**: Date helpers and validation functions

### Integration Testing
- **Context integration**: Verify provider data flow
- **Navigation testing**: Screen transitions and deep linking
- **Firebase integration**: Mock Firebase for consistent testing
- **Real-time feature testing**: Comment and RSVP synchronization

---

## 🚀 Development Workflow

### File Creation Order for New Features
1. **Types** (types/index.ts): Define data structures
2. **Service** (services/): Implement business logic
3. **Context** (contexts/): Add state management
4. **Components** (components/): Create reusable UI elements
5. **Screens** (app/): Implement user interfaces
6. **Tests**: Add unit and integration tests

### Code Standards
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **File Organization**: Logical grouping with clear separation of concerns
- **Import Order**: External libraries, internal components, types, utils
- **Error Handling**: Consistent error handling patterns throughout

This code map serves as a guide for understanding, maintaining, and extending the Local Sports Hub application. Each component is designed with modularity and reusability in mind, making it easy to modify or add new features.