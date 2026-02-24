import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketTable } from '@/components/tickets/TicketTable';
import { getTickets } from '@/actions';
import type { TicketStatus, TicketPriority } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface TicketsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sentiment?: string;
    page?: string;
  }>;
}

export default async function TicketsPage({
  searchParams,
}: TicketsPageProps) {
  // Await searchParams in Next.js 16
  const params = await searchParams;
  const session = await auth();

  // Build filters from search params
  const filters: {
    search?: string;
    status?: TicketStatus[];
    priority?: TicketPriority[];
    assignee?: string;
  } = {};

  if (params.search) {
    filters.search = params.search;
  }

  if (params.status) {
    filters.status = [params.status as TicketStatus];
  }

  if (params.priority) {
    filters.priority = [params.priority as TicketPriority];
  }

  // Get tickets
  const tickets = await getTickets(filters);

  // Pagination (simplified - just show all for now)
  const pageSize = 10;
  const currentPage = parseInt(params.page || '1', 10);
  const totalPages = Math.ceil(tickets.length / pageSize);
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper function to build URL with params
  const buildUrl = (page: number) => {
    const searchParamsObj = new URLSearchParams();
    if (params.search) searchParamsObj.set('search', params.search);
    if (params.status) searchParamsObj.set('status', params.status);
    if (params.priority) searchParamsObj.set('priority', params.priority);
    if (params.sentiment) searchParamsObj.set('sentiment', params.sentiment);
    searchParamsObj.set('page', String(page));
    return `/dashboard/tickets?${searchParamsObj.toString()}`;
  };

  return (
    <>
      <Header
        title="Tickets"
        subtitle="Manage and respond to customer inquiries"
        actions={
          <Link href="/dashboard/tickets/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <TicketFilters />
        <TicketTable tickets={paginatedTickets} />

        {/* Pagination */}
        {tickets.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, tickets.length)} of{' '}
              {tickets.length} tickets
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={buildUrl(currentPage - 1)}
                className={`px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 ${
                  currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                Previous
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Link
                    key={pageNum}
                    href={buildUrl(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              )}
              <Link
                href={buildUrl(currentPage + 1)}
                className={`px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 ${
                  currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
