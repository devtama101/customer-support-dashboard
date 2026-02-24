'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, LayoutDashboard, Ticket, Users, BarChart3, Settings, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/dashboard/tickets', icon: Ticket },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Performance', href: '/dashboard/performance', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Widget Demo', href: '/dashboard/widget-demo', icon: Code },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MessageSquare className="w-6 h-6" />
          SupportHub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {navigation.map((item) => {
          // Special handling for dashboard - only exact match
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors',
                isActive
                  ? 'bg-gray-800 border-l-4 border-blue-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 border-l-4 border-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - version */}
      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
