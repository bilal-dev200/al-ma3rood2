import { Suspense } from "react";
import {
  SERVICES_MODULE_METADATA,
  derivePriceRangeOptions,
  getFeaturedProviders,
  getPopularTags,
} from "@/lib/mock/services/data";
import { categoriesApi } from "@/lib/api/category";
import { locationsApi } from "@/lib/api/location";
import { transformServiceCategories, transformRegionsResponse } from "@/lib/utils/serviceTransformers";
import ServicesLanding from "./ServicesLanding";
import ServicesResultsSkeleton from "./components/results-skeleton";

export const metadata = SERVICES_MODULE_METADATA;

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const [categoryTree, locationData, featuredProviders] = await Promise.all([
    categoriesApi.getCategoryTree("services"),
    locationsApi.getAllLocations(),
    getFeaturedProviders(),
  ]);

  // Transform categories and regions using the same functions as listing page
  const categories = transformServiceCategories(
    categoryTree?.data ?? categoryTree?.categories ?? categoryTree ?? []
  ).filter((category) => category.id);
  const regions = transformRegionsResponse(locationData);

  const filters = {
    query: resolvedSearchParams?.query || "",
    category: resolvedSearchParams?.category || "",
    subcategory: resolvedSearchParams?.subcategory || "",
    region: resolvedSearchParams?.region || "",
    area: resolvedSearchParams?.area || "",
    sortBy: resolvedSearchParams?.sortBy || "price-low-high",
  };

  if (resolvedSearchParams?.priceMin) {
    filters.priceMin = Number.parseInt(resolvedSearchParams.priceMin, 10) || 0;
  }

  if (resolvedSearchParams?.priceMax) {
    filters.priceMax =
      Number.parseInt(resolvedSearchParams.priceMax, 10) ||
      Number.POSITIVE_INFINITY;
  }

  const [priceBounds] = await Promise.all([derivePriceRangeOptions()]);
  const popularTags = getPopularTags();

  return (
    <main className="bg-white min-h-screen">
      <Suspense fallback={<ServicesResultsSkeleton />}>
        <ServicesLanding
          categories={categories}
          regions={regions}
          featuredProviders={featuredProviders}
          initialListings={[]}
          priceBounds={priceBounds}
          initialFilters={filters}
          popularTags={popularTags}
        />
      </Suspense>
    </main>
  );
}


