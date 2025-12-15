// "use client";
// import { useTranslation } from "react-i18next";
// import Pagination from "@/components/WebsiteComponents/ReuseableComponenets/Pagination";
// import {
//   filterCategories as categoryFilters, // renamed imported variable if needed
//   Image_NotFound,
//   Image_URL,
// } from "@/config/constants";
// import Link from "next/link";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const MarketplaceCard = ({
//   heading,
//   cards,
//   categories,
//   centerHeading = false,
//   showCategoryFilters = false,
//   layout = "grid", // 'grid' or 'list'
//   pagination, // { currentPage, totalPages }
//   onPageChange,
// }) => {
//   const { t } = useTranslation();
//   const categoryNames = categories?.data?.map((category) => category.name);

//   return (
//     <div className="">
//       <h2
//         className={`text-2xl font-semibold pb-1 mb-6 ${
//           centerHeading ? "text-center" : ""
//         }`}
//       >
//         <span className="inline-block border-b-2 border-gray-400">
//           {t(
//             decodeURIComponent(heading)
//               .split(" ")
//               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(" ")
//           )}
//         </span>
//       </h2>

//       {showCategoryFilters && (
//         <div className="flex flex-wrap gap-2 mb-6 justify-center">
//           {categoryNames?.map((category, index) => (
//             <button
//               key={index}
//               className="px-4 py-2 text-sm rounded-full border border-black-600 hover:bg-black-100 transition-colors"
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       )}

//       <div
//         className={
//           layout === "grid"
//             ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//             : "flex flex-col gap-4"
//         }
//       >
//         {cards?.length > 0 ? (
//           cards.map((card, index) => (
//             <Link
//               key={index}
//               href={`/marketplace/${card.category?.slug || "unknown"}/${
//                 card.slug
//               }`}
//               className={
//                 layout === "grid"
//                   ? "block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full"
//                   : "flex bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full max-w-2xl"
//               }
//             >
//               <img
//                 src={
//                   card.images?.[0]?.image_path
//                     ? `${Image_URL}${card.images?.[0]?.image_path}`
//                     : Image_NotFound
//                 }
//                 alt={card.images?.[0]?.alt_text || "Product Image"}
//                 className={
//                   layout === "grid"
//                     ? "w-full h-48 object-cover rounded-t bg-white"
//                     : "w-32 h-32 object-cover rounded bg-white mr-4"
//                 }
//               />

//               <div
//                 className={
//                   layout === "grid"
//                     ? "px-3 pt-3"
//                     : "flex-1 flex flex-col justify-between py-2"
//                 }
//               >
//                 <div className="flex items-center justify-between gap-2 mb-1">
//                   {card.category?.name && (
//                     <span className="text-xs text-gray-600 font-medium">
//                       {t("Category")}: {card.category.name}
//                     </span>
//                   )}

//                   <div className="text-xs text-gray-600 font-medium">
//                     {card.expire_at ? (
//                       <>
//                         <span className="">{t("Closes")}</span>:{" "}
//                         {new Date(card.expire_at).toLocaleDateString("en-US", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </>
//                     ) : (
//                       <span className="invisible">placeholder</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="text-lg font-semibold">
//                   <div className="text-lg font-semibold">
//                     {card.title.length > 18
//                       ? `${card.title.slice(0, 18)}...`
//                       : card.title}

//                     <div className="border-t border-gray-200 my-1" />

//                     <div className="flex justify-between mt-1">
//                       {(card.creator?.city ||
//                         card.creator?.billing_address) && (
//                         <div className="text-gray-700">
//                           <div className="text-[10px] text-gray-400  tracking-wide">
//                             {t("City")}:{" "}
//                           </div>
//                           <div className="font-bold text-xs">
//                             {card.creator.city || card.creator.billing_address}
//                           </div>
//                         </div>
//                       )}

