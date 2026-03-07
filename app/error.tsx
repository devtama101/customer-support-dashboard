'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-6 max-w-md">
          An unexpected error occurred. Please try again.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={handleGoToLogin}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
