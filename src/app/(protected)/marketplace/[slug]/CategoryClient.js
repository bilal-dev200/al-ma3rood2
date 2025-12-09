"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import FilterComponent from "../FilterComponent";
import MarketplaceCategories from "../MarketplaceCategories";
import { IoIosArrowDown } from "react-icons/io";
import { FaThList, FaTh } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import Market from "../Market";
import { listingsApi } from "@/lib/api/listings";

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
  const search = searchParams.get("search");

  const [filteredProducts, setFilteredProducts] = useState(null);
  const [products, setProducts] = useState(initialProducts || []);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [hasMore, setHasMore] = useState(
    pagination?.currentPage < pagination?.totalPages
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [layout, setLayout] = useState("grid");

  // ✅ Reset filters
  const handleClearFilters = () => setFilteredProducts(null);

  // ✅ Load More Function (fetch next page)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const payload = {
        listing_type: "marketplace",
        pagination: { page: nextPage, per_page: 8 },
        category_id: categoryId,
        search,
      };

      const response = await listingsApi.getListingsByFilter(payload);

      // ✅ Adjust depending on API structure
      const newData = response || [];
      const totalPages =
        response?.pagination?.last_page ||
        1;

      if (newData.length > 0) {
        setProducts((prev) => [...prev, ...newData]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Error loading more:", err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, currentPage, hasMore, isLoading, search, pagination?.totalPages]);

  // ✅ Intersection Observer (Infinite Scroll)
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log("🔥 Bottom reached → loading more...");
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px", // load early
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore, hasMore, isLoading]);

  // ✅ Sort Products
  function sortProducts(products, option) {
    if (!products) return [];
    if (option === "low-to-high") {
      return [...products].sort(
        (a, b) => (a.buy_now_price || 0) - (b.buy_now_price || 0)
      );
    }
    if (option === "high-to-low") {
      return [...products].sort(
        (a, b) => (b.buy_now_price || 0) - (a.buy_now_price || 0)
      );
    }
    return products;
  }

  const productsToShow = sortProducts(filteredProducts || products, sortOption);

  // ✅ Debug Pagination Info
  useEffect(() => {
    // console.log("📊 Pagination Info:", pagination);
    // console.log("➡️ Has More:", hasMore);
    const productsToShow = sortProducts(filteredProducts || products, sortOption);
  }, [products, filteredProducts]);

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* 🔹 Category Heading */}
      <MarketplaceCategories
        heading={slug.charAt(0).toUpperCase() + slug.slice(1)}
        categories={category || {}}
        isLoading={false}
        error={null}
      />

      

      {/* 🔹 Sorting + Layout Controls */}
      <div className="flex flex-col gap-4 mt-4 mb-4 bg-white md:p-3 rounded shadow-sm md:flex-row md:justify-between md:items-end">
        
      {/* 🔹 Filter Section */}
      <div className="w-full">
        <FilterComponent
          categoryId={categoryId}
          onResults={(data) => setFilteredProducts(data)}
          onClear={handleClearFilters}
        />
      </div>
        <div className="hidden md:flex justify-center gap-2">
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
              layout === "list"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setLayout("list")}
          >
            <FaThList />
            <span>{t("List")}</span>
          </button>

          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
              layout === "grid"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setLayout("grid")}
          >
            <FaTh />
            <span>{t("Grid")}</span>
          </button>
        </div>
      </div>

      {/* 🔹 Product Grid */}
      <div className="py-10">
        <Market heading={slug} cards={productsToShow} layout={layout} />
      </div>

      {/* 🔹 Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* 🔹 Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-10 bg-transparent" />
    </div>
  );
}