//                       {card.buy_now_price && (
//                         <div className="text-right text-gray-700 flex flex-col items-end">
//                           <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                             {t("Buy Now")}:
//                           </div>
//                           <div className="font-bold">
//                             <span className="price">$</span>
//                             {card.buy_now_price}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* {(card.creator?.city || card.creator?.billing_address) && (
//                       <div className="text-sm text-green-600 font-bold mt-1">
//                         {t("City")}:{" "}
//                         {card.creator.city || card.creator.billing_address}
//                       </div>
//                     )} */}
//                   {/* {card.expire_at && (
//                       <span className="text-xs text-gray-400">
//                         {t("Closes")}:{" "}
//                         {new Date(card.expire_at).toLocaleDateString("en-US", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </span>
//                     )} */}
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="text-center col-span-full text-gray-500 py-6">
//             {t("No products found")}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <Pagination
//           currentPage={pagination.currentPage}
//           totalPages={pagination.totalPages}
//           onPageChange={onPageChange}
//         />
//       )}
//     </div>
//   );
// };

// export default MarketplaceCard;
"use client";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/WebsiteComponents/ReuseableComponenets/Pagination";
import {
  filterCategories as categoryFilters,
  Image_NotFound,
  Image_URL,
} from "@/config/constants";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

const MarketplaceCard = ({
  heading,
  cards,
  categories,
  centerHeading = false,
  showCategoryFilters = false,
  pagination,
  onPageChange,
  seeMoreLink = "/coolAuction",
}) => {
  const { t, i18n } = useTranslation();
  const categoryNames = categories?.data?.map((category) => category.name);

  const isRTL = i18n.dir() === "rtl";
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const visibleCards = cards?.slice(0, 19) || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(checkScroll, 400);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <div className="relative mx-5 md:mx-0">
      {/* Heading */}
      {heading && (
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-semibold pb-1 mb-6 text-left whitespace-nowrap sm:whitespace-normal`}
        >
          <span className="inline-block md:border-b-2 border-gray-400">
            {t(
              decodeURIComponent(heading)
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            )}
          </span>
        </h2>
      )}
      {showCategoryFilters && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categoryNames?.map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 text-sm rounded-full border border-black-600 hover:bg-black-100 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Left Arrow */}
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

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {/* {visibleCards.length > 0 ? (
          visibleCards.map((card, index) => (
            <Link
              key={index}
              href={`/marketplace/${card.category?.slug || "unknown"}/${card.slug}`}
              className="min-w-[250px] max-w-[250px] bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow flex-shrink-0"
            >
              <img
                src={
                  card.images?.[0]?.image_path
                    ? `${Image_URL}${card.images?.[0]?.image_path}`
                    : Image_NotFound
                }
                alt={card.images?.[0]?.alt_text || "Product Image"}
                className="w-full h-48 object-cover rounded-t bg-white"
              />

              <div className="px-3 pt-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {card.category?.name && (
                    <span className="text-xs text-gray-600 font-medium">
                      {t("Category")}: {card.category.name}
                    </span>
                  )}
                  <div className="text-xs text-gray-600 font-medium">
                    {card.expire_at ? (
                      <>
                        <span>{t("Closes")}</span>:{" "}
                        {new Date(card.expire_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </>
                    ) : (
                      <span className="invisible">placeholder</span>
                    )}
                  </div>
                </div>

                <div className="text-lg font-semibold">
                  {card.title.length > 18
                    ? `${card.title.slice(0, 18)}...`
                    : card.title}
                </div>

                <div className="border-t border-gray-200 my-1" />

                <div className="flex justify-between mt-1">
                  {(card.creator?.city || card.creator?.billing_address) && (
                    <div className="text-gray-700">
                      <div className="text-[10px] text-gray-400 tracking-wide">
                        {t("City")}:
                      </div>
                      <div className="font-bold text-xs">
                        {card.creator.city || card.creator.billing_address}
                      </div>
                    </div>
                  )}
                  {card.buy_now_price && (
                    <div className="text-right text-gray-700 flex flex-col items-end">
                      <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                        {t("Buy Now")}:
                      </div>
                      <div className="font-bold">
                        <span className="price">$</span>
                        {card.buy_now_price}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500 py-6">
            {t("No products found")}
          </div>
        )} */}
        {/* const visibleCards = cards?.slice(0, 19) || [];
        console.log("visibleCards", visibleCards); */}

        {visibleCards.length > 0 ? (
          visibleCards.map((card, index) => {
            const lastSlug = card.category?.slug?.includes("/")
              ? card.category.slug.split("/").pop()
              : card.category?.slug || "unknown";

            return (
              <Link
                key={index}
                // href={`/marketplace/${lastSlug}/${card.slug}`}
                href={
                  card.listing_type === "motors"
                    ? `/motors/${card.slug}`
                    : card.listing_type === "property"
                      ? `/property/${card.slug}`
                      : `/marketplace/${lastSlug}/${card.slug}`
                }
                className="min-w-[250px] max-w-[250px] bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow flex-shrink-0"
              >
                <img
                  src={
                    card.images?.[0]?.image_path
                      ? `${Image_URL}${card.images?.[0]?.image_path}`
                      : Image_NotFound
                  }
                  alt={card.images?.[0]?.alt_text || "Product Image"}
                  className="w-full h-48 object-cover rounded-t bg-white"
                />

                <div className="px-3 pt-3">
                  <div className="flex items-start justify-between gap-2 line-clamp-2 min-h-[2.5rem]">
                    {card.category?.name && (
                      <span className="text-xs text-gray-600 font-medium">
                        {t("Category")}: {card.category.name}
                      </span>
                    )}
                    <div className="text-xs text-gray-600 font-medium">
                      {card.expire_at ? (
                        <>
                          <span>{t("Closes")}</span>:{" "}
                          {new Date(card.expire_at).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </>
                      ) : (
                        <span className="invisible">placeholder</span>
                      )}
                    </div>
                  </div>

                  <div className="text-lg font-semibold">
                    {card.title.length > 18
                      ? `${card.title.slice(0, 18)}...`
                      : card.title}
                  </div>

                  <div className="border-t border-gray-200 my-1" />

                  <div className="flex justify-between mt-1">
                    <div className="text-gray-700">
                      {(card.creator?.regions?.name ||
                        card.creator?.billing_address ||
                        card.creator?.address_1) && (
                          <>
                            <div className="text-[10px] text-gray-400 tracking-wide">
                              {t("Location")}:
                            </div>
                            <div className="font-bold text-xs">
                              {`${card?.creator?.address_1
                                ? `${card?.creator?.address_1}, `
                                : ""
                                } ${card?.creator?.governorates?.name}, ${card?.creator?.regions?.name
                                }`}
                            </div>
                          </>
                        )}
                    </div>

                    {card.bids_count === 0
                      ? card.buy_now_price && (
                        <div className="text-right text-gray-700 flex flex-col items-end">
                          <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                            {t("Buy Now")}:
                          </div>
                          <div className="font-bold">
                            <span className="price">$</span>
                            {card.buy_now_price}
                          </div>
                        </div>
                      )
                      : card.bids_count &&
                      card.bids?.length > 0 && (
                        <div className="text-right text-gray-700 flex flex-col items-end">
                          <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                            {t("Current Bid")}:
                          </div>
                          <div className="font-bold">
                            <span className="price">$</span>
                            {card.bids?.[0]?.amount}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center col-span-full text-gray-500 py-6">
            {t("No products found")}
          </div>
        )}

        {/* Last "See More" Card */}
        {/* <Link
            href="/coolAuction"
            className="min-w-[250px] max-w-[250px] flex flex-col items-center justify-center 
              bg-[#F5F5F5] border-2 border-gray-300 rounded-xl shadow-sm 
              hover:shadow-md transition-all duration-300  
              flex-shrink-0 group"
          >
            <span className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-black">
              See More
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-500 font-medium group-hover:text-gray-700">
              Explore All{" "}
              <FaChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link> */}
        <Link
          href={seeMoreLink} // 👈 ab hardcoded nahi, dynamic
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
      </div>

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

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default MarketplaceCard;
