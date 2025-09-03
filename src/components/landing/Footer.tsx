import React from 'react';
import { Shield } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Documentation', href: '#docs' },
    { label: 'API Reference', href: '#api' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Blog', href: '#blog' },
    { label: 'Press', href: '#press' },
  ],
  support: [
    { label: 'Help Center', href: '#help' },
    { label: 'Contact', href: '#contact' },
    { label: 'Status', href: '#status' },
    { label: 'Community', href: '#community' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Security', href: '#security' },
    { label: 'Compliance', href: '#compliance' },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-primary rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Zero-Trust Data Engine</span>
            </div>
            <p className="text-background/80 leading-relaxed mb-6">
              Secure, scalable database schema management with blockchain-backed storage.
              Build the future of data with confidence.
            </p>
            <div className="flex gap-4">
              {/* Social media icons would go here */}
              <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">TW</span>
              </div>
              <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">LI</span>
              </div>
              <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors cursor-pointer">
                <span className="text-xs font-bold">GH</span>
              </div>
            </div>
          </div>

          {/* Link sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-background mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/70 text-sm">
            <p className={"mt-10"}>Developed and maintained by eGA-RIDC. Copyright
              © {new Date().getFullYear()} eGA-RIDC</p>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-success text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};