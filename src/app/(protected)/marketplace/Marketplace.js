import MarketplaceCategories from "./MarketplaceCategories";
import MarketplaceCard from "./MarketplaceCard";
import PopularProductCard from "./PopularProductCard";
import LatestNews from "@/components/WebsiteComponents/ReuseableComponenets/LatestNews";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { Heading } from "./Heading";
import { SearchFilter } from "./SearchFilter";
import { Suspense } from "react";
import { fetchAllCategories } from "@/lib/api/category.server";
import {
  fetchAllListings,
  fetchAllListingsByFilter,
} from "@/lib/api/listings.server";

export default async function Marketplace({ searchParams }) {
  const categoryIdFilter = searchParams?.category_id || "";
  const search = searchParams?.search || "";
  const city = searchParams?.city || "";
  const region_id = searchParams?.region_id || "";
  const governorate_id = searchParams?.governorate_id || "";
  const creator_id = searchParams?.creator_id || "";



  const [catResult, listings] = await Promise.all([
    fetchAllCategories(),
    fetchAllListingsByFilter({
      listing_type: "marketplace",
      category_id: categoryIdFilter,
      search: search,
      region_id: region_id,
      governorate_id: governorate_id,
      city: city,
      creator_id: creator_id,
      page: 1,
    }),
  ]);

  const { categories, isLoading, error } = catResult;

  const dealCards =
    Array.isArray(listings?.data)
      ? listings?.data?.slice(0, 8)
      : Array.isArray(listings?.data)
        ? listings?.data?.slice(0, 8)
        : [];

  const popularCards =
    Array.isArray(listings?.data)
      ? listings?.data?.slice(0, 4)
      : [];


  return (
    <div className="w-full">
      <div className="">
        <div
          className="w-full rounded-b-[80px] text-white text-left"
          style={{ background: "#175f48" }}
        >
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]}
            styles={{
              nav: "flex justify-start px-10 pt-4 text-sm font-medium",
            }}
          />
          <div className="mt-3 border-b border-white opacity-40 mx-8"></div>
          <Heading />
        </div>

        <SearchFilter />

        <div className="md:p-10 p-3 bg-white">
          <MarketplaceCategories
            heading="Marketplace"
            categories={categories}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      <div className="md:px-20" id="marketplace-deals">
        {/* <div className="md:px-20 mb-4 px-3">
          <p className="text-gray-600">
            Show {listings?.total_record || 0} results for{" "}
            <span className="font-semibold">{search || "all"}</span>
          </p>
        </div> */}
        <MarketplaceCard
          heading="Deals"
          // cards={listings?.data?.slice(0, 8) || []}
          cards={dealCards}
          seeMoreLink="/search?keyword=&listing_type=marketplace"
        />
      </div>

      <Suspense
        fallback={
          <div className="py-10 text-center">Loading popular products...</div>
        }
      >
        <PopularProductCard
          categories={categories}
          // cards={listings?.data?.slice(0, 4)}
          cards={popularCards}
        />
      </Suspense>

      {/* <div className="md:px-10 px-3 mt-10">
        <LatestNews />
      </div> */}
    </div>
  );
}
