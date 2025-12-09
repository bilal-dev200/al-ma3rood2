// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { Image_NotFound, Image_URL } from "@/config/constants";
// import { useWatchlistStore } from "@/lib/stores/watchlistStore";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Watchlist = () => {
//   const { watchlist, fetchWatchlist } = useWatchlistStore();
//   const scrollRef = useRef(null);

//   const [isAtStart, setIsAtStart] = useState(true);
//   const [isAtEnd, setIsAtEnd] = useState(false);

//   useEffect(() => {
//     fetchWatchlist();
//   }, []);

//   const limitedWatchlist = watchlist?.slice(0, 5) || [];

//   const handleScroll = () => {
//     if (scrollRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//       setIsAtStart(scrollLeft === 0);
//       setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
//     }
//   };

//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="relative p-4">
//       <h2 className="text-2xl font-semibold pb-1 mb-6 text-center">
//         <span className="inline-block border-b-2 border-gray-400">
//           Watchlist
//         </span>
//       </h2>

//       {/* Left Arrow */}
//       <button
//         onClick={scrollLeft}
//         disabled={isAtStart}
//         className={`absolute -ml-10 top-1/2 -translate-y-1/2 rounded-full p-2 z-10
//           ${isAtStart ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow-md hover:bg-gray-100"}`}
//       >
//         <FaChevronLeft size={22} />
//       </button>

//       {/* Horizontal scrollable container */}
//       <div
//         ref={scrollRef}
//         onScroll={handleScroll}
//         className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
//       >
//         {limitedWatchlist.length > 0 ? (
//           limitedWatchlist.map((item, index) => (
//             <Link
//               key={index}
//               href={`/marketplace/${item.listing?.category_id || "unknown"}/${item.listing?.slug}`}
//               className="min-w-[250px] max-w-[250px] bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow flex-shrink-0"
//             >
//               <img
//                 src={
//                   item.listing?.images?.[0]?.image_path
//                     ? `${Image_URL}${item.listing.images[0].image_path}`
//                     : Image_NotFound
//                 }
//                 alt={item.listing?.images?.[0]?.alt_text || "Product Image"}
//                 className="w-full h-48 object-cover rounded-t bg-white"
//               />

//               <div className="px-3 pt-3">
//                 <div className="flex items-center justify-between gap-2 mb-1">
//                   {item.listing?.category?.name && (
//                     <span className="text-xs text-gray-600 font-medium">
//                       Category: {item.listing.category.name}
//                     </span>
//                   )}

//                   <div className="text-xs text-gray-600 font-medium">
//                     {item.listing?.expire_at ? (
//                       <>
//                         <span>Closes</span>:{" "}
//                         {new Date(item.listing.expire_at).toLocaleDateString(
//                           "en-US",
//                           {
//                             weekday: "short",
//                             day: "numeric",
//                             month: "short",
//                           }
//                         )}
//                       </>
//                     ) : (
//                       <span className="invisible">placeholder</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="text-lg font-semibold">
//                   {item.listing?.title?.length > 18
//                     ? `${item.listing.title.slice(0, 18)}...`
//                     : item.listing?.title}
//                 </div>

//                 <div className="border-t border-gray-200 my-1" />

//                 <div className="flex justify-between mt-1">
//                   <div className="text-gray-700">
//                     <div className="text-[10px] text-gray-400 tracking-wide">
//                       City:
//                     </div>
//                     <div className="font-bold text-xs">
//                       {item.listing?.creator?.city ||
//                         item.listing?.creator?.billing_address ||
//                         "N/A"}
//                     </div>
//                   </div>

//                   {item.listing?.buy_now_price && (
//                     <div className="text-right text-gray-700 flex flex-col items-end">
//                       <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                         Buy Now:
//                       </div>
//                       <div className="font-bold">
//                         <span className="price">$</span>
//                         {item.listing.buy_now_price}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="text-center col-span-full text-gray-500 py-6">
//             No products found
//           </div>
//         )}

