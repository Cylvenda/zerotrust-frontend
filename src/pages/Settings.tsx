import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { 
  Settings as SettingsIcon, 
  User, 
  Moon, 
  Key, 
  Shield,
  Save,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useApiStore } from '../store/api.store';
import { useThemeStore } from '../store/theme.store';
import { toast } from '../components/ui/use-toast';

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { apiKeys, generateApiKey, revokeApiKey } = useApiStore();
  const { theme } = useThemeStore();
  
  const [profile, setProfile] = useState({
    name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    email: user?.email || '',
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleProfileSave = () => {
    if (profile.name && profile.email) {
      updateUser(profile);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
    }
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    // Mock password change
    setPasswords({ current: '', new: '', confirm: '' });
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
    });
  };

  const handleGenerateApiKey = () => {
    if (!newApiKeyName.trim()) return;
    
    generateApiKey(newApiKeyName);
    setNewApiKeyName('');
    toast({
      title: 'API Key Generated',
      description: `New API key "${newApiKeyName}" has been created.`,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard.`,
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const formatKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {user?.role} Account
            </Badge>
            <Badge variant="outline" className="text-success border-success">
              Verified
            </Badge>
          </div>
          
          <Button onClick={handleProfileSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Theme</h4>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme. Currently set to {theme} mode.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                />
              </div>
            </div>
            <Button 
              onClick={handlePasswordChange}
              disabled={!passwords.current || !passwords.new || !passwords.confirm}
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generate new key */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Generate New API Key</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter key name (e.g., Production Key)"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateApiKey()}
              />
              <Button 
                onClick={handleGenerateApiKey}
                disabled={!newApiKeyName.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>

          {/* Existing keys */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Your API Keys</h4>
            {apiKeys.filter(key => key.status === 'active').length === 0 ? (
              <p className="text-muted-foreground">No API keys generated yet.</p>
            ) : (
              <div className="space-y-3">
                {apiKeys.filter(key => key.status === 'active').map((apiKey) => {
                  const isVisible = visibleKeys.has(apiKey.id);
                  
                  return (
                    <div key={apiKey.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-foreground">{apiKey.name}</h5>
                        <Badge variant="outline" className="text-success border-success">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border">
                          {formatKey(apiKey.key, isVisible)}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(apiKey.key, 'API key')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revokeApiKey(apiKey.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsed && (
                          <span> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
