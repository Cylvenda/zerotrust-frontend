import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Globe, Copy, Database, Shield, Archive } from 'lucide-react';
import { useApiStore } from '../../store/api.store';
import { toast } from '../ui/use-toast';

const methodColors = {
  GET: 'bg-success/10 text-success border-success/20',
  POST: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  PUT: 'bg-warning/10 text-warning border-warning/20',
  DELETE: 'bg-destructive/10 text-destructive border-destructive/20',
};

const categoryIcons = {
  database: Database,
  auth: Shield,
  storage: Archive,
};

export const ApiEndpointsCard: React.FC = () => {
  const { apiEndpoints } = useApiStore();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(`https://api.zerotrust.dev${text}`);
    toast({
      title: 'Copied to clipboard',
      description: `${label} endpoint has been copied to your clipboard.`,
    });
  };

  const groupedEndpoints = apiEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, typeof apiEndpoints>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-secondary" />
          <CardTitle className="text-lg">API Endpoints</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Available REST API endpoints for your integrations
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(groupedEndpoints).map(([category, endpoints]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-medium text-foreground capitalize">{category}</h4>
              </div>
              
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={methodColors[endpoint.method]}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono text-foreground">
                          {endpoint.url}
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(endpoint.url, endpoint.description)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Base URL info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Base URL:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard('', 'Base URL')}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <code className="text-sm font-mono text-muted-foreground">
            https://api.zerotrust.dev
          </code>
        </div>

        {/* Documentation link */}
        <div className="text-center">
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            View Full Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};