//         {/* Last card: See More */}
//         {watchlist?.length > 4 && (
//           <Link
//             href="/watchlist"
//             className="min-w-[250px] max-w-[250px] flex flex-col items-center justify-center
//               bg-[#F5F5F5] border-2 border-gray-300 rounded-xl shadow-sm
//               hover:shadow-md transition-all duration-300
//               flex-shrink-0 group"
//           >
//             <span className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-black">
//               See More
//             </span>
//             <span className="flex items-center gap-2 text-sm text-gray-500 font-medium group-hover:text-gray-700">
//               Explore All{" "}
//               <FaChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
//             </span>
//           </Link>
//         )}
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={scrollRight}
//         disabled={isAtEnd}
//         className={`absolute -right-7 top-1/2 -translate-y-1/2 rounded-full p-2 z-10
//           ${isAtEnd ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow-md hover:bg-gray-100"}`}
//       >
//         <FaChevronRight size={22} />
//       </button>
//     </div>
//   );
// };

// export default Watchlist;

"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Image_NotFound, Image_URL } from "@/config/constants";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


const Watchlist = () => {
    const { watchlist, fetchWatchlist } = useWatchlistStore();
    const scrollRef = useRef(null);
    const { t, i18n } = useTranslation();

    const isRTL = i18n.dir() === "rtl";

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const limitedWatchlist = watchlist?.slice(0, 5) || [];

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
        }
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // ✅ Agar watchlist empty hai to pura section hi hide ho jaye
    if (!limitedWatchlist.length) {
        return null;
    }

    return (
        <div className="relative p-4">
            <h2 className="text-2xl font-semibold pb-1 mb-6 text-center">
                <span className="inline-block border-b-2 border-gray-400">
                    {t("Watchlist")}
                </span>
            </h2>

            {/* Left Arrow */}
            {/* <button
                onClick={scrollLeft}
                disabled={isAtStart}
                className={`absolute -ml-10 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 
          ${isAtStart
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-gray-100"
                    }`}
            >
                <FaChevronLeft size={22} />
            </button> */}
            {/* <button
    onClick={scrollLeft}
    disabled={isAtStart}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-right-7" : "-left-10"} 
        ${isAtStart
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    <FaChevronLeft size={22} />
</button> */}
            {/* <button
    onClick={scrollLeft}
    disabled={isAtStart}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-right-7" : "-left-10"} 
        ${isAtStart
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    <FaChevronLeft size={22} />
</button> */}
            {/* <button
    onClick={scrollLeft}
    disabled={isAtStart}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-right-7" : "-left-10"} 
        ${isAtStart
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    {isRTL ? <FaChevronRight size={22} /> : <FaChevronLeft size={22} />}
</button> */}
            <button
                onClick={scrollLeft}
                disabled={isAtStart}
                className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
      ${isRTL ? "-right-7" : "-left-10"} 
      ${isAtStart
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-gray-100"
                    }`}
            >
                {isRTL ? <FaChevronRight size={22} /> : <FaChevronLeft size={22} />}
            </button>

            {/* Horizontal scrollable container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
            >
                {limitedWatchlist.map((item, index) => (
                    <Link
                        key={index}
                        href={`/marketplace/${item.listing?.category_id || "unknown"}/${item.listing?.slug
                            }`}
                        className="min-w-[250px] max-w-[250px] bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow flex-shrink-0"
                    >
                        <img
                            src={
                                item.listing?.images?.[0]?.image_path
                                    ? `${Image_URL}${item.listing.images[0].image_path}`
                                    : Image_NotFound
                            }
                            alt={item.listing?.images?.[0]?.alt_text || "Product Image"}
                            className="w-full h-48 object-cover rounded-t bg-white"
                        />

                        <div className="px-3 pt-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                {item.listing?.category?.name && (
                                    <span className="text-xs text-gray-600 font-medium">
                                        {t("Category")}: {item.listing.category.name}
                                    </span>
                                )}

                                <div className="text-xs text-gray-600 font-medium">
                                    {item.listing?.expire_at ? (
                                        <>
                                            <span>Closes</span>:{" "}
                                            {new Date(item.listing.expire_at).toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                }
                                            )}
                                        </>
                                    ) : (
                                        <span className="invisible">{t("placeholder")}</span>
                                    )}
                                </div>
                            </div>

                            <div className="text-lg font-semibold">
                                {item.listing?.title?.length > 18
                                    ? `${item.listing.title.slice(0, 18)}...`
                                    : item.listing?.title}
                            </div>

                            <div className="border-t border-gray-200 my-1" />

                            <div className="flex justify-between mt-1">
                                <div className="text-gray-700">
                                    <div className="text-[10px] text-gray-400 tracking-wide">
                                        {t("City:")}
                                    </div>
                                    <div className="font-bold text-xs">
                                        {item.listing?.creator?.city ||
                                            item.listing?.creator?.billing_address ||
                                            "N/A"}
                                    </div>
                                </div>

                                {(() => {
                                    const expireAt = item.listing?.expire_at
                                        ? new Date(item.listing.expire_at)
                                        : null;
                                    const now = new Date();
                                    const isExpired = expireAt && expireAt < now;
                                    const hasBuyNow = !!item.listing?.buy_now_price;
                                    const bids = item.listing?.bids || [];
                                    const hasBids = bids.length > 0;
                                    console.log('hasbids', hasBids);
                                    const highestBid = hasBids ? bids[0].amount : null;
                                    console.log('highestBid', highestBid);

                                    if (hasBuyNow) {
                                        return (
                                            <div className={`text-right flex flex-col items-end text-gray-700`}>
                                                {isExpired && (
                                                    <div className="text-[9px] text-red-400 uppercase tracking-wide">
                                                        {t("Listing Expired")}
                                                    </div>
                                                )}
                                                <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                                    {t("Buy Now:")}
                                                </div>
                                                <div className="font-bold">
                                                    <span className="price">$</span>
                                                    {item.listing.buy_now_price}
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (hasBids) {
                                        return (
                                            <div className={`text-right flex flex-col items-end text-gray-700`}>
                                                {isExpired && (
                                                    <div className="text-[9px] text-red-400 uppercase tracking-wide">
                                                        {t("Listing Expired")}
                                                    </div>
                                                )}
                                                <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                                    {isExpired ? "Highest Bid:" : "Current Bid:"}
                                                </div>
                                                <div className="font-bold">
                                                    <span className="price">$</span>
                                                    {highestBid}
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (isExpired) {
                                        return (
                                            <div className="text-right text-red-600 flex flex-col items-end">
                                                <div className="text-[9px] text-red-400 uppercase tracking-wide">
                                                    {t("Listing Expired")}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return null;
                                })()}
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Last card: See More */}
                {watchlist?.length > 4 && (
                    <Link
                        href="/watchlist"
                        className="min-w-[250px] max-w-[250px] flex flex-col items-center justify-center 
              bg-[#F5F5F5] border-2 border-gray-300 rounded-xl shadow-sm 
              hover:shadow-md transition-all duration-300  
              flex-shrink-0 group"
                    >
                        <span className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-black">
                            {t("See More")}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-500 font-medium group-hover:text-gray-700">
                            {t("Explore All")}
                            {isRTL ? (
                                <FaChevronLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                            ) : (
                                <FaChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            )}
                        </span>
                    </Link>
                )}
            </div>

            {/* Right Arrow */}
            {/* <button
                onClick={scrollRight}
                disabled={isAtEnd}
                className={`absolute -right-7 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 
          ${isAtEnd
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-gray-100"
                    }`}
            >
                <FaChevronRight size={22} />
            </button> */}
            {/* <button
    onClick={scrollRight}
    disabled={isAtEnd}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-left-10" : "-right-7"} 
        ${isAtEnd
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    <FaChevronRight size={22} />
</button> */}
            {/* <button
    onClick={scrollRight}
    disabled={isAtEnd}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-left-10" : "-right-7"} 
        ${isAtEnd
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    <FaChevronRight size={22} />
</button> */}
            {/* <button
    onClick={scrollRight}
    disabled={isAtEnd}
    className={`absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
        ${isRTL ? "-left-10" : "-right-7"} 
        ${isAtEnd
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-100"
        }`}
>
    {isRTL ? <FaChevronLeft size={22} /> : <FaChevronRight size={22} />}
</button> */}
            <button
                onClick={scrollRight}
                disabled={isAtEnd}
                className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10
      ${isRTL ? "-left-10" : "-right-7"} 
      ${isAtEnd
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-gray-100"
                    }`}
            >
                {isRTL ? <FaChevronLeft size={22} /> : <FaChevronRight size={22} />}
            </button>
        </div>
    );
};

export default Watchlist;
