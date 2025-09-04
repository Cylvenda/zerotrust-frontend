import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  User, 
  Trash2, 
  Key,
  UserX,
  Crown
} from 'lucide-react';
import { useUsersStore } from '../store/users.store';
import { toast } from '../components/ui/use-toast';

export const AdminUsers: React.FC = () => {
  const { users, changeUserRole, removeUser, resetUserPassword } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.status === 'active' && 
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    changeUserRole(userId, newRole);
    toast({
      title: 'Role Updated',
      description: `${user.username} is now ${newRole === 'admin' ? 'an administrator' : 'a user'}.`,
    });
  };

  const handleRemoveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    removeUser(userId);
    toast({
      title: 'User Removed',
      description: `${user.username} has been removed from the system.`,
      variant: 'destructive',
    });
  };

  const handleResetPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    resetUserPassword(userId);
    toast({
      title: 'Password Reset',
      description: `Password reset email sent to ${user.email}.`,
    });
  };

  const getRoleBadge = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      return (
        <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <User className="w-3 h-3 mr-1" />
        User
      </Badge>
    );
  };

  const stats = {
    total: filteredUsers.length,
    admins: filteredUsers.filter(u => u.role === 'admin').length,
    users: filteredUsers.filter(u => u.role === 'user').length,
    active: filteredUsers.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-success rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No users to display'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center">
                         <span className="text-white font-semibold">
                           {user.username?.charAt(0)?.toUpperCase() || 'U'}
                         </span>
                       </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">{user.username}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(user.role)}
                          {user.lastLogin && (
                            <span className="text-xs text-muted-foreground">
                              Last login: {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Role toggle */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleChange(
                          user.id, 
                          user.role === 'admin' ? 'user' : 'admin'
                        )}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Demote
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-1" />
                            Promote
                          </>
                        )}
                      </Button>

                      {/* Reset password */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="w-4 h-4 mr-1" />
                        Reset
                      </Button>

                      {/* Remove user */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
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