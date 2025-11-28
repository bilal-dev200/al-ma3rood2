"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { Image_URL, Image_NotFound } from "@/config/constants";
import Image from "next/image";
import { listingsApi } from "@/lib/api/listings";

export default function CreatorListingsClient({
  listings: initialListings,
  creatorInfo: initialCreatorInfo,
  creatorId,
}) {
  const [listings, setListings] = useState(initialListings || []);
  const [creatorInfo, setCreatorInfo] = useState(initialCreatorInfo);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const status = searchParams?.get("status") || "1";

  useEffect(() => {
    // If we have initial listings, we're good
    if (initialListings?.length > 0) {
      setListings(initialListings);
      setCreatorInfo(initialCreatorInfo);
    }
  }, [initialListings, initialCreatorInfo]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await listingsApi.getListingsByFilter({
        creator_id: creatorId,
        pagination: {
          page: page + 1,
          per_page: 20,
        },
      });

      const newListings = response?.data?.data || [];
      const currentPage = response?.data?.current_page || page + 1;
      const lastPage = response?.data?.last_page || 1;
      
      if (newListings.length === 0 || currentPage >= lastPage) {
        setHasMore(false);
      } else {
        setListings((prev) => [...prev, ...newListings]);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Error loading more listings:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const getListingUrl = (listing) => {
    if (listing.listing_type === "motors") {
      return `/motors/${listing.slug}`;
    }
    if (listing.listing_type === "property") {
      return `/property/${listing.slug}`;
    }
    const lastSlug = listing.category?.slug?.includes("/")
      ? listing.category.slug.split("/").pop()
      : listing.category?.slug || "unknown";
    return `/marketplace/${lastSlug}/${listing.slug}`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: creatorInfo?.name || "Creator Listings" },
        ]}
        styles={{
          nav: "flex justify-start px-4 md:px-10 pt-4 text-sm font-medium bg-white",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Creator Info Header */}
        {creatorInfo && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#469BDB] text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
                {creatorInfo?.profile_photo ? (
                  <Image
                    src={`${Image_URL}${creatorInfo.profile_photo}`}
                    alt={creatorInfo.name || "Creator"}
                    width={64}
                    height={64}
                    className="object-cover rounded-full"
                  />
                ) : (
                  creatorInfo?.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {creatorInfo.name || "Creator"}
                </h1>
                {creatorInfo.rating && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t("Rating")}: {creatorInfo.rating}{" "}
                    {"🌟".repeat(Math.floor(creatorInfo.rating) || 0)}
                  </p>
                )}
                {(creatorInfo.city || creatorInfo.billing_address) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {creatorInfo.city || creatorInfo.billing_address}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Listings Count */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {listings.length} {t("Listings")}
          </h2>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing, index) => {
                const listingUrl = getListingUrl(listing);

                return (
                  <Link
                    key={listing.id || index}
                    href={listingUrl}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative w-full h-48 bg-gray-200">
                      <img
                        src={
                          listing.images?.[0]?.image_path
                            ? `${Image_URL}${listing.images[0].image_path}`
                            : Image_NotFound
                        }
                        alt={listing.images?.[0]?.alt_text || listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      {/* Category */}
                      {listing.category?.name && (
                        <div className="text-xs text-gray-500 mb-1">
                          {listing.category.name}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                        {listing.title}
                      </h3>

                      {/* Expiry Date */}
                      {listing.expire_at && (
                        <div className="text-xs text-gray-500 mb-2">
                          {t("Closes")}:{" "}
                          {new Date(listing.expire_at).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </div>
                      )}

                      {/* Price Section */}
                      <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-200">
                        {listing.bids_count === 0 ? (
                          listing.buy_now_price && (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                {t("Buy Now")}
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                ${listing.buy_now_price}
                              </span>
                            </div>
                          )
                        ) : listing.bids_count > 0 && listing.bids?.length > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              {t("Current Bid")}
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              ${listing.bids[0]?.amount}
                            </span>
                          </div>
                        ) : null}

                        {listing.bids_count > 0 && (
                          <div className="text-xs text-gray-500">
                            {listing.bids_count} {t("bids")}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? t("Loading...") : t("Load More")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">
              {t("No listings found for this creator.")}
            </p>
            <Link
              href="/marketplace"
              className="text-green-600 hover:text-green-800 mt-4 inline-block"
            >
              {t("Browse all listings")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

