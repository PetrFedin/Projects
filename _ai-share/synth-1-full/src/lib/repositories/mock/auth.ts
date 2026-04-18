/**
 * Mock Auth Repository
 * Uses localStorage for persistence, ready to be replaced with Firebase Auth
 */

import type { AuthRepository, UserProfile } from '../types';

const STORAGE_KEY = 'syntha_auth_user';
const USERS_STORAGE_KEY = 'syntha_users_v34'; // Complete overhaul of identity sync

// Mock users database
const getUsers = (): Map<string, { email: string; password: string; profile: UserProfile }> => {
  if (typeof window === 'undefined') {
    return new Map();
  }
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log('--- LOADING MOCK USERS v34 ---');
      return new Map(parsed);
    } catch (e) {
      localStorage.removeItem(USERS_STORAGE_KEY);
      return getUsers();
    }
  }

  // FORCE CLEAR OLD SESSIONS ON VERSION BUMP
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('syntha_profile_avatar');
  console.log('--- INITIALIZING CLEAN DEMO DATABASE v34 ---');

  // Define default demo users with strict consistency
  const defaultUsers = new Map([
    // CLIENTS
    [
      'elena.petrova@example.com',
      {
        email: 'elena.petrova@example.com',
        password: 'password123',
        profile: {
          uid: 'client-elena-petrova-001',
          email: 'elena.petrova@example.com',
          displayName: 'Елена Петрова',
          nickname: 'elenapetrova',
          photoURL:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          loyaltyPlan: 'premium',
          loyaltyPoints: 18450,
          roles: ['client'],
        },
      },
    ],

    // ADMINS (HQ)
    [
      'admin@syntha.ai',
      {
        email: 'admin@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'admin-001',
          email: 'admin@syntha.ai',
          displayName: 'Александр Волков',
          nickname: 'aleksandr_volkov',
          partnerName: 'Syntha Global HQ',
          photoURL:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          loyaltyPlan: 'base',
          loyaltyPoints: 0,
          roles: ['platform_admin'],
          activeOrganizationId: 'org-hq-001',
          organizations: [
            { organizationId: 'org-hq-001', roleInOrg: 'admin', permissions: ['all'] },
          ],
          team: [
            {
              id: 'admin-001',
              firstName: 'Александр',
              lastName: 'Волков',
              email: 'admin@syntha.ai',
              role: 'Chief Architect',
              avatar:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
              nickname: 'aleksandr_volkov',
            },
            {
              id: 'admin-002',
              firstName: 'Дмитрий',
              lastName: 'Соколов',
              email: 'dmitry@syntha.ai',
              role: 'Technical Director',
              avatar:
                'https://images.unsplash.com/photo-1519085360753-afdab827c52f?w=400&h=400&fit=crop',
              nickname: 'dmitry_sokolov',
            },
          ],
        },
      },
    ],
    [
      'dmitry@syntha.ai',
      {
        email: 'dmitry@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'admin-002',
          email: 'dmitry@syntha.ai',
          displayName: 'Дмитрий Соколов',
          nickname: 'dmitry_sokolov',
          partnerName: 'Syntha Global HQ',
          photoURL:
            'https://images.unsplash.com/photo-1519085360753-afdab827c52f?w=400&h=400&fit=crop',
          loyaltyPlan: 'base',
          loyaltyPoints: 0,
          roles: ['platform_admin'],
          activeOrganizationId: 'org-hq-001',
          organizations: [
            { organizationId: 'org-hq-001', roleInOrg: 'admin', permissions: ['all'] },
          ],
          team: [
            {
              id: 'admin-001',
              firstName: 'Александр',
              lastName: 'Волков',
              email: 'admin@syntha.ai',
              role: 'Chief Architect',
              avatar:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
              nickname: 'aleksandr_volkov',
            },
            {
              id: 'admin-002',
              firstName: 'Дмитрий',
              lastName: 'Соколов',
              email: 'dmitry@syntha.ai',
              role: 'Technical Director',
              avatar:
                'https://images.unsplash.com/photo-1519085360753-afdab827c52f?w=400&h=400&fit=crop',
              nickname: 'dmitry_sokolov',
            },
          ],
        },
      },
    ],

    // BRANDS
    [
      'brand@syntha.ai',
      {
        email: 'brand@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'brand-001',
          email: 'brand@syntha.ai',
          displayName: 'Виктория Белова',
          nickname: 'viktoria_belova',
          partnerName: 'Syntha Lab',
          photoURL:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
          loyaltyPlan: 'premium',
          loyaltyPoints: 5000,
          roles: ['brand_admin'],
          activeOrganizationId: 'org-brand-001',
          organizations: [
            {
              organizationId: 'org-brand-001',
              roleInOrg: 'admin',
              permissions: { canViewFinances: true, canEditPLM: true, canManageTeam: true },
            },
            {
              organizationId: 'org-brand-002',
              roleInOrg: 'admin',
              permissions: { canViewFinances: true, canEditPLM: true, canManageTeam: true },
            },
          ],
          team: [
            {
              id: 'brand-001',
              firstName: 'Виктория',
              lastName: 'Белова',
              email: 'brand@syntha.ai',
              role: 'Creative Director',
              avatar:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
              nickname: 'viktoria_belova',
            },
            {
              id: 'brand-002',
              firstName: 'Артем',
              lastName: 'Новиков',
              email: 'artem@synthalab.com',
              role: 'Lead Designer',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
              nickname: 'artem_novikov',
            },
          ],
        },
      },
    ],
    [
      'artem@synthalab.com',
      {
        email: 'artem@synthalab.com',
        password: 'password123',
        profile: {
          uid: 'brand-002',
          email: 'artem@synthalab.com',
          displayName: 'Артем Новиков',
          nickname: 'artem_novikov',
          partnerName: 'Syntha Lab',
          photoURL:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          loyaltyPlan: 'base',
          loyaltyPoints: 500,
          roles: ['brand_admin'],
          activeOrganizationId: 'org-brand-001',
          organizations: [
            {
              organizationId: 'org-brand-001',
              roleInOrg: 'member',
              permissions: { canViewAnalytics: true },
            },
          ],
          team: [
            {
              id: 'brand-001',
              firstName: 'Виктория',
              lastName: 'Белова',
              email: 'brand@syntha.ai',
              role: 'Creative Director',
              avatar:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
              nickname: 'viktoria_belova',
            },
            {
              id: 'brand-002',
              firstName: 'Артем',
              lastName: 'Новиков',
              email: 'artem@synthalab.com',
              role: 'Lead Designer',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
              nickname: 'artem_novikov',
            },
          ],
        },
      },
    ],
    [
      'nordic@syntha.ai',
      {
        email: 'nordic@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'nordic-001',
          email: 'nordic@syntha.ai',
          displayName: 'Эрик Норд',
          nickname: 'erik_nord',
          partnerName: 'Nordic Wool',
          photoURL:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
          loyaltyPlan: 'premium',
          loyaltyPoints: 3500,
          roles: ['brand_admin'],
          activeOrganizationId: 'org-brand-002',
          organizations: [
            {
              organizationId: 'org-brand-002',
              roleInOrg: 'admin',
              permissions: { canViewFinances: true },
            },
          ],
        },
      },
    ],
    [
      'silk@syntha.ai',
      {
        email: 'silk@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'silk-001',
          email: 'silk@syntha.ai',
          displayName: 'Лейла Саиди',
          nickname: 'leila_silk',
          partnerName: 'Silk Road Atelier',
          photoURL:
            'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop',
          loyaltyPlan: 'premium',
          loyaltyPoints: 2000,
          roles: ['brand_admin'],
          activeOrganizationId: 'org-brand-003',
          organizations: [
            {
              organizationId: 'org-brand-003',
              roleInOrg: 'admin',
              permissions: { canViewFinances: true },
            },
          ],
        },
      },
    ],

    // FACTORIES / MANUFACTURERS
    [
      'factory@syntha.ai',
      {
        email: 'factory@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'factory-001',
          email: 'factory@syntha.ai',
          displayName: 'Андрей Кузнецов',
          nickname: 'andrey_kuznetsov',
          partnerName: 'Nord Tex Production',
          photoURL:
            'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop',
          loyaltyPlan: 'comfort',
          loyaltyPoints: 1200,
          roles: ['manufacturer'],
          activeOrganizationId: 'org-factory-001',
          organizations: [
            {
              organizationId: 'org-factory-001',
              roleInOrg: 'admin',
              permissions: { canManageProduction: true },
            },
          ],
        },
      },
    ],
    [
      'southern@syntha.ai',
      {
        email: 'southern@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'factory-002',
          email: 'southern@syntha.ai',
          displayName: 'Михаил Петров',
          nickname: 'mikhail_stitch',
          partnerName: 'Southern Stitch',
          photoURL:
            'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
          loyaltyPlan: 'comfort',
          loyaltyPoints: 1500,
          roles: ['manufacturer'],
          activeOrganizationId: 'org-factory-002',
          organizations: [
            {
              organizationId: 'org-factory-002',
              roleInOrg: 'admin',
              permissions: { canManageProduction: true },
            },
          ],
        },
      },
    ],

    // SUPPLIERS
    [
      'supplier@syntha.ai',
      {
        email: 'supplier@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'supplier-001',
          email: 'supplier@syntha.ai',
          displayName: 'Сергей Васильев',
          nickname: 'sergey_vasiliev',
          partnerName: 'Silk Road Materials',
          photoURL:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
          loyaltyPlan: 'base',
          loyaltyPoints: 800,
          roles: ['supplier'],
          activeOrganizationId: 'org-supplier-001',
          organizations: [
            {
              organizationId: 'org-supplier-001',
              roleInOrg: 'admin',
              permissions: { canManageSourcing: true },
            },
          ],
        },
      },
    ],

    // DISTRIBUTORS
    [
      'dist@syntha.ai',
      {
        email: 'dist@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'dist-001',
          email: 'dist@syntha.ai',
          displayName: 'Игорь Степанов',
          partnerName: 'Fashion Forward Logistics',
          nickname: 'igor_stepanov',
          photoURL:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
          loyaltyPlan: 'comfort',
          loyaltyPoints: 2500,
          roles: ['distributor'],
          activeOrganizationId: 'org-dist-001',
          organizations: [
            {
              organizationId: 'org-dist-001',
              roleInOrg: 'admin',
              permissions: { canManageLogistics: true },
            },
          ],
        },
      },
    ],

    // SHOPS
    [
      'shop@syntha.ai',
      {
        email: 'shop@syntha.ai',
        password: 'password123',
        profile: {
          uid: 'shop-001',
          email: 'shop@syntha.ai',
          displayName: 'Ольга Лебедева',
          nickname: 'olga_lebedeva',
          partnerName: 'Tsvetnoy Central Market',
          photoURL:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
          loyaltyPlan: 'premium',
          loyaltyPoints: 12000,
          roles: ['shop'],
          activeOrganizationId: 'org-shop-001',
          organizations: [
            {
              organizationId: 'org-shop-001',
              roleInOrg: 'admin',
              permissions: { canManageRetail: true },
            },
          ],
          team: [
            {
              id: 'shop-001',
              firstName: 'Ольга',
              lastName: 'Лебедева',
              email: 'shop@syntha.ai',
              role: 'Boutique Owner',
              avatar:
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
              nickname: 'olga_lebedeva',
            },
            {
              id: 'shop-002',
              firstName: 'Наталья',
              lastName: 'Котова',
              email: 'natalia@tsvetnoy.ru',
              role: 'Store Manager',
              avatar:
                'https://images.unsplash.com/photo-1598550874175-4d0fe4a24424?w=400&h=400&fit=crop',
              nickname: 'natalia_kotova',
            },
          ],
        },
      },
    ],
    [
      'natalia@tsvetnoy.ru',
      {
        email: 'natalia@tsvetnoy.ru',
        password: 'password123',
        profile: {
          uid: 'shop-002',
          email: 'natalia@tsvetnoy.ru',
          displayName: 'Наталья Котова',
          nickname: 'natalia_kotova',
          partnerName: 'Tsvetnoy Central Market',
          photoURL:
            'https://images.unsplash.com/photo-1598550874175-4d0fe4a24424?w=400&h=400&fit=crop',
          loyaltyPlan: 'comfort',
          loyaltyPoints: 1200,
          roles: ['shop'],
          activeOrganizationId: 'org-shop-001',
          organizations: [
            {
              organizationId: 'org-shop-001',
              roleInOrg: 'member',
              permissions: { canViewAnalytics: true },
            },
          ],
          team: [
            {
              id: 'shop-001',
              firstName: 'Ольга',
              lastName: 'Лебедева',
              email: 'shop@syntha.ai',
              role: 'Boutique Owner',
              avatar:
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
              nickname: 'olga_lebedeva',
            },
            {
              id: 'shop-002',
              firstName: 'Наталья',
              lastName: 'Котова',
              email: 'natalia@tsvetnoy.ru',
              role: 'Store Manager',
              avatar:
                'https://images.unsplash.com/photo-1598550874175-4d0fe4a24424?w=400&h=400&fit=crop',
              nickname: 'natalia_kotova',
            },
          ],
        },
      },
    ],
  ]);

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(Array.from(defaultUsers.entries())));
  return defaultUsers;
};

