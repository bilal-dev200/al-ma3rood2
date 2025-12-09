import { Target } from "lucide-react";

export default function ServicesEmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Target className="h-8 w-8 text-slate-400" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">
          No services match your filters yet
        </h3>
        <p className="text-sm text-slate-600">
          Try widening your search, explore nearby regions, or reset filters to
          browse all available professionals.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Reset filters
      </button>
    </div>
  );
}


