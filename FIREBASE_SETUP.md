# Firebase Configuration Setup Guide

## Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon (Settings) → Project Settings
4. Scroll down to "Your apps" section
5. Click on the web app icon `</>`
6. Copy the `firebaseConfig` object

## Step 2: Update the Config File

Open `firebase.config.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  // Replace these with your actual values:
  apiKey: "your-api-key-here",                    // Replace with your apiKey
  authDomain: "your-project-id.firebaseapp.com", // Replace with your authDomain
  projectId: "your-project-id",                   // Replace with your projectId
  storageBucket: "your-project-id.appspot.com",  // Replace with your storageBucket
  messagingSenderId: "123456789",                 // Replace with your messagingSenderId
  appId: "1:123456789:web:abcdef123456789"       // Replace with your appId
};
```

## Step 3: Enable Firebase Services

In your Firebase Console:

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode (for now)

3. **Storage**:
   - Go to Storage
   - Get started with default settings

## Step 4: Import Sample Data

1. Go to Firestore Database in Firebase Console
2. Create these collections manually or import from `database-export/sample-data.json`:
   - `users`
   - `events` 
   - `comments`

## Step 5: Test the Connection

After updating the config, run:
```bash
npm run dev
```

The app should now connect to your Firebase project!

## Troubleshooting

If you see errors:
- Double-check all config values are correct
- Make sure Authentication and Firestore are enabled
- Check browser console for specific error messages