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
import { categoriesApi } from "@/lib/api/category";
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
  const areaMap = useMemo(() => {
    return regions.reduce((acc, region) => {
      const areas = region.areas || [];
      areas.forEach((area) => {
        const key = area.id ?? area.value;
        const label = area.label ?? area.name ?? area.title ?? key;
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

      const cityValue = listing.city || listing.city_id || listing.cityId || listing.city_name || "";
      const cityLabel = listing.cityLabel || listing.city_name || (typeof cityValue === 'string' ? cityValue : "") || "";

      const areaValue =
        listing.area ||
        listing.area_id ||
        listing.areaId ||
        listing.area_name;

      const areaKey =
        areaValue !== undefined && areaValue !== null
          ? String(areaValue)
          : "";
      const areaLabel =
        areaMap[areaKey] ||
        listing.area ||
        listing.area_name ||
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
        city: cityLabel,
        area: areaLabel,
        regionLabel,
        formattedLocation: [areaLabel, cityLabel, regionLabel].filter(Boolean).join(", "),
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
    [areaMap, regionMap]
  );

  const initialEnrichedListings = useMemo(
    () => initialListings.map(enrichListing),
    [initialListings, enrichListing]
  );

  const query = useServicesStore((state) => state.query);
  const selectedCategory = useServicesStore((state) => state.selectedCategory);
  const selectedRegion = useServicesStore((state) => state.selectedRegion);
  const selectedCity = useServicesStore((state) => state.selectedCity);
  const selectedArea = useServicesStore((state) => state.selectedArea);
  // const priceRange = useServicesStore((state) => state.priceRange);
  const sortBy = useServicesStore((state) => state.sortBy);
  const viewMode = useServicesStore((state) => state.viewMode);
  const setQuery = useServicesStore((state) => state.setQuery);
  const setCategory = useServicesStore((state) => state.setCategory);
  const setRegion = useServicesStore((state) => state.setRegion);
  const setCity = useServicesStore((state) => state.setCity);
  const setArea = useServicesStore((state) => state.setArea);
  // const setPriceRange = useServicesStore((state) => state.setPriceRange);
  const setSortBy = useServicesStore((state) => state.setSortBy);
  const setViewMode = useServicesStore((state) => state.setViewMode);
  const hydrateFromParams = useServicesStore((state) => state.hydrateFromParams);
  const resetFilters = useServicesStore((state) => state.resetFilters);

  // const priceBoundsRef = useRef(priceBounds);
  const initialFiltersRef = useRef(initialFilters);
  const resultsRef = useRef(null);

  const [listings, setListings] = useState(initialEnrichedListings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [searchToken, setSearchToken] = useState(0);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [dynamicPriceBounds, setDynamicPriceBounds] = useState(priceBounds);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  // useEffect(() => {
  //   priceBoundsRef.current = priceBounds;
  //   setDynamicPriceBounds(priceBounds);
  // }, [priceBounds]);

  useEffect(() => {
    hydrateFromParams(initialFiltersRef.current);
    setHasHydrated(true);
  }, [hydrateFromParams]);

  // useEffect(() => {
  //   if (!hasHydrated) return;
  //   const [boundMin, boundMax] = priceBoundsRef.current || [0, 0];
  //   const { priceMin, priceMax } = initialFiltersRef.current || {};
  //   const desiredRange = [priceMin || boundMin, priceMax || boundMax];
  //   setPriceRange(desiredRange);
  // }, [hasHydrated, setPriceRange]);

  useEffect(() => {
    if (hasHydrated && !initialFetchDone) {
      setInitialFetchDone(true);
      setSearchToken(1);
    }
  }, [hasHydrated, initialFetchDone]);

  // Fetch Categories for Grid (Rich data with count/images)
  const [fetchedCategories, setFetchedCategories] = useState([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.getAllCategories(null, "services");
        setFetchedCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load service categories", err);
      }
    };
    loadCategories();
  }, []);

  // Main fetch effect
  useEffect(() => {
    if (!hasHydrated || searchToken === 0) return;

    let ignore = false;
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    const fetchListings = async () => {
      try {
        const currentState = useServicesStore.getState();
        const response = await servicesApi.getServices({
          status: currentState.status,
          query: currentState.query,
          category: currentState.selectedCategory,
          region: currentState.selectedRegion,
          city: currentState.selectedCity,
          area: currentState.selectedArea,
          // priceRange: currentState.priceRange,
          sortBy: currentState.sortBy,
          page: page,
          pageSize: 20,
        });

        const results = Array.isArray(response?.data?.data)
          ? response.data.data // Pagination wrapper usually has data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        // Check if we have more pages (if results < pageSize, we reached the end)
        if (!ignore) {
          // Handle response structure variances (often Laravel paginate returns .data.data)
          const fetchedItems = results.map(enrichListing);

          if (fetchedItems.length < 20) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (isFirstPage) {
            setListings(fetchedItems);

            // Dynamic pricing bounds only on first fetch/filter change usually
            // const numericPrices = fetchedItems
            //   .map((item) => Number.parseFloat(item.price ?? item.price_amount))
            //   .filter((value) => Number.isFinite(value));
            // if (numericPrices.length > 0) {
            //   const minPrice = Math.min(...numericPrices);
            //   const maxPrice = Math.max(...numericPrices);
            //   const nextBounds = [
            //     Math.floor(minPrice / 5) * 5,
            //     Math.ceil(maxPrice / 5) * 5,
            //   ];
            //   priceBoundsRef.current = nextBounds;
            //   setDynamicPriceBounds(nextBounds);
            // }
          } else {
            setListings(prev => [...prev, ...fetchedItems]);
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
          setIsFetchingMore(false);
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
    page // Re-run when page changes
  ]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && !isFetchingMore && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, isFetchingMore, hasMore]);


  function handleReset() {
    resetFilters();
    // const [boundMin, boundMax] = priceBoundsRef.current || [0, 0];
    // setPriceRange([boundMin, boundMax]);
    // setDynamicPriceBounds(priceBoundsRef.current || priceBounds);

    // Reset pagination
    setPage(1);
    setHasMore(true);
    setSearchToken((token) => token + 1);

    setInitialFetchDone(true);
  }

  const handleSearch = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setSearchToken((token) => token + 1);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
        selectedCity={selectedCity}
        selectedArea={selectedArea}
        // priceRange={priceRange}
        // priceBounds={dynamicPriceBounds}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
        onCityChange={setCity}
        onAreaChange={setArea}
        // onPriceRangeChange={setPriceRange}
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
        categories={{ data: fetchedCategories }}
      />

      <div ref={resultsRef}>
        <ResultsHeader
          totalResults={listings.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <ServicesResultsSkeleton view={viewMode} />
      ) : listings.length ? (
        <>
          {viewMode === "grid" ? (
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
          )}

          {/* Infinite Scroll Loader & Target */}
          <div ref={observerTarget} className="h-10 flex items-center justify-center w-full py-4">
            {isFetchingMore && (
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </>
      ) : (
        <ServicesEmptyState onReset={handleReset} />
      )}
    </div>
  );
}

