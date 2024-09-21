'use client';
import { RotateCcwIcon } from 'lucide-react';

// Error boundaries must be Client Components

export default function GlobalError({
  resetErrorBoundary,
}: {
  error: Error & { digest?: string };
  resetErrorBoundary: () => void;
}) {
  return (
    <html>
      <body>
        <div className="mx-auto my-12 glass max-w-lg rounded-xl py-12 flex flex-col items-center gap-4">
          <h2 className="text-xl">Something went wrong!</h2>
          <button
            onClick={resetErrorBoundary}
            className="text-primary flex items-center justify-center gap-2 text-lg">
            Retry
            <RotateCcwIcon className="w-8 h-8 text-red-500" />
          </button>
        </div>
      </body>
    </html>
  );
}
