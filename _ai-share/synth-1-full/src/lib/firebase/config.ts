/**
 * Firebase — lazy init (Wave J/H): без import-time warn и без SDK в Workshop2 PG-only.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import {
  isFirebaseConfigured,
  isWorkshop2PgOnlyMode,
  shouldEmitFirebaseMockWarn,
} from '@/lib/firebase/firebase-env';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = isFirebaseConfigured();

let __synthFirebaseMockWarned = false;
let cachedApp: FirebaseApp | undefined;
let cachedDb: Firestore | Record<string, never> | undefined;
let cachedAuth: Auth | Record<string, never> | undefined;
let cachedStorage: FirebaseStorage | Record<string, never> | undefined;

function emitMockWarnOnce(): void {
  if (__synthFirebaseMockWarned) return;
  if (!shouldEmitFirebaseMockWarn()) return;
  if (typeof window === 'undefined') return;
  __synthFirebaseMockWarned = true;
  console.warn('Firebase keys missing. Synth-1 running in MOCK mode.');
}

function ensureFirebaseApp(): FirebaseApp | null {
  if (isWorkshop2PgOnlyMode()) return null;
  if (!isFirebaseEnabled) {
    emitMockWarnOnce();
    return null;
  }
  if (cachedApp) return cachedApp;
  try {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return cachedApp;
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return null;
  }
}

/** Lazy Firestore — PG-only и MOCK без import-time side effects. */
export function getFirebaseDb(): Firestore | Record<string, never> {
  if (isWorkshop2PgOnlyMode()) return {};
  if (cachedDb) return cachedDb;
  const app = ensureFirebaseApp();
  if (!app) {
    cachedDb = {};
    return cachedDb;
  }
  cachedDb = getFirestore(app);
  return cachedDb;
}

function getFirebaseAuth(): Auth | Record<string, never> {
  if (isWorkshop2PgOnlyMode()) return {};
  if (cachedAuth) return cachedAuth;
  const app = ensureFirebaseApp();
  if (!app) {
    cachedAuth = {};
    return cachedAuth;
  }
  cachedAuth = getAuth(app);
  return cachedAuth;
}

function getFirebaseStorage(): FirebaseStorage | Record<string, never> {
  if (isWorkshop2PgOnlyMode()) return {};
  if (cachedStorage) return cachedStorage;
  const app = ensureFirebaseApp();
  if (!app) {
    cachedStorage = {};
    return cachedStorage;
  }
  cachedStorage = getStorage(app);
  return cachedStorage;
}

/** @deprecated prefer getFirebaseDb() — kept for legacy repositories. */
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    return Reflect.get(getFirebaseDb() as object, prop);
  },
});

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return Reflect.get(getFirebaseAuth() as object, prop);
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    return Reflect.get(getFirebaseStorage() as object, prop);
  },
});

export const app = ensureFirebaseApp();
