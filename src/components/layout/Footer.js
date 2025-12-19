import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Success Stories', href: '/success-stories' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Cookie Policy', href: '/cookies-policy' },
      { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
    resources: [
      { name: 'Browse Tasks', href: '/tasks' },
      { name: 'Create Account', href: '/register' },
      { name: 'Sign In', href: '/login' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'LinkedIn', href: '#', icon: 'in' },
    { name: 'Facebook', href: '#', icon: 'f' },
    { name: 'Instagram', href: '#', icon: '📷' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-secondary-900 to-primary-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-secondary-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img 
                  src="/logo task.jpg" 
                  alt="TaskApp Logo" 
                  className="w-12 h-12 rounded-xl object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary-500/20 to-secondary-500/20"></div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  TaskApp
                </span>
                <div className="text-xs text-white/60 font-medium">Professional Platform</div>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              The modern platform connecting exceptional professionals with amazing opportunities. 
              Secure, reliable, and trusted by thousands worldwide.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/60 hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-110 border border-white/20"
                  aria-label={social.name}
                >
                  <span className="text-sm font-semibold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary-300 text-sm transition-all duration-300 hover:translate-x-1 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary-300 text-sm transition-all duration-300 hover:translate-x-1 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary-300 text-sm transition-all duration-300 hover:translate-x-1 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary-300 text-sm transition-all duration-300 hover:translate-x-1 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-white/20 mt-12 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">SSL Encrypted</div>
                <div className="text-white/60 text-xs">Bank-level security</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xs">GDPR</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">GDPR Compliant</div>
                <div className="text-white/60 text-xs">Privacy protected</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xs">24/7</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">24/7 Support</div>
                <div className="text-white/60 text-xs">Always here to help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © {currentYear} TaskApp Inc. All rights reserved. Built with security and trust in mind.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-white/70">
              <span>🌍</span>
              <span>Available worldwide</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <span>💳</span>
              <span>Secure payments</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <span>⚡</span>
              <span>99.9% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;