import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerGrid } from '@/components/customers/CustomerGrid';
import { getCustomers } from '@/actions';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    engagement?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  // Await searchParams in Next.js 16
  const params = await searchParams;
  const session = await auth();

  // Get customers with ticket count
  const customers = await getCustomers({
    search: params.search,
  });

  // Pagination (simplified)
  const pageSize = 12;
  const currentPage = parseInt(params.page || '1', 10);
  const totalPages = Math.ceil(customers.length / pageSize);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper function to build URL with params
  const buildUrl = (page: number) => {
    const searchParamsObj = new URLSearchParams();
    if (params.search) searchParamsObj.set('search', params.search);
    if (params.engagement) searchParamsObj.set('engagement', params.engagement);
    if (params.sort) searchParamsObj.set('sort', params.sort);
    searchParamsObj.set('page', String(page));
    return `/dashboard/customers?${searchParamsObj.toString()}`;
  };

  return (
    <>
      <Header
        title="Customers"
        subtitle="Manage customer information and history"
        actions={
          <Link href="/dashboard/customers/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <CustomerFilters />
        <CustomerGrid customers={paginatedCustomers} />

        {/* Pagination */}
        {customers.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, customers.length)} of{' '}
              {customers.length} customers
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
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
                );
              })}
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
