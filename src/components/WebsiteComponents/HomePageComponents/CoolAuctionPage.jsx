// // "use client";
// // import React, { useEffect } from "react";
// // import Link from "next/link";
// // import { Image_NotFound, Image_URL } from "@/config/constants";
// // import { useWatchlistStore } from "@/lib/stores/watchlistStore";
// // import { listingsApi } from "@/lib/api/listings";
// // import MarketplaceCard from "@/app/(protected)/marketplace/MarketplaceCard";

// // const CoolAuctionPage = () => {
// //   const { watchlist, fetchWatchlist } = useWatchlistStore();

// //   useEffect(() => {
// //     fetchWatchlist();

// //     const fetchListings = async () => {
// //       try {
// //         const response = await listingsApi.getListings(); // ✅ ye function hai
// //         console.log("Listings API Response:", response);
// //       } catch (error) {
// //         console.error("Error fetching listings:", error);
// //       }
// //     };

// //     fetchListings();
// //   }, []);

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-3xl font-semibold mb-6 text-center">
// //         <span className="inline-block border-b-2 border-gray-400">
// //           All Cool Auctions
// //         </span>
// //       </h1>

// //       {watchlist?.length > 0 ? (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //           {watchlist.map((item, index) => (
// //             <Link
// //               key={index}
// //               href={`/marketplace/${item.listing?.category_id || "unknown"}/${item.listing?.slug}`}
// //               className="bg-[#FBFBFB] p-2 rounded-lg hover:shadow-lg transition-shadow"
// //             >
// //               <img
// //                 src={
// //                   item.listing?.images?.[0]?.image_path
// //                     ? `${Image_URL}${item.listing.images[0].image_path}`
// //                     : Image_NotFound
// //                 }
// //                 alt={item.listing?.images?.[0]?.alt_text || "Product Image"}
// //                 className="w-full h-52 object-cover rounded-t"
// //               />

// //               <div className="px-3 pt-3">
// //                 <div className="flex items-center justify-between gap-2 mb-1">
// //                   {item.listing?.category?.name && (
// //                     <span className="text-xs text-gray-600 font-medium">
// //                       {item.listing.category.name}
// //                     </span>
// //                   )}
// //                   <div className="text-xs text-gray-600 font-medium">
// //                     {item.listing?.expire_at && (
// //                       <>
// //                         Closes:{" "}
// //                         {new Date(item.listing.expire_at).toLocaleDateString("en-US", {
// //                           weekday: "short",
// //                           day: "numeric",
// //                           month: "short",
// //                         })}
// //                       </>
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div className="text-lg font-semibold truncate">
// //                   {item.listing?.title}
// //                 </div>

// //                 <div className="border-t border-gray-200 my-1" />

// //                 <div className="flex justify-between mt-1">
// //                   <div className="text-gray-700">
// //                     <div className="text-[10px] text-gray-400 tracking-wide">
// //                       City:
// //                     </div>
// //                     <div className="font-bold text-xs">
// //                       {item.listing?.creator?.city ||
// //                         item.listing?.creator?.billing_address ||
// //                         "N/A"}
// //                     </div>
// //                   </div>

// //                   {item.listing?.buy_now_price && (
// //                     <div className="text-right text-gray-700">
// //                       <div className="text-[9px] text-gray-400 uppercase tracking-wide">
// //                         Buy Now:
// //                       </div>
// //                       <div className="font-bold">
// //                         <span className="price">$</span>
// //                         {item.listing.buy_now_price}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="text-center text-gray-500 py-10">
// //           No Cool Auctions Found
// //         </div>
// //       )}
// //     </div>

// //   );
// // };

// // export default CoolAuctionPage;

// // "use client";
// // import React, { useEffect } from "react";
// // import Link from "next/link";
// // import { Image_NotFound, Image_URL } from "@/config/constants";
// // import { useWatchlistStore } from "@/lib/stores/watchlistStore";
// // import { listingsApi } from "@/lib/api/listings";

// // const CoolAuctionPage = ({ heading = "All Cool Auctions", noDataText = "No Cool Auctions Found" }) => {
// //   const { watchlist, fetchWatchlist } = useWatchlistStore();

// //   useEffect(() => {
// //     fetchWatchlist();

// //     const fetchListings = async () => {
// //       try {
// //         const response = await listingsApi.getListings();
// //         console.log("Listings API Response:", response);
// //       } catch (error) {
// //         console.error("Error fetching listings:", error);
// //       }
// //     };

// //     fetchListings();
// //   }, []);

// //   return (
// //     <div className="p-6">
// //       {/* ✅ Heading props se aayi */}
// //       <h1 className="text-3xl font-semibold mb-6 text-center">
// //         <span className="inline-block border-b-2 border-gray-400">
// //           {heading}
// //         </span>
// //       </h1>

