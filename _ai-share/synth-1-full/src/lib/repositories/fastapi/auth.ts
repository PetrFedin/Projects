import type { AuthRepository, UserProfile } from '../types';
import { mockAuthRepository } from '../mock/auth';
import { fastApiService } from '../../fastapi-service';

export class FastApiAuthRepository implements AuthRepository {
  private listeners: Set<(user: UserProfile | null) => void> = new Set();

  constructor() {
    // Sync with mock repository for local state and transitions
    mockAuthRepository.onAuthStateChanged((user) => {
      this.notifyListeners(user);
    });
  }

  private notifyListeners(user: UserProfile | null) {
    this.listeners.forEach((callback) => callback(user));
  }

  async updateCurrentUser(patch: Partial<UserProfile>): Promise<UserProfile> {
    // First update local mock
    const updated = await mockAuthRepository.updateCurrentUser(patch);
    return updated;
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    console.log('FastApiAuthRepository: signIn', email);

    const API_TIMEOUT_MS = 4000;

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const tokenResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/login/access-token`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (tokenResponse.ok) {
        const { access_token } = await tokenResponse.json();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('syntha_access_token', access_token);
        }
        console.log('FastAPI login success, token stored');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.warn('FastAPI login timeout, using mock auth');
      } else {
        console.warn('FastAPI backend unreachable or login failed, using mock auth only', err);
      }
    }

    return await mockAuthRepository.signIn(email, password);
  }

  async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    return await mockAuthRepository.signUp(email, password, displayName);
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('syntha_access_token');
    return await mockAuthRepository.signOut();
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    return await mockAuthRepository.getCurrentUser();
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.add(callback);
    this.getCurrentUser().then(callback);
    return () => this.listeners.delete(callback);
  }
}

export const fastApiAuthRepository = new FastApiAuthRepository();
