import axios from 'axios';
import { AuthUser } from '../store/auth.store';
import { Database, Table } from '../store/database.store';

// Create axios instance
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// Mock data for demonstration
const mockUsers = [
  { id: 'admin', email: 'admin@zerotrust.dev', name: 'Admin User', role: 'admin' as const },
  { id: 'user1', email: 'john@company.com', name: 'John Developer', role: 'user' as const },
];

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },
  
  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: AuthUser = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      role: 'user',
    };
    
    return newUser;
  },
};

// Database API
export const databaseApi = {
  getDatabases: async (userId?: string): Promise<Database[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock implementation
    return [];
  },
  
  createDatabase: async (database: Omit<Database, 'id' | 'createdAt'>): Promise<Database> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      ...database,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
  },
  
  uploadSchema: async (file: File, onProgress?: (progress: number) => void): Promise<Database> => {
    // Simulate file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress?.(i);
    }
    
    // Mock parsing the uploaded file
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    
    return {
      id: Math.random().toString(36).substring(7),
      name: fileName,
      owner: 'current-user',
      tables: [
        {
          id: '1',
          name: 'example_table',
          createdAt: new Date().toISOString(),
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
            { name: 'name', type: 'VARCHAR(100)', nullable: false },
            { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      description: `Database created from ${file.name}`,
    };
  },
};

// Table API
export const tableApi = {
  createTable: async (databaseId: string, table: Omit<Table, 'id' | 'createdAt'>): Promise<Table> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      ...table,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
  },
  
  parseSql: async (sql: string): Promise<Table> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock SQL parsing
    const tableNameMatch = sql.match(/CREATE TABLE\s+(\w+)/i);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'new_table';
    
    return {
      id: Math.random().toString(36).substring(7),
      name: tableName,
      createdAt: new Date().toISOString(),
      columns: [
        { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' },
      ],
    };
  },
};

export default api;