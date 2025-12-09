function SkeletonBlock({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/70 ${className || ""}`}
    />
  );
}

export default function ServicesResultsSkeleton({ view = "grid" }) {
  const items = view === "list" ? 3 : 6;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-10 w-40" />
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
            >
              <SkeletonBlock className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row"
            >
              <SkeletonBlock className="h-32 w-full rounded-md sm:h-32 sm:w-48" />
              <div className="flex flex-1 flex-col gap-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


