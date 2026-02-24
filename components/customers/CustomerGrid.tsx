import type { CustomerWithTickets } from '@/types';
import { CustomerCard } from './CustomerCard';

interface CustomerGridProps {
  customers: CustomerWithTickets[];
}

export function CustomerGrid({ customers }: CustomerGridProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <p className="text-gray-500">No customers found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
}
