import { create } from 'zustand';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  category: 'database' | 'auth' | 'storage';
}

interface ApiState {
  apiKeys: ApiKey[];
  apiEndpoints: ApiEndpoint[];
  generateApiKey: (name: string) => string;
  revokeApiKey: (id: string) => void;
  getActiveApiKeys: () => ApiKey[];
}

export const useApiStore = create<ApiState>((set, get) => ({
  apiKeys: [
    {
      id: '1',
      name: 'Production Key',
      key: 'zt_live_sk_1a2b3c4d5e6f7g8h9i0j',
      createdAt: '2024-01-10T10:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z',
      status: 'active',
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'zt_test_sk_9i8h7g6f5e4d3c2b1a0z',
      createdAt: '2024-01-12T15:30:00Z',
      lastUsed: '2024-01-14T09:15:00Z',
      status: 'active',
    },
  ],
  
  apiEndpoints: [
    {
      id: '1',
      method: 'GET',
      url: '/api/v1/databases',
      description: 'List all databases',
      category: 'database',
    },
    {
      id: '2',
      method: 'POST',
      url: '/api/v1/databases',
      description: 'Create new database',
      category: 'database',
    },
    {
      id: '3',
      method: 'GET',
      url: '/api/v1/databases/{id}/schema',
      description: 'Get database schema',
      category: 'database',
    },
    {
      id: '4',
      method: 'POST',
      url: '/api/v1/auth/verify',
      description: 'Verify API key',
      category: 'auth',
    },
    {
      id: '5',
      method: 'GET',
      url: '/api/v1/storage/files',
      description: 'List storage files',
      category: 'storage',
    },
  ],
  
  generateApiKey: (name) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name,
      key: `zt_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    set((state) => ({
      apiKeys: [...state.apiKeys, newKey],
    }));
    
    return newKey.key;
  },
  
  revokeApiKey: (id) =>
    set((state) => ({
      apiKeys: state.apiKeys.map((key) =>
        key.id === id ? { ...key, status: 'revoked' as const } : key
      ),
    })),
    
  getActiveApiKeys: () => {
    const { apiKeys } = get();
    return apiKeys.filter((key) => key.status === 'active');
  },
}));