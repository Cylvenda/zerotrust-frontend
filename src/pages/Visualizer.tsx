import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Database, Table, Key, Link } from 'lucide-react';
import { useDatabaseStore } from '../store/database.store';

export const Visualizer: React.FC = () => {
  const { databaseId } = useParams<{ databaseId: string }>();
  const { databases } = useDatabaseStore();
  
  const database = databases.find(db => db.id === databaseId);

  if (!database) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Database className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Database not found</h3>
          <p className="text-muted-foreground">The requested database could not be found.</p>
        </div>
      </div>
    );
  }

  const getColumnIcon = (type: string) => {
    if (type.toLowerCase().includes('id') || type.toLowerCase().includes('uuid')) {
      return <Key className="w-4 h-4 text-warning" />;
    }
    return <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />;
  };

  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      'VARCHAR': 'bg-blue-100 text-blue-700 border-blue-200',
      'TEXT': 'bg-blue-100 text-blue-700 border-blue-200',
      'UUID': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'SERIAL': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'INTEGER': 'bg-green-100 text-green-700 border-green-200',
      'DECIMAL': 'bg-green-100 text-green-700 border-green-200',
      'TIMESTAMP': 'bg-purple-100 text-purple-700 border-purple-200',
      'BOOLEAN': 'bg-red-100 text-red-700 border-red-200',
    };
    
    const baseType = type.split('(')[0].toUpperCase();
    return typeMap[baseType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{database.name}</h1>
        <p className="text-muted-foreground">
          {database.description || 'Database schema visualization'}
        </p>
      </div>

      {/* Database info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Table className="w-4 h-4" />
              Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{database.tables.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted-foreground/30" />
              Columns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {database.tables.reduce((acc, table) => acc + table.columns.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Link className="w-4 h-4" />
              Relations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {database.tables.reduce((acc, table) => 
                acc + table.columns.filter(col => 
                  col.constraints?.includes('FOREIGN KEY')
                ).length, 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schema visualization */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Schema Structure</h2>
        
        {database.tables.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Table className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tables found</h3>
                <p className="text-muted-foreground">This database doesn't contain any tables yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {database.tables.map((table) => (
              <Card key={table.id} className="relative overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Table className="w-5 h-5 text-brand-primary" />
                    {table.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {table.columns.length} columns
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {table.columns.map((column, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {getColumnIcon(column.type)}
                        <div>
                          <div className="font-medium text-sm text-foreground">
                            {column.name}
                          </div>
                          {column.constraints && (
                            <div className="text-xs text-muted-foreground">
                              {column.constraints}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(column.type)}`}
                      >
                        {column.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>

                {/* Table metadata */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    Table
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Relationships visualization */}
      {database.tables.some(table => 
        table.columns.some(col => col.constraints?.includes('FOREIGN KEY'))
      ) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Table Relationships
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Visual representation of foreign key relationships
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Link className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Relationship diagram coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};