"use client";

import { Loader2 } from "lucide-react";

interface LoadingComponentProps {
  isLoading: boolean;
  isDevnet: boolean;
}

export function LoadingComponentComponent({
  isLoading,
  isDevnet,
}: LoadingComponentProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full space-y-4">
        {isDevnet && (
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-md text-center font-semibold mb-4">
            Devnet Mode
          </div>
        )}
        <div className="flex items-center justify-center space-x-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <span className="text-xl font-semibold text-white">
            Creating Token...
          </span>
        </div>
        <p className="text-gray-300 text-center">
          Please wait while we process your request. This may take a few
          moments.
        </p>
      </div>
    </div>
  );
}

