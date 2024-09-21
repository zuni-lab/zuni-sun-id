'use client';

import React from 'react';

import { RotateCcwIcon } from 'lucide-react';

export default function AppError({
  resetErrorBoundary,
}: {
  error: Error & { digest?: string };
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="mx-auto my-12 glass max-w-xl rounded-xl py-12 flex flex-col items-center gap-4">
      <h2 className="text-xl">Please connect your wallet on testnet and refresh the page.</h2>
      <RotateCcwIcon className="w-8 h-8 text-red-500" onClick={() => resetErrorBoundary()} />
    </div>
  );
}
