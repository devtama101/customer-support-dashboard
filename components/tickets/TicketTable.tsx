import type { TicketWithRelations } from '@/types';
import { TicketRow } from './TicketRow';

interface TicketTableProps {
  tickets: TicketWithRelations[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <p className="text-gray-500">No tickets found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
        <div className="col-span-1"></div>
        <div className="col-span-3">Subject</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-2">Tags</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-1">Updated</div>
      </div>

      {/* Ticket Rows */}
      {tickets.map((ticket) => (
        <TicketRow key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
