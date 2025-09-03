import { create } from 'zustand';

export interface Column {
  name: string;
  type: string;
  constraints?: string;
  nullable?: boolean;
  defaultValue?: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  createdAt: string;
}

export interface Database {
  id: string;
  name: string;
  owner: string;
  tables: Table[];
  createdAt: string;
  description?: string;
}

interface DatabaseState {
  databases: Database[];
  currentDatabase: Database | null;
  addDatabase: (database: Database) => void;
  updateDatabase: (id: string, updates: Partial<Database>) => void;
  deleteDatabase: (id: string) => void;
  setCurrentDatabase: (database: Database | null) => void;
  addTable: (databaseId: string, table: Table) => void;
  updateTable: (databaseId: string, tableId: string, updates: Partial<Table>) => void;
  deleteTable: (databaseId: string, tableId: string) => void;
  getUserDatabases: (userId: string) => Database[];
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  databases: [
    {
      id: '1',
      name: 'E-commerce Platform',
      owner: 'admin',
      createdAt: '2024-01-15T10:30:00Z',
      description: 'Main e-commerce database with users, products, and orders',
      tables: [
        {
          id: '1-1',
          name: 'users',
          createdAt: '2024-01-15T10:30:00Z',
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
            { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL' },
            { name: 'name', type: 'VARCHAR(100)', nullable: false },
            { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' },
          ],
        },
        {
          id: '1-2',
          name: 'products',
          createdAt: '2024-01-15T11:00:00Z',
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
            { name: 'name', type: 'VARCHAR(200)', nullable: false },
            { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
            { name: 'description', type: 'TEXT' },
            { name: 'category_id', type: 'UUID', constraints: 'FOREIGN KEY' },
          ],
        },
      ],
    },
  ],
  currentDatabase: null,
  
  addDatabase: (database) =>
    set((state) => ({ databases: [...state.databases, database] })),
    
  updateDatabase: (id, updates) =>
    set((state) => ({
      databases: state.databases.map((db) =>
        db.id === id ? { ...db, ...updates } : db
      ),
    })),
    
  deleteDatabase: (id) =>
    set((state) => ({
      databases: state.databases.filter((db) => db.id !== id),
    })),
    
  setCurrentDatabase: (database) => set({ currentDatabase: database }),
  
  addTable: (databaseId, table) =>
    set((state) => ({
      databases: state.databases.map((db) =>
        db.id === databaseId
          ? { ...db, tables: [...db.tables, table] }
          : db
      ),
    })),
    
  updateTable: (databaseId, tableId, updates) =>
    set((state) => ({
      databases: state.databases.map((db) =>
        db.id === databaseId
          ? {
              ...db,
              tables: db.tables.map((table) =>
                table.id === tableId ? { ...table, ...updates } : table
              ),
            }
          : db
      ),
    })),
    
  deleteTable: (databaseId, tableId) =>
    set((state) => ({
      databases: state.databases.map((db) =>
        db.id === databaseId
          ? { ...db, tables: db.tables.filter((table) => table.id !== tableId) }
          : db
      ),
    })),
    
  getUserDatabases: (userId) => {
    const { databases } = get();
    return databases.filter((db) => db.owner === userId);
  },
}));