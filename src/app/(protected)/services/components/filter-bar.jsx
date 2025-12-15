"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import SearchableDropdown from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdown";
import { useServicesStore } from "@/lib/stores/servicesStore";

export default function FilterBar({
  query,
  selectedCategory,
  selectedRegion,
  selectedArea,
  priceRange,
  priceBounds,
  onQueryChange,
  onCategoryChange,
  onRegionChange,
  onAreaChange,
  onPriceRangeChange,
  onReset,
  onSearch,
  isSearching = false,
  canSearch = true,
}) {
  const [priceMin, priceMax] = priceRange || [0, 0];
  const [boundMin = 0, boundMax = 0] = priceBounds || [0, 0];
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get categories and regions from Zustand store
  const categories = useServicesStore((state) => state.categories);
  const regions = useServicesStore((state) => state.regions);

  // Prepare category options for SearchableDropdown (with hierarchy support)
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id ?? category.value ?? category.slug,
      label: category.label ?? category.name ?? category.value ?? category.slug,
      depth: category.depth ?? 0,
      isParent: category.isParent ?? false,
      parentLabel: category.parentLabel ?? null,
      fullPath: category.fullPath ?? category.label ?? category.name,
    }));
  }, [categories]);

  // Prepare region options for SearchableDropdown
  const regionOptions = useMemo(() => {
    return regions.map((region) => {
      const value = region.id ?? region.value;
      const label = region.label ?? region.name ?? region.title ?? value;
      return {
        id: String(value),
        label: String(label),
      };
    });
  }, [regions]);

  // Prepare governorate options for SearchableDropdown
  const governorateOptions = useMemo(() => {
    const match = regions.find(
      (region) =>
        region.id === selectedRegion || region.value === selectedRegion || String(region.id) === String(selectedRegion)
    );
    if (!match) return [];
    
    let areas = [];
    if (Array.isArray(match.areas) && match.areas.length) {
      areas = match.areas;
    } else if (Array.isArray(match.governorates) && match.governorates.length) {
      areas = match.governorates;
    }
    
    return areas.map((area) => {
      if (typeof area === "string") {
        return { id: area, label: area };
      }
      const value = area.id ?? area.value ?? area.slug ?? area.name;
      const label = area.label ?? area.name ?? value;
      return {
        id: String(value),
        label: String(label),
      };
    });
  }, [regions, selectedRegion]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Filter className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Refine your search
            </h2>
            <p className="text-sm text-slate-600">
              Filter by category, location, and budget to see tailored results.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-green-600 bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSearching || !canSearch}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {isSearching ? "Searching…" : "Search services"}
          </button>
          {/* <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:hidden"
            aria-expanded={isExpanded}
          >
            Filters
            <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
          </button> */}
        </div>
      </div>

      <div
        className={`mt-4 grid gap-4 transition-all sm:grid-cols-12 ${
          isExpanded ? "grid" : "hidden sm:grid"
        }`}
      >
        <div className="sm:col-span-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search keywords
          </label>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            type="search"
            placeholder="e.g. wedding photographer, plumbing, mobile mechanic"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <SearchableDropdown
            options={categoryOptions}
            value={selectedCategory || ""}
            onChange={(value) => onCategoryChange(value || "")}
            placeholder="All categories"
            searchPlaceholder="Search categories..."
            emptyMessage="No categories found"
            showHierarchy={true}
          />
        </div>

        <div className="sm:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Region
          </label>
          <SearchableDropdown
            options={regionOptions}
            value={selectedRegion || ""}
            onChange={(value) => onRegionChange(value || "")}
            placeholder="All regions"
            searchPlaceholder="Search regions..."
            emptyMessage="No regions found"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Governorate
          </label>
          <SearchableDropdown
            options={governorateOptions}
            value={selectedArea || ""}
            onChange={(value) => onAreaChange(value || "")}
            placeholder="Any governorate"
            searchPlaceholder="Search governorates..."
            emptyMessage="No governorates found"
            disabled={!governorateOptions.length || !selectedRegion}
          />
        </div>

        {/* <div className="sm:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price range (SAR)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={boundMin}
              max={priceMax || boundMax}
              value={priceMin}
              onChange={(event) =>
                onPriceRangeChange([
                  Number(event.target.value) || boundMin,
                  priceMax || boundMax,
                ])
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Minimum price"
            />
            <span className="text-sm text-slate-500">to</span>
            <input
              type="number"
              inputMode="numeric"
              min={priceMin || boundMin}
              max={boundMax || 10000}
              value={priceMax}
              onChange={(event) =>
                onPriceRangeChange([
                  priceMin || boundMin,
                  Number(event.target.value) || boundMax,
                ])
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Maximum price"
            />
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Typical range {boundMin.toLocaleString("en-SA")} –{" "}
            {boundMax.toLocaleString("en-SA")} SAR
          </p>
        </div> */}

        <div className="sm:col-span-12">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Reset filters
            </button>
            <p className="text-xs text-slate-500">
              Adjust filters and press search to refresh the results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


