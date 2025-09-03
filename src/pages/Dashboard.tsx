import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ApiKeysCard } from '../components/dashboard/ApiKeysCard';
import { ApiEndpointsCard } from '../components/dashboard/ApiEndpointsCard';
import { Database, Table, Plus, Upload, Eye } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useDatabaseStore } from '../store/database.store';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { databases } = useDatabaseStore();
  const navigate = useNavigate();

  const userDatabases = user?.role === 'admin' 
    ? databases 
    : databases.filter(db => db.owner === user?.id);

  const stats = {
    totalDatabases: userDatabases.length,
    totalTables: userDatabases.reduce((acc, db) => acc + db.tables.length, 0),
    activeConnections: 12,
    apiCalls: 1247,
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Manage your database schemas and monitor your Zero Trust infrastructure.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Databases</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDatabases}</div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'Total across all users' : 'Your databases'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTables}</div>
            <p className="text-xs text-muted-foreground">
              Across all databases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <div className="h-2 w-2 bg-success rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apiCalls}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys */}
        <ApiKeysCard />

        {/* API Endpoints */}
        <ApiEndpointsCard />
      </div>

      {/* Databases section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Your Databases</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your database schemas and structures
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Schema
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Database
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {userDatabases.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No databases yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first database to start managing schemas
              </p>
              <div className="flex gap-2 justify-center">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Database
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Schema
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userDatabases.map((database) => (
                <div
                  key={database.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{database.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {database.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {database.tables.length} tables
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/app/visualizer/${database.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {new Date(database.createdAt).toLocaleDateString()}</span>
                    {user?.role === 'admin' && (
                      <span>Owner: {database.owner}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};