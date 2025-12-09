import ServicesResultsSkeleton from "./components/results-skeleton";

export default function Loading() {
  return (
    <main className="bg-white min-h-screen">
      <section className="animate-pulse rounded-b-[48px] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="h-6 w-48 rounded-full bg-white/60" />
          <div className="mt-6 h-12 w-3/4 max-w-xl rounded-full bg-white/60" />
          <div className="mt-4 h-10 w-2/3 max-w-md rounded-full bg-white/50" />
          <div className="mt-8 flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                key={index}
                className="h-10 w-32 rounded-full bg-white/60"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ServicesResultsSkeleton />
      </section>
    </main>
  );
}


