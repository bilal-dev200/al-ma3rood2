"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/WebsiteComponents/ReuseableComponenets/Sidebar";
import { FaThList } from "react-icons/fa";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
import {
  filterCategories,
  Image_NotFound,
  Image_URL,
} from "@/config/constants";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";


const Page = () => {
    const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showListingDropdown, setShowListingDropdown] = useState(false);

  const { watchlist, fetchWatchlist } = useWatchlistStore();

  useEffect(() => {
    fetchWatchlist();
  }, []);
 useEffect(() => {
    console.log("Watchlist from store:", watchlist);
  }, [watchlist]);

  const filteredWatchlist = watchlist.filter((item) =>
    item?.listing?.title?.toLowerCase().includes(search.toLowerCase())
  );
 useEffect(() => {
    console.log("Filtered Watchlist:", filteredWatchlist);
  }, [filteredWatchlist]);
  return (
    <div className="flex items-start md:p-10 text-black">
      <Sidebar />

      <main className="flex-1 p-5">
        <div className="max-w-5xl mx-auto p-4">
          <h2 className="text-2xl font-bold text-green-700">
            {t("Watchlist Listings")}
          </h2>

          <input
            type="text"
            placeholder={t("Search listings...")}
            className="border px-4 py-2 rounded-md mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredWatchlist.map((item) => {
            const listing = item?.listing;
            const imageUrl = listing?.images?.[0]?.image_path
              ? `${Image_URL}${listing.images[0].image_path}`
              : Image_NotFound;

            const getListingUrl = () => {
              // Check listing.type first for service and job
              if (listing.type === "service") {
                return `/services/${listing?.slug}`;
              }
              
              if (listing.type === "job") {
                return `/jobs/${listing?.slug}`;
              }

              // Then check listing_type for marketplace, property, and motors
              const catSlug = listing.category?.slug?.includes("/")
                ? listing.category.slug.split("/").pop()
                : listing.category?.slug || "unknown";

              switch (listing.listing_type) {
                case "marketplace":
                  return `/marketplace/${catSlug}/${listing?.slug}`;
                case "property":
                case "motors":
                  return `/${listing.listing_type}/${listing?.slug}`;
                default:
                  console.warn("Unknown listing type:", listing.listing_type, listing.type);
                  return "#";
              }
            };

            const listingUrl = getListingUrl();
            const highestBid = listing?.bids?.[0];
            const hasBids = listing?.bids_count > 0;
            const buyNowPrice = listing?.buy_now_price;
            const startPrice = listing?.start_price;

            return (
              <div
                key={item.id}
                className="bg-white rounded w-full max-w-[300px] sm:max-w-full shadow mb-6 mx-auto"
              >
                <div
                  onClick={() => router.push(listingUrl)}
                  className="block cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4">
                    {/* Image */}
                    <div className="w-full sm:w-28 h-40 relative">
                      <Image
                        src={imageUrl}
                        alt={listing?.title || "Watchlist item"}
                        fill
                        className="object-contain rounded"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs text-gray-500 mb-1 uppercase">
                          {t("Listing Type:")} {listing?.listing_type || listing?.type || "N/A"}
                        </span>
                        {listing?.expire_at && (
                          <span className="text-xs text-gray-500 mb-1 uppercase">
                            {t("Closing Date:")}{" "}
                            {new Date(listing.expire_at).toDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-md font-semibold text-gray-800 my-1">
                        {listing?.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Views / Price */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600 px-4 sm:px-6">
                  <div className="flex gap-6 mt-2 items-center">
                    {listing?.views && (
                      <span>
                        👁️ {listing.views} {t("views")}
                      </span>
                    )}
                    {hasBids && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {listing.bids_count} {t("Bid")}
                        {listing.bids_count !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="text-right sm:text-left mt-2 sm:mt-0">
                    {buyNowPrice ? (
                      <>
                        <span className="text-xs text-gray-500 block">{t("Buy Now")}</span>
                        <span className="font-semibold text-gray-800 text-base">
                          <span className="price">$</span>
                          <span className="ml-1">{buyNowPrice}</span>
                        </span>
                      </>
                    ) : hasBids && highestBid ? (
                      <>
                        <span className="text-xs text-gray-500 block">{t("Current Bid")}</span>
                        <span className="font-semibold text-gray-800 text-base">
                          <span className="price">$</span>
                          <span className="ml-1">{highestBid.amount}</span>
                        </span>
                      </>
                    ) : startPrice ? (
                      <>
                        <span className="text-xs text-gray-500 block">{t("Starting Price")}</span>
                        <span className="font-semibold text-gray-800 text-base">
                          <span className="price">$</span>
                          <span className="ml-1">{startPrice}</span>
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Page;
