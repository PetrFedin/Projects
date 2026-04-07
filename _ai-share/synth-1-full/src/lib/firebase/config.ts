import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is enabled (all required keys exist)
const isFirebaseEnabled = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

// Initialize Firebase only if enabled
let app;
let db: any = {};
let auth: any = {};
let storage: any = {};

if (isFirebaseEnabled) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    // Fallback to mock objects
    db = {};
    auth = {};
    storage = {};
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn("Firebase keys missing. Synth-1 running in MOCK mode.");
  }
}

export { app, db, auth, storage, isFirebaseEnabled };
