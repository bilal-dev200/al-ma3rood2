"use client";

import { useMemo, useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import SearchableDropdown from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdown";
import { useServicesStore } from "@/lib/stores/servicesStore";
import { useLocationStore } from "@/lib/stores/locationStore";

export default function FilterBar({
  query,
  selectedCategory,
  selectedRegion,
  selectedCity,
  selectedArea,
  // priceRange,
  // priceBounds,
  onQueryChange,
  onCategoryChange,
  onRegionChange,
  onCityChange,
  onAreaChange,
  // onPriceRangeChange,
  onReset,
  onSearch,
  isSearching = false,
  canSearch = true,
}) {
  // Get categories from Services Store
  const categories = useServicesStore((state) => state.categories);

  // Get locations from Location Store
  const {
    locations,
    getAllLocations,
    cities: storeCities,
    areas: storeAreas,
    fetchCities,
    fetchAreas,
    isLoading: isLocationLoading,
  } = useLocationStore();

  // Initialize locations
  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  // Fetch Cities when Region changes (if selectedRegion is present)
  // We need to detect if selectedRegion changes to trigger fetch, but onRegionChange handles the user action.
  // However, if we load with a pre-selected region, we might need to fetch manually or via effect.
  useEffect(() => {
    if (selectedRegion) {
      // regionOptions uses ID as value. ensure selectedRegion is ID.
      // The original code used value or id.
      fetchCities(selectedRegion);
    }
  }, [selectedRegion, fetchCities]);

  // Fetch Areas when City changes
  useEffect(() => {
    if (selectedCity) {
      fetchAreas(selectedCity);
    }
  }, [selectedCity, fetchAreas]);


  // Prepare category options for SearchableDropdown (with hierarchy support)
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id ?? category.value ?? category.slug,
      label: category.label ?? category.name ?? category.value ?? category.slug,
      depth: category.depth ?? 0,
      isParent: false,
      parentLabel: category.parentLabel ?? null,
      fullPath: category.fullPath ?? category.label ?? category.name,
    }));
  }, [categories]);

  // Prepare region options from Location Store
  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      id: String(region.id),
      label: region.name,
    }));
  }, [regions]);

  // Prepare city options from Location Store
  const cityOptions = useMemo(() => {
    return storeCities.map((city) => ({
      id: String(city.id),
      label: city.name,
    }));
  }, [storeCities]);

  // Prepare area options from Location Store
  const areaOptions = useMemo(() => {
    return storeAreas.map((area) => ({
      id: String(area.id),
      label: area.name,
    }));
  }, [storeAreas]);

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

      </div>

      <div
        className="mt-4 grid gap-4 transition-all grid-cols-1 sm:grid-cols-12 lg:grid-cols-5"
      >
        <div className="sm:col-span-8 lg:col-span-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search keywords
          </label>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            type="search"
            placeholder="e.g. wedding photographer, plumbing"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="sm:col-span-4 lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={onSearch}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-green-600 bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSearching || !canSearch}
            suppressHydrationWarning
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="sm:col-span-6 lg:col-span-2">
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

        <div className="sm:col-span-6 lg:col-span-1">
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

        <div className="sm:col-span-6 lg:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            City
          </label>
          <SearchableDropdown
            options={cityOptions}
            value={selectedCity || ""}
            onChange={(value) => onCityChange(value || "")}
            placeholder="Select city"
            searchPlaceholder="Search cities..."
            emptyMessage="No cities found"
            loading={isLocationLoading}
            disabled={(!cityOptions.length && !isLocationLoading) || !selectedRegion}
          />
        </div>

        <div className="sm:col-span-6 lg:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Area
          </label>
          <SearchableDropdown
            options={areaOptions}
            value={selectedArea || ""}
            onChange={(value) => onAreaChange(value || "")}
            placeholder="Select area"
            searchPlaceholder="Search areas..."
            emptyMessage="No areas found"
            loading={isLocationLoading}
            disabled={(!areaOptions.length && !isLocationLoading) || !selectedCity}
          />
        </div>

        {/* Price range commented out */}
        {/* <div className="sm:col-span-3"> ... </div> */}

        <div className="sm:col-span-12 lg:col-span-5">
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


