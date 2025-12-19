import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UsersIcon as UsersIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  ChartPieIcon as ChartPieIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const AdminNavigation = ({ className = '' }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      description: 'Main admin dashboard'
    },
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      description: 'Platform statistics'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
      iconSolid: UsersIconSolid,
      description: 'User management'
    },
    {
      name: 'Tasks',
      href: '/admin/tasks',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
      description: 'Task management'
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CurrencyDollarIcon,
      iconSolid: CurrencyDollarIconSolid,
      description: 'Payment management'
    },
    {
      name: 'Manual Payments',
      href: '/admin/manual-payments',
      icon: CurrencyDollarIcon,
      iconSolid: CurrencyDollarIconSolid,
      description: 'Process manual payments'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartPieIcon,
      iconSolid: ChartPieIconSolid,
      description: 'Advanced analytics'
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
      description: 'Detailed reports'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      description: 'System settings'
    },
    {
      name: 'Debug',
      href: '/debug/admin',
      icon: ShieldCheckIcon,
      iconSolid: ShieldCheckIconSolid,
      description: 'Debug tools'
    }
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {navigationItems.map((item) => {
        const active = isActive(item.href);
        const Icon = active ? item.iconSolid : item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                active
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Icon
              className={`
                flex-shrink-0 -ml-1 mr-3 h-5 w-5
                ${
                  active
                    ? 'text-primary-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                }
              `}
            />
            <span className="truncate">{item.name}</span>
            {active && (
              <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNavigation;