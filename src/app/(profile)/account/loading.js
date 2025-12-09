export default function Loading() {
  return (
    <div className="p-10 text-center animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded mx-auto mb-8" />
      <div className="h-6 w-1/2 bg-gray-100 rounded mx-auto mb-4" />
      <div className="h-96 w-full bg-gray-100 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
} 