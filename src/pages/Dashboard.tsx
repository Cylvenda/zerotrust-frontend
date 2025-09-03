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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest updates and changes to your infrastructure
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Database "e-commerce" updated
                </p>
                <p className="text-xs text-muted-foreground">
                  2 minutes ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  New API key generated
                </p>
                <p className="text-xs text-muted-foreground">
                  1 hour ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Schema validation completed
                </p>
                <p className="text-xs text-muted-foreground">
                  3 hours ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};