const saveUsers = (
  users: Map<string, { email: string; password: string; profile: UserProfile }>
) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(Array.from(users.entries())));
};

export class MockAuthRepository implements AuthRepository {
  private listeners: Set<(user: UserProfile | null) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const currentUser = this.getCurrentUserSync();
      setTimeout(() => {
        const user = this.getCurrentUserSync();
        this.notifyListeners(user);
      }, 100);
    }
  }

  private getCurrentUserSync(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  private notifyListeners(user: UserProfile | null) {
    this.listeners.forEach((callback) => callback(user));
  }

  async updateCurrentUser(patch: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (typeof window === 'undefined') throw new Error('Cannot update user on server');

    const current = this.getCurrentUserSync();
    if (!current) throw new Error('No authenticated user');

    const updated: UserProfile = { ...current, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const users = getUsers();
    const entry = users.get(current.email.toLowerCase());
    if (entry) {
      users.set(current.email.toLowerCase(), { ...entry, profile: updated });
      saveUsers(users);
    }

    this.notifyListeners(updated);
    return updated;
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (typeof window === 'undefined') throw new Error('Cannot sign in on server');

    const users = getUsers();
    const user = users.get(email.toLowerCase());

    if (!user || user.password !== password) {
      console.error(
        'SignIn failed for:',
        email,
        'Reason:',
        !user ? 'User not found' : 'Invalid password'
      );
      throw new Error('Неверный email или пароль');
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('syntha_profile_avatar');
      localStorage.removeItem(STORAGE_KEY);
    }

    const profileToSave = JSON.parse(JSON.stringify(user.profile));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
    this.notifyListeners(user.profile);

    return user.profile;
  }

  async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (typeof window === 'undefined') throw new Error('Cannot sign up on server');

    const users = getUsers();
    if (users.has(email.toLowerCase()))
      throw new Error('Пользователь с таким email уже существует');

    const newProfile: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      photoURL: 'https://picsum.photos/seed/user-avatar/100/100',
      loyaltyPlan: 'base',
      loyaltyPoints: 0,
    };

    users.set(email.toLowerCase(), { email, password, profile: newProfile });
    saveUsers(users);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    this.notifyListeners(newProfile);
    return newProfile;
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners(null);
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.getCurrentUserSync();
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.getCurrentUserSync());
    return () => this.listeners.delete(callback);
  }
}

export const mockAuthRepository = new MockAuthRepository();
