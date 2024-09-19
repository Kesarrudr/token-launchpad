export function AppLoaderComponent() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <h2 className="mt-4 text-xl font-semibold text-blue-400">
          Loading Solana Token Creator
        </h2>
        <p className="mt-2 text-gray-400">
          Please wait while we initialize the app...
        </p>
      </div>
    </div>
  );
}

