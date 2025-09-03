import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Key, Copy, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useApiStore } from '../../store/api.store';
import { toast } from '../ui/use-toast';

export const ApiKeysCard: React.FC = () => {
  const { apiKeys, generateApiKey, revokeApiKey, getActiveApiKeys } = useApiStore();
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const activeKeys = getActiveApiKeys();

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey = generateApiKey(newKeyName);
    setNewKeyName('');
    setShowNewKeyForm(false);
    
    toast({
      title: 'API Key Generated',
      description: `New API key "${newKeyName}" has been created successfully.`,
    });

    // Auto-show the new key
    setTimeout(() => {
      const newKeyId = apiKeys.find(key => key.key === newKey)?.id;
      if (newKeyId) {
        setVisibleKeys(prev => new Set([...prev, newKeyId]));
      }
    }, 100);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${label} has been copied to your clipboard.`,
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

  const handleRevokeKey = (keyId: string, keyName: string) => {
    revokeApiKey(keyId);
    toast({
      title: 'API Key Revoked',
      description: `API key "${keyName}" has been revoked.`,
      variant: 'destructive',
    });
  };

  const formatKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-brand-primary" />
          <CardTitle className="text-lg">API Keys</CardTitle>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewKeyForm(true)}
          disabled={showNewKeyForm}
        >
          <Plus className="w-4 h-4 mr-1" />
          Generate
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* New key form */}
        {showNewKeyForm && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <Input
              placeholder="Enter key name (e.g., Production Key)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateKey()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleGenerateKey} disabled={!newKeyName.trim()}>
                Generate Key
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNewKeyForm(false);
                  setNewKeyName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* API Keys list */}
        {activeKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No API keys generated yet</p>
            <p className="text-sm">Generate your first API key to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeKeys.map((apiKey) => {
              const isVisible = visibleKeys.has(apiKey.id);
              
              return (
                <div
                  key={apiKey.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{apiKey.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsed && (
                          <span className="ml-2">
                            • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-success border-success">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border">
                      {formatKey(apiKey.key, isVisible)}
                    </div>
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
                      onClick={() => handleRevokeKey(apiKey.id, apiKey.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Usage note */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">🔒 Security Note:</p>
          <p>Keep your API keys secure. Never share them publicly or commit them to version control.</p>
        </div>
      </CardContent>
    </Card>
  );
};