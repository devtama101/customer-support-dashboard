'use client';

import { Plus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface QuickActionsProps {
  customerId: string;
  customerEmail: string;
}

export function QuickActions({ customerId, customerEmail }: QuickActionsProps) {
  const handleSendEmail = () => {
    window.location.href = `mailto:${customerEmail}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Link
          href={`/dashboard/tickets/new?customerId=${customerId}`}
          className="block w-full"
        >
          <Button className="w-full justify-start gap-2" variant="outline">
            <Plus className="w-4 h-4" />
            Create New Ticket
          </Button>
        </Link>
        <Button
          className="w-full justify-start gap-2"
          variant="outline"
          onClick={handleSendEmail}
        >
          <Mail className="w-4 h-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
}
