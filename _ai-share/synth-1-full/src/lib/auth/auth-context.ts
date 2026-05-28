'use client';

import { createContext, useContext } from 'react';
import type { UserProfile } from '@/lib/types';
import type { FastApiSessionProfile } from '@/lib/fastapi-session-profile';

export interface AuthContextType {
  user: UserProfile | null;
  profile: FastApiSessionProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<UserProfile>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
