import { create } from 'zustand';
import { AuthUser, Role } from './auth.store';

export interface AppUser extends AuthUser {
  status: 'active' | 'removed';
  lastLogin?: string;
  createdAt: string;
}

interface UsersState {
  users: AppUser[];
  loading: boolean;
  addUser: (user: AppUser) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  removeUser: (id: string) => void;
  changeUserRole: (id: string, role: Role) => void;
  resetUserPassword: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [
    {
      id: 'admin',
      first_name: 'Admin',
      last_name: 'test',
      username: 'usertest',
      email: 'admin@zerotrust.dev',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-15T10:30:00Z',
    },
    {
      id: 'user1',
      first_name: 'John',
      last_name: 'Developer',
      username: 'usertest01',
      email: 'john@company.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-10T00:00:00Z',
      lastLogin: '2024-01-14T15:20:00Z',
    },
    {
      id: 'user2',
      first_name: 'Sarah Designer',
      last_name: 'Designer',
      username: 'usertest02',
      email: 'sarah@company.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-12T00:00:00Z',
      lastLogin: '2024-01-13T09:45:00Z',
    },
  ],
  loading: false,

  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, status: 'removed' as const } : user
      ),
    })),

  changeUserRole: (id, role) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, role } : user
      ),
    })),

  resetUserPassword: (id) => {
    // Mock password reset - in real app this would trigger email
    console.log(`Password reset initiated for user ${id}`);
  },

  setLoading: (loading) => set({ loading }),
}));