"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import FilterBar from "./components/filter-bar";
import ResultsHeader from "./components/results-header";
import ServiceCard from "./components/service-card";
import ServicesEmptyState from "./components/empty-state";
import ServicesResultsSkeleton from "./components/results-skeleton";
import { useServicesStore } from "@/lib/stores/servicesStore";
import { servicesApi } from "@/lib/api/services";
import { Image_URL } from "@/config/constants";
import ServiceCategories from "./ServiceCategories";

export default function ServicesBrowser({
  initialListings = [],
  priceBounds = [0, 0],
  initialFilters = {},
}) {
  // Get categories and regions from Zustand store
  const categories = useServicesStore((state) => state.categories);
  const regions = useServicesStore((state) => state.regions);
  const regionMap = useMemo(() => {
    return regions.reduce((acc, region) => {
      const key = region.id ?? region.value;
      const label = region.label ?? region.name ?? region.title ?? key;
      if (key !== undefined && key !== null) {
        acc[String(key)] = label;
      }
      return acc;
    }, {});
  }, [regions]);
  const governorateMap = useMemo(() => {
    return regions.reduce((acc, region) => {
      const govs = region.governorates || region.areas || [];
      govs.forEach((gov) => {
        const key = gov.id ?? gov.value;
        const label = gov.label ?? gov.name ?? gov.title ?? key;
        if (key !== undefined && key !== null) {
          acc[String(key)] = label;
        }
      });
      return acc;
    }, {});
  }, [regions]);

  const enrichListing = useCallback(
    (listing) => {
      const regionValue =
        listing.region ?? listing.region_id ?? listing.regionId ?? "";
      const regionKey =
        regionValue !== "" && regionValue !== null && regionValue !== undefined
          ? String(regionValue)
          : "";
      const regionLabel =
        regionMap[regionKey] ||
        listing.region_label ||
        listing.region_name ||
        listing.region ||
        "";
      const governorateValue =
        listing.area ||
        listing.governorate ||
        listing.governorate_id ||
        listing.governorateId ||
        listing.governorate_label ||
        listing.governorate_name;
      const governorateKey =
        governorateValue !== undefined && governorateValue !== null
          ? String(governorateValue)
          : "";
      const areaLabel =
        governorateMap[governorateKey] ||
        listing.area ||
        listing.governorate ||
        listing.governorate_label ||
        listing.governorate_name ||
        "";
      const imagePath = listing.images?.[0]?.image_path;
      const resolvedPhotoUrl =
        listing.photo?.url ||
        (imagePath && Image_URL ? `${Image_URL}${imagePath}` : "/placeholder.svg");
      const slugValue =
        listing.slug || listing.service_slug || listing.id || listing.service_id;
      const safeSlug =
        slugValue !== undefined && slugValue !== null
          ? String(slugValue)
          : `service-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      return {
        ...listing,
        slug: safeSlug,
        region: regionKey,
        area: areaLabel,
        regionLabel,
        priceUnit: listing.priceUnit || listing.price_unit,
        responseTime: listing.responseTime || listing.response_time,
        nextAvailability:
          listing.nextAvailability || listing.next_availability,
        subtitle: listing.subtitle || listing.summary,
        photo: {
          url: resolvedPhotoUrl,
          alt:
            listing.photo?.alt ||
            listing.title ||
            listing.subtitle ||
            "Service image",
        },
      };
    },
    [governorateMap, regionMap]
  );

  const initialEnrichedListings = useMemo(
    () => initialListings.map(enrichListing),
    [initialListings, enrichListing]
  );

  const query = useServicesStore((state) => state.query);
  const selectedCategory = useServicesStore((state) => state.selectedCategory);
  const selectedRegion = useServicesStore((state) => state.selectedRegion);
  const selectedArea = useServicesStore((state) => state.selectedArea);
  const priceRange = useServicesStore((state) => state.priceRange);
  const sortBy = useServicesStore((state) => state.sortBy);
  const viewMode = useServicesStore((state) => state.viewMode);
  const setQuery = useServicesStore((state) => state.setQuery);
  const setCategory = useServicesStore((state) => state.setCategory);
  const setRegion = useServicesStore((state) => state.setRegion);
  const setArea = useServicesStore((state) => state.setArea);
  const setPriceRange = useServicesStore((state) => state.setPriceRange);
  const setSortBy = useServicesStore((state) => state.setSortBy);
  const setViewMode = useServicesStore((state) => state.setViewMode);
  const hydrateFromParams = useServicesStore((state) => state.hydrateFromParams);
  const resetFilters = useServicesStore((state) => state.resetFilters);

  const priceBoundsRef = useRef(priceBounds);
  const initialFiltersRef = useRef(initialFilters);

  const [listings, setListings] = useState(initialEnrichedListings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [searchToken, setSearchToken] = useState(0);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [dynamicPriceBounds, setDynamicPriceBounds] = useState(priceBounds);

  useEffect(() => {
    priceBoundsRef.current = priceBounds;
    setDynamicPriceBounds(priceBounds);
  }, [priceBounds]);

  useEffect(() => {
    hydrateFromParams(initialFiltersRef.current);
    setHasHydrated(true);
  }, [hydrateFromParams]);

  useEffect(() => {
    if (!hasHydrated) return;
    const [boundMin, boundMax] = priceBoundsRef.current || [0, 0];
    const { priceMin, priceMax } = initialFiltersRef.current || {};
    const desiredRange = [priceMin || boundMin, priceMax || boundMax];
    setPriceRange(desiredRange);
  }, [hasHydrated, setPriceRange]);

  useEffect(() => {
    if (hasHydrated && !initialFetchDone) {
      setInitialFetchDone(true);
      setSearchToken(1);
    }
  }, [hasHydrated, initialFetchDone]);
  

  useEffect(() => {
    if (!hasHydrated || searchToken === 0) return;

    let ignore = false;
    setIsLoading(true);

    const fetchListings = async () => {
      try {
        // Get current filter values from store when search is triggered
        const currentState = useServicesStore.getState();
        const response = await servicesApi.getServices({
          query: currentState.query,
          category: currentState.selectedCategory,
          region: currentState.selectedRegion,
          area: currentState.selectedArea,
          priceRange: currentState.priceRange,
          sortBy: currentState.sortBy,
        });
        const results = Array.isArray(response?.data) ? response.data : [];
        if (!ignore) {
          setListings(results.map(enrichListing));
          const numericPrices = results
            .map((item) => Number.parseFloat(item.price ?? item.price_amount))
            .filter((value) => Number.isFinite(value));
          if (numericPrices.length > 0) {
            const minPrice = Math.min(...numericPrices);
            const maxPrice = Math.max(...numericPrices);
            const nextBounds = [
              Math.floor(minPrice / 5) * 5,
              Math.ceil(maxPrice / 5) * 5,
            ];
            priceBoundsRef.current = nextBounds;
            setDynamicPriceBounds(nextBounds);
          }
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error?.message ||
              error?.data?.message ||
              "Unable to load services. Please try again."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      ignore = true;
    };
  }, [
    enrichListing,
    hasHydrated,
    searchToken,
  ]);

  function handleReset() {
    resetFilters();
    const [boundMin, boundMax] = priceBoundsRef.current || [0, 0];
    setPriceRange([boundMin, boundMax]);
    setListings(initialEnrichedListings);
    setDynamicPriceBounds(priceBoundsRef.current || priceBounds);
    setSearchToken(0);
    setInitialFetchDone(true);
  }

  const handleSearch = useCallback(() => {
    setSearchToken((token) => token + 1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    // Trigger search immediately when sort changes
    if (hasHydrated) {
      setSearchToken((token) => token + 1);
    }
  }, [hasHydrated, setSortBy]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <FilterBar
        query={query}
        categories={categories}
        regions={regions}
        selectedCategory={selectedCategory}
        selectedRegion={selectedRegion}
        selectedArea={selectedArea}
        priceRange={priceRange}
        priceBounds={dynamicPriceBounds}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
        onAreaChange={setArea}
        onPriceRangeChange={setPriceRange}
        onReset={handleReset}
        onSearch={handleSearch}
        isSearching={isLoading && searchToken > 0}
        canSearch={hasHydrated}
      />

      <ServiceCategories
  heading="Service Categories"
  isLoading={false}
  error={null}
  description="Browse available service categories"
/>

      <ResultsHeader
        totalResults={listings.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isLoading={isLoading}
      />

      {isLoading ? (
        <ServicesResultsSkeleton view={viewMode} />
      ) : listings.length ? (
        viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ServiceCard key={listing.slug} listing={listing} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <ServiceCard key={listing.slug} listing={listing} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <ServicesEmptyState onReset={handleReset} />
      )}
    </div>
  );
}

