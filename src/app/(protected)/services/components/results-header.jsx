import { LayoutGrid, List } from "lucide-react";

const sortOptions = [
  { value: "latest", label: "Latest Listings" },
  { value: "featured", label: "Featured" },
  // { value: "rating", label: "Top rated" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

export default function ResultsHeader({
  totalResults,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isLoading,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div>
        <p className="text-sm font-medium text-slate-600">
          {isLoading ? "Updating results…" : `Showing ${totalResults} services`}
        </p>
        <p className="text-xs text-slate-500">
          Sorted by{" "}
          {
            sortOptions.find((option) => option.value === sortBy)?.label ||
            "Featured"
          }
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Sort services"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`inline-flex h-8 w-9 items-center justify-center rounded-full text-sm transition ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-label="Show results in grid view"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`inline-flex h-8 w-9 items-center justify-center rounded-full text-sm transition ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-label="Show results in list view"
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}


