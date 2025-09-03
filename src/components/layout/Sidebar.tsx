import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Database, Eye, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: Database,
    roles: ['admin', 'user'],
  },
  {
    label: 'Visualizer',
    href: '/app/visualizer',
    icon: Eye,
    roles: ['admin', 'user'],
  },
  {
    label: 'Users',
    href: '/app/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    href: '/app/settings',
    icon: Settings,
    roles: ['admin', 'user'],
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(user?.role || 'user')
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Zero Trust</h1>
            <p className="text-xs text-muted-foreground">Data Engine</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};