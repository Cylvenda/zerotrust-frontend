import React from 'react';
import { Shield, Database, Users, Key, Eye, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Zero Trust Security',
    description: 'Built-in security model that never trusts, always verifies. Every access request is authenticated and authorized.',
    color: 'text-brand-primary',
  },
  {
    icon: Database,
    title: 'Schema Visualization',
    description: 'Intuitive visual representation of your database schemas. Understand relationships and structure at a glance.',
    color: 'text-brand-secondary',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Granular permission system with admin and user roles. Control who can access and modify your data structures.',
    color: 'text-accent',
  },
  {
    icon: Key,
    title: 'API Management',
    description: 'Generate, manage, and revoke API keys with ease. Monitor usage and maintain security across all integrations.',
    color: 'text-warning',
  },
  {
    icon: Eye,
    title: 'Real-time Monitoring',
    description: 'Track database operations, user activities, and system performance with comprehensive dashboards.',
    color: 'text-destructive',
  },
  {
    icon: Zap,
    title: 'Blockchain Storage',
    description: 'Leverage blockchain technology for immutable data storage and verification. Trust through cryptographic proof.',
    color: 'text-success',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to manage
            <span className="block text-brand-primary">your data securely</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform provides all the tools and security features 
            you need to build, manage, and scale your database infrastructure.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-8 bg-gradient-card rounded-xl border border-border hover:border-brand-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-${feature.color}/10 to-${feature.color}/20 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '99.9%', label: 'Uptime Guarantee' },
            { value: '10M+', label: 'Queries Processed' },
            { value: '256-bit', label: 'Encryption Standard' },
            { value: '24/7', label: 'Expert Support' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};