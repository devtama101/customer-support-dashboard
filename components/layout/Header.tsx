import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import type { ReactNode } from 'react';

interface HeaderProps {
  title: string | ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export async function Header({ title, subtitle, actions }: HeaderProps) {
  const session = await auth();

  return (
    <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Action buttons */}
        {actions}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gray-200">
            <AvatarFallback className="bg-blue-600 text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{session?.user?.role?.toLowerCase() || 'Agent'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