// //       {watchlist?.length > 0 ? (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //           {watchlist.map((item, index) => (
// //             <Link
// //               key={index}
// //               href={`/marketplace/${item.listing?.category_id || "unknown"}/${item.listing?.slug}`}
// //               className="bg-[#FBFBFB] p-2 rounded-lg hover:shadow-lg transition-shadow"
// //             >
// //               <img
// //                 src={
// //                   item.listing?.images?.[0]?.image_path
// //                     ? `${Image_URL}${item.listing.images[0].image_path}`
// //                     : Image_NotFound
// //                 }
// //                 alt={item.listing?.images?.[0]?.alt_text || "Product Image"}
// //                 className="w-full h-52 object-cover rounded-t"
// //               />

// //               <div className="px-3 pt-3">
// //                 <div className="flex items-center justify-between gap-2 mb-1">
// //                   {item.listing?.category?.name && (
// //                     <span className="text-xs text-gray-600 font-medium">
// //                       {item.listing.category.name}
// //                     </span>
// //                   )}
// //                   <div className="text-xs text-gray-600 font-medium">
// //                     {item.listing?.expire_at && (
// //                       <>
// //                         Closes:{" "}
// //                         {new Date(item.listing.expire_at).toLocaleDateString("en-US", {
// //                           weekday: "short",
// //                           day: "numeric",
// //                           month: "short",
// //                         })}
// //                       </>
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div className="text-lg font-semibold truncate">
// //                   {item.listing?.title}
// //                 </div>

// //                 <div className="border-t border-gray-200 my-1" />

// //                 <div className="flex justify-between mt-1">
// //                   <div className="text-gray-700">
// //                     <div className="text-[10px] text-gray-400 tracking-wide">
// //                       City:
// //                     </div>
// //                     <div className="font-bold text-xs">
// //                       {item.listing?.creator?.city ||
// //                         item.listing?.creator?.billing_address ||
// //                         "N/A"}
// //                     </div>
// //                   </div>

// //                   {item.listing?.buy_now_price && (
// //                     <div className="text-right text-gray-700">
// //                       <div className="text-[9px] text-gray-400 uppercase tracking-wide">
// //                         Buy Now:
// //                       </div>
// //                       <div className="font-bold">
// //                         <span className="price">$</span>
// //                         {item.listing.buy_now_price}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       ) : (
// //         // ✅ No data text props se aaya
// //         <div className="text-center text-gray-500 py-10">
// //           {noDataText}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CoolAuctionPage;

// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { Image_NotFound, Image_URL } from "@/config/constants";
// import { listingsApi } from "@/lib/api/listings";

// const CoolAuctionPage = ({ heading = "All Cool Auctions", noDataText = "No Cool Auctions Found" }) => {
//   const [listings, setListings] = useState([]); // ✅ Listings state

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await listingsApi.getListings();
//         console.log("Listings API Response:", response);

//         // Agar response me data array hai
//         setListings(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };

//     fetchListings();
//   }, []);

//   return (
//     <div className="p-6">
//       {/* ✅ Heading props se aayi */}
//       <h1 className="text-3xl font-semibold mb-6 text-center">
//         <span className="inline-block border-b-2 border-gray-400">
//           {heading}
//         </span>
//       </h1>

//       {listings.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {listings.map((item, index) => (
//             <Link
//               key={index}
//               href={`/marketplace/${item.category_id || "unknown"}/${item.slug}`}
//               className="bg-[#FBFBFB] p-2 rounded-lg hover:shadow-lg transition-shadow"
//             >
//               <img
//                 src={
//                   item.images?.[0]?.image_path
//                     ? `${Image_URL}${item.images[0].image_path}`
//                     : Image_NotFound
//                 }
//                 alt={item.images?.[0]?.alt_text || "Product Image"}
//                 className="w-full h-52 object-cover rounded-t"
//               />

//               <div className="px-3 pt-3">
//                 <div className="flex items-center justify-between gap-2 mb-1">
//                   {item.category?.name && (
//                     <span className="text-xs text-gray-600 font-medium">
//                       {item.category.name}
//                     </span>
//                   )}
//                   <div className="text-xs text-gray-600 font-medium">
//                     {item.expire_at && (
//                       <>
//                         Closes:{" "}
//                         {new Date(item.expire_at).toLocaleDateString("en-US", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="text-lg font-semibold truncate">
//                   {item.title}
//                 </div>

//                 <div className="border-t border-gray-200 my-1" />

//                 <div className="flex justify-between mt-1">
//                   <div className="text-gray-700">
//                     <div className="text-[10px] text-gray-400 tracking-wide">
//                       City:
//                     </div>
//                     <div className="font-bold text-xs">
//                       {item.creator?.city ||
//                         item.creator?.billing_address ||
//                         "N/A"}
//                     </div>
//                   </div>

//                   {item.buy_now_price && (
//                     <div className="text-right text-gray-700">
//                       <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                         Buy Now:
//                       </div>
//                       <div className="font-bold">
//                         <span className="price">$</span>
//                         {item.buy_now_price}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         // ✅ No data text props se aaya
//         <div className="text-center text-gray-500 py-10">
//           {noDataText}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoolAuctionPage;
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Image_NotFound, Image_URL } from "@/config/constants";
import { listingsApi } from "@/lib/api/listings";
import { useTranslation } from "react-i18next";

