'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { MessageSquare, LayoutDashboard, Ticket, Users, BarChart3, Settings, Code, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPusherClient } from '@/lib/pusher-client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/dashboard/tickets', icon: Ticket, showBadge: true },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Performance', href: '/dashboard/performance', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Widget Demo', href: '/dashboard/widget-demo', icon: Code },
];

interface SidebarProps {
  teamId: string;
}

export function Sidebar({ teamId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to new ticket notifications
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher || !teamId) return;

    const channel = pusher.subscribe(`presence-team-${teamId}`);

    channel.bind('new-ticket', (data: { ticketId: string }) => {
      // Only increment if not on tickets page
      if (!pathname.startsWith('/dashboard/tickets')) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`presence-team-${teamId}`);
    };
  }, [teamId, pathname]);

  // Clear badge when navigating to tickets page
  useEffect(() => {
    if (pathname.startsWith('/dashboard/tickets')) {
      setUnreadCount(0);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirectTo: '/login' });
  };

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
                'flex items-center gap-3 px-6 py-3 transition-colors relative',
                isActive
                  ? 'bg-gray-800 border-l-4 border-blue-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 border-l-4 border-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
              {/* Notification badge for tickets */}
              {item.showBadge && unreadCount > 0 && (
                <span className="absolute right-6 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <div className="flex items-center gap-3 text-xs text-gray-500 px-2 mt-2">
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
