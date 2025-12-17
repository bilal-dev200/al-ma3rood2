"use client";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import MarketplaceCategories from "../MarketplaceCategories";
import { FaThList, FaTh } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { listingsApi } from "@/lib/api/listings";
import CategoryPageFilters from "./CategoryPageFilters";
import MarketplaceSingleCard from "../MarketplaceSingleCard";
import Select from "react-select";
import { Loader2 } from "lucide-react";

export default function CategoryClient({
  slug,
  category,
  initialProducts,
  categoryId,
  pagination,
}) {
  const { t } = useTranslation();
  const observerRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
console.log("Check Category", category);  
  // Params
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const condition = searchParams.get("condition");
  const sortBy = searchParams.get("sort_by") || "featured";

  const [products, setProducts] = useState(initialProducts || []);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [hasMore, setHasMore] = useState(
    pagination?.currentPage < pagination?.totalPages
  );
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState(search);

  // Sync state with props/URL changes
  // Sync state with props/URL changes
  useEffect(() => {
    setProducts(initialProducts || []);
    setCurrentPage(pagination?.currentPage || 1);
    setHasMore(pagination?.currentPage < pagination?.totalPages);
    setSearchTerm(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, search]); // Removed initialProducts/pagination from deps to avoid reset on re-renders


  // Sort Options
  const sortOptions = [
    { value: "latest", label: "Latest Listings" },
    { value: "featured", label: "Featured" },
    { value: "low-to-high", label: "Price: Low to High" },
    { value: "high-to-low", label: "Price: High to Low" },
  ];

  const sortSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
      fontSize: '13px',
      minWidth: '180px',
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      '&:hover': { borderColor: '#d1d5db' }
    }),
    valueContainer: (base) => ({
      ...base,
      height: '32px',
      padding: '0 8px'
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0'
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '32px'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '13px',
      padding: '8px 12px'
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleSortChange = (selectedOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedOption) {
      params.set("sort_by", selectedOption.value);
    } else {
      params.delete("sort_by");
    }
    router.push(`/marketplace/${slug}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`/marketplace/${slug}?${params.toString()}`);
  };


  // Load More Function
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const payload = {
        listing_type: "marketplace",
        pagination: { page: nextPage, per_page: pagination?.per_page || 16 }, // Match search page limit usually 20
        category_id: categoryId,
        search,
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        ...(condition && { condition: condition }),
        sort_by: sortBy
      };

      console.log(`Fetching page ${nextPage}`);
      const response = await listingsApi.getListingsByFilter(payload);
      console.log("Full loadMore response:", response);

      let newData = [];
      let totalPages = 1;
      let isRawArray = false;

      // Check if response itself is the array of data
      if (Array.isArray(response)) {
        newData = response;
        isRawArray = true;
      } else {
        // Standard handling for { data: [...], pagination: ... }
        newData = response?.data || [];
        if (!Array.isArray(newData) && response?.data?.data && Array.isArray(response.data.data)) {
          newData = response.data.data;
        }
        totalPages = response?.pagination?.last_page || response?.meta?.last_page || 1;
      }

      console.log(`Fetched ${newData?.length} items.`);

      if (Array.isArray(newData) && newData.length > 0) {
        setProducts((prev) => {
          // Filter out duplicates based on ID
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewData = newData.filter(item => !existingIds.has(item.id));

          if (uniqueNewData.length === 0) {
            console.log("No new unique items found (all duplicates).");
            return prev;
          }

          console.log(`Appending ${uniqueNewData.length} unique items to prev length: ${prev.length}`);
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(nextPage);

        // Update hasMore based on response type
        if (isRawArray) {
          const perPage = pagination?.per_page || 16;
          // If we got a full page, assume there might be more. 
          // If we got less, we definitely reached the end.
          setHasMore(newData.length >= perPage);
        } else {
          setHasMore(nextPage < totalPages);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Error loading more:", err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, currentPage, hasMore, isLoading, search, minPrice, maxPrice, condition, sortBy]);

  // Intersection Observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore, hasMore, isLoading]);

  const resultCount = pagination?.totalRecord || products.length; // Fallback

  return (
    <div className="flex flex-col gap-6 mt-6 pb-20">

      {/* 2. Search Bar */}
      <div className="">
        <div className="flex w-full shadow-sm rounded-md overflow-hidden border border-gray-300 bg-white">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`${t("Search in")} ${decodeURIComponent(slug)}`}
              className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/marketplace/${slug}?${params.toString()}`);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <IoClose className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="bg-green-600 px-6 text-white font-medium hover:bg-green-700 transition-colors"
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {/* 3. Filters - Sticky */}
      <div className="flex flex-col py-3 md:flex-row gap-4 items-center bg-white/80 sticky top-0 z-30">
        <div className="flex-grow w-full md:w-auto pb-2 md:pb-0">
          <CategoryPageFilters categoryId={categoryId} />
        </div>
      </div>

      {/* 1. Category Heading + Description (from MarketplaceCategories, simplified if needed, but keeping component) */}
      <MarketplaceCategories
        heading={slug}
        categories={category || {}}
        description={category?.parent_category?.description}
        isLoading={false}
        error={null}
      />

      {/* 4. Results Header & Toggles */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-gray-600 text-sm font-medium">
          {/* Simple count display */}
          {resultCount > 0 ? (
            <span>
              {t("Showing")} <span className="font-bold text-gray-900">{resultCount}</span> {t("results")} {search && <> {t("for")} "{search}"</>}
            </span>
          ) : (
            <span>{t("Results")}</span>
          )}
        </h2>

        <div className="flex items-center gap-4">
          {/* Sorting Dropdown */}
          <div className="min-w-[180px]">
            <Select
              options={sortOptions}
              value={sortOptions.find(opt => opt.value === sortBy)}
              onChange={handleSortChange}
              styles={sortSelectStyles}
              isSearchable={false}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            />
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded p-0.5">
            <button
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-gray-100 text-green-700" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setViewMode("list")}
              title={t("List View")}
            >
              <FaThList size={16} />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-0.5"></div>
            <button
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100 text-green-700" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setViewMode("grid")}
              title={t("Grid View")}
            >
              <FaTh size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Product Grid */}
      <div className={`grid gap-4 ${viewMode === 'grid'
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1'
        }`}>
        {products.map((item, index) => (
          <MarketplaceSingleCard key={item.id || index} card={item} viewMode={viewMode} />
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && hasMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {t("No results found")}
          </h2>
          <p className="text-gray-500">
            {t("Try checking your spelling or use different keywords")}
          </p>
        </div>
      )}

      {/* No More Records Message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-6 text-gray-500 font-medium">
          {t("No more records to show")}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-10 bg-transparent" />
    </div>
  );
}