const CoolAuctionPage = ({
  heading = "All Cool Auctions",
  noDataText = "No Cool Auctions Found",
}) => {
  const [listings, setListings] = useState([]); // ✅ Listings state
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listingsApi.getCoolAuctions();
        console.log("Cool Auctions API Response:", response);

        // Handle different response structures
        setListings(response?.data || response || []);
      } catch (error) {
        console.error("Error fetching cool auctions:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="p-6">
      {/* ✅ Heading props se aayi */}
      <h1 className="text-3xl font-semibold mb-6 text-center">
        <span className="inline-block border-b-2 border-gray-400">
          {heading}
        </span>
      </h1>

      {/* ✅ Loading dikhana */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* {listings.map((item, index) => (
            <Link
              key={index}
              href={`/marketplace/${item.category.slug || "unknown"}/${item.slug}`}
              className="bg-[#FBFBFB] p-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              <img
                src={
                  item.images?.[0]?.image_path
                    ? `${Image_URL}${item.images[0].image_path}`
                    : Image_NotFound
                }
                alt={item.images?.[0]?.alt_text || "Product Image"}
                className="w-full h-52 object-cover rounded-t"
              />

              <div className="px-3 pt-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {item.category?.name && (
                    <span className="text-xs text-gray-600 font-medium">
                      {item.category.name}
                    </span>
                  )}
                  <div className="text-xs text-gray-600 font-medium">
                    {item.expire_at && (
                      <>
                        Closes:{" "}
                        {new Date(item.expire_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-lg font-semibold truncate">
                  {item.title}
                </div>

                <div className="border-t border-gray-200 my-1" />

                <div className="flex justify-between mt-1">
                  <div className="text-gray-700">
                    <div className="text-[10px] text-gray-400 tracking-wide">
                      City:
                    </div>
                    <div className="font-bold text-xs">
                      {item.creator?.city ||
                        item.creator?.billing_address ||
                        "N/A"}
                    </div>
                  </div>

                  {item.buy_now_price && (
                    <div className="text-right text-gray-700">
                      <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                        Buy Now:
                      </div>
                      <div className="font-bold">
                        <span className="price">$</span>
                        {item.buy_now_price}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))} */}
          {listings?.map((item, index) => {
            const lastSlug = item.category?.slug?.split("/").pop() || "unknown";
            if (item?.bids_count > 0) {
              console.log("item", item);
            }
            return (
              <Link
                key={index}
                href={`/marketplace/${lastSlug}/${item.slug}`}
                className="bg-[#FBFBFB] p-2 rounded-lg hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    item.images?.[0]?.image_path
                      ? `${Image_URL}${item.images[0].image_path}`
                      : Image_NotFound
                  }
                  alt={item.images?.[0]?.alt_text || "Product Image"}
                  className="w-full h-52 object-cover rounded-t"
                />

                <div className="px-3 pt-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {item.category?.name && (
                      <span className="text-xs text-gray-600 font-medium">
                        {item.category.name}
                      </span>
                    )}
                    <div className="text-xs text-gray-600 font-medium">
                      {item.expire_at && (
                        <>
                          Closes:{" "}
                          {new Date(item.expire_at).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-lg font-semibold truncate">
                    {item.title}
                  </div>

                  <div className="border-t border-gray-200 my-1" />

                  <div className="flex justify-between mt-1">
                    <div className="text-gray-700">
                      <div className="text-[10px] text-gray-400 tracking-wide">
                        {t("Location")}:
                      </div>
                      <div className="font-bold text-xs">
                        {(item.creator?.regions?.name ||
                          item.creator?.billing_address) && (
                          <>
                            <div className="font-bold text-xs">
                              {`${
                                item?.creator?.address_1
                                  ? `${item?.creator?.address_1}, `
                                  : ""
                              } ${item?.creator?.governorates?.name}, ${
                                item?.creator?.regions?.name
                              }`}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* {item.buy_now_price && (
                      <div className="text-right text-gray-700">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                          Buy Now:
                        </div>
                        <div className="font-bold">
                          <span className="price">$</span>
                          {item.buy_now_price}
                        </div>
                      </div>
                    )} */}
                    {item.bids_count === 0
                      ? item.buy_now_price && (
                          <div className="text-right text-gray-700 flex flex-col items-end">
                            <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                              {t("Buy Now")}:
                            </div>
                            <div className="font-bold">
                              <span className="price">$</span>
                              {item.buy_now_price}
                            </div>
                          </div>
                        )
                      : item.bids_count &&
                        item.bids?.length > 0 && (
                          <div className="text-right text-gray-700 flex flex-col items-end">
                            <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                              {t("Current Bid")}:
                            </div>
                            <div className="font-bold">
                              <span className="price">$</span>
                              {item.bids?.[0]?.amount}
                            </div>
                          </div>
                        )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // ✅ No data text props se aaya
        <div className="text-center text-gray-500 py-10">{noDataText}</div>
      )}
    </div>
  );
};

export default CoolAuctionPage;
