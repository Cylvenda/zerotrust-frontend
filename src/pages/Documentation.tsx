import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, Database, Key, Globe, Code, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export const Documentation: React.FC = () => {
  const [apiKey] = useState('zt_live_1234567890abcdef');
  const [selectedEndpoint, setSelectedEndpoint] = useState('create-database');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const codeExamples = {
    'create-database': {
      title: 'Create Database',
      description: 'Create a new database with schema definition',
      method: 'POST',
      endpoint: '/api/v1/databases',
      code: `curl -X POST "https://api.zerotrust.dev/v1/databases" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my_database",
    "description": "User management system",
    "schema": {
      "tables": [
        {
          "name": "users",
          "columns": [
            {"name": "id", "type": "uuid", "primary": true},
            {"name": "email", "type": "varchar(255)", "unique": true},
            {"name": "created_at", "type": "timestamp"}
          ]
        }
      ]
    }
  }'`,
      response: `{
  "id": "db_123456789",
  "name": "my_database",
  "status": "created",
  "endpoint": "https://db_123456789.zerotrust.dev",
  "created_at": "2024-01-15T10:30:00Z"
}`
    },
    'get-schema': {
      title: 'Get Database Schema',
      description: 'Retrieve the complete schema of a database',
      method: 'GET',
      endpoint: '/api/v1/databases/{id}/schema',
      code: `curl -X GET "https://api.zerotrust.dev/v1/databases/db_123456789/schema" \\
  -H "Authorization: Bearer ${apiKey}"`,
      response: `{
  "database_id": "db_123456789",
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "id",
          "type": "uuid",
          "constraints": ["PRIMARY KEY", "NOT NULL"]
        },
        {
          "name": "email",
          "type": "varchar(255)",
          "constraints": ["UNIQUE", "NOT NULL"]
        }
      ],
      "indexes": [
        {"name": "idx_users_email", "columns": ["email"]}
      ]
    }
  ]
}`
    },
    'create-table': {
      title: 'Add Table to Database',
      description: 'Add a new table to an existing database',
      method: 'POST',
      endpoint: '/api/v1/databases/{id}/tables',
      code: `curl -X POST "https://api.zerotrust.dev/v1/databases/db_123456789/tables" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "posts",
    "columns": [
      {"name": "id", "type": "uuid", "primary": true},
      {"name": "title", "type": "varchar(255)", "required": true},
      {"name": "content", "type": "text"},
      {"name": "user_id", "type": "uuid", "foreign_key": "users.id"},
      {"name": "created_at", "type": "timestamp", "default": "now()"}
    ]
  }'`,
      response: `{
  "table_id": "tbl_987654321",
  "name": "posts",
  "database_id": "db_123456789",
  "status": "created",
  "column_count": 5
}`
    }
  };

  const quickStartSteps = [
    {
      title: "Create an Account",
      description: "Sign up and get your API key to start building",
      icon: Key,
      action: "Get Started"
    },
    {
      title: "Design Your Schema",
      description: "Use our visual editor or upload SQL files to define your database structure",
      icon: Database,
      action: "Open Editor"
    },
    {
      title: "Deploy & Connect",
      description: "Deploy your database and connect from any application using our APIs",
      icon: Globe,
      action: "View Docs"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
            <p className="text-muted-foreground">
              Learn how to integrate Zero Trust Data Engine into your applications
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get up and running with Zero Trust Data Engine in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      {step.action}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            Interactive examples and code snippets for our REST API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create-database">Create Database</TabsTrigger>
              <TabsTrigger value="get-schema">Get Schema</TabsTrigger>
              <TabsTrigger value="create-table">Add Table</TabsTrigger>
            </TabsList>

            {Object.entries(codeExamples).map(([key, example]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={example.method === 'GET' ? 'secondary' : 'default'}>
                      {example.method}
                    </Badge>
                    <h3 className="text-lg font-semibold">{example.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{example.description}</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {example.endpoint}
                  </code>
                </div>

                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Request */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Request</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.code, 'Request')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-foreground whitespace-pre">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Response</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.response, 'Response')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-foreground whitespace-pre">
                        <code>{example.response}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Try it out:</strong> Copy the request above and replace the API key with your own. 
                    You can generate API keys in your{' '}
                    <Button variant="link" className="p-0 h-auto text-primary" asChild>
                      <span>Settings page</span>
                    </Button>.
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* SDK and Libraries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>JavaScript SDK</CardTitle>
            <CardDescription>
              Official SDK for Node.js and browser applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">npm install @zerotrust/sdk</code>
            </div>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { ZeroTrust } from '@zerotrust/sdk';

const zt = new ZeroTrust('${apiKey}');

// Create database
const db = await zt.createDatabase({
  name: 'my_app',
  schema: { tables: [...] }
});

// Add table
await db.addTable({
  name: 'users',
  columns: [...]
});`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Python SDK</CardTitle>
            <CardDescription>
              Official SDK for Python applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">pip install zerotrust-python</code>
            </div>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{`from zerotrust import ZeroTrust

zt = ZeroTrust('${apiKey}')

# Create database
db = zt.create_database(
    name='my_app',
    schema={'tables': [...]}
)

# Add table
db.add_table(
    name='users',
    columns=[...]
)`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>
            Tips and recommendations for optimal performance and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Always use HTTPS for API requests</li>
                <li>• Store API keys securely in environment variables</li>
                <li>• Rotate API keys regularly</li>
                <li>• Use role-based access control for team members</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Performance</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Plan your schema carefully before creation</li>
                <li>• Use appropriate data types for columns</li>
                <li>• Add indexes for frequently queried fields</li>
                <li>• Monitor your API usage and rate limits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};