'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sandbeige-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-sandbeige-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-sandbeige-600">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={reset}
              className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-sandbeige-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-sandbeige-500">
            If the problem persists, please contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
