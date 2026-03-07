import Link from 'next/link';
import { FileQuestion, ArrowLeft, Ticket } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <FileQuestion className="w-10 h-10 text-blue-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The page or resource you're looking for doesn't exist or may have been deleted.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard/tickets"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Ticket className="w-5 h-5" />
            View Tickets
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg font-medium border hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
