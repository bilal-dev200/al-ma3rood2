// "use client";
// import React, { useState } from "react";
// import { Image_NotFound, Image_URL } from "@/config/constants";
// import Link from "next/link";
// import { useTranslation } from "react-i18next";
// import { listingsApi } from "@/lib/api/listings";

// const PopularProductCard = ({
//   cards: initialCards,
//   categories,
//   layout = "grid", // 'grid' or 'list'
// }) => {
//   const filterCategories = categories?.data || [];
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [cards, setCards] = useState(initialCards || []);
//   const [loading, setLoading] = useState(false);
//   const { t } = useTranslation();

//   const handleCategoryClick = async (category) => {
//     setActiveCategory(category.id);
//     setLoading(true);
//     try {
//       const data = await listingsApi.getListings({ category_id: category.id });
//       setCards(data?.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="my-10 px-4 sm:px-8 md:px-16">
//       <h2 className={`text-2xl font-semibold pb-1 mb-6 text-center`}>
//         <span className="inline-block border-b-2 border-gray-400">
//           {t("Popular Products")}
//         </span>
//       </h2>

//       <div className="relative mb-6">
//         <div className="flex gap-2 overflow-x-auto px-3 py-2 sm:justify-center scrollbar-hide">
//           {filterCategories.map((category) => (
//             <button
//               key={category.id}
//               className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all duration-200
//           ${
//             activeCategory === category.id
//               ? "bg-green-500 text-white"
//               : "bg-white text-gray-700 border-gray-300 hover:bg-green-200"
//           }`}
//               onClick={() => handleCategoryClick(category)}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>
//       {loading ? (
//         <div className="text-center py-10">{t("Loading")}...</div>
//       ) : (
//         <div
//           className={
//             layout === "grid"
//               ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//               : "flex flex-col gap-4"
//           }
//         >
//           {cards?.length > 0 &&
//             cards.map((card, index) => {

//               return (
//                 <Link
//                   key={index}
//                   href={`/marketplace/${card.category?.slug || "unknown"}/${
//                     card.slug
//                   }`}
//                   className={
//                     layout === "grid"
//                       ? "block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full"
//                       : "flex bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full max-w-2xl"
//                   }
//                 >
//                   <img
//                     src={
//                       card.images?.[0]?.image_path
//                         ? `${Image_URL}${card.images?.[0]?.image_path}`
//                         : Image_NotFound
//                     }
//                     alt={card.images?.[0]?.alt_text || "Product Image"}
//                     className={
//                       layout === "grid"
//                         ? "w-full h-48 object-cover rounded-t bg-white"
//                         : "w-32 h-32 object-cover rounded bg-white mr-4"
//                     }
//                   />

//                   <div
//                     className={
//                       layout === "grid"
//                         ? "px-3 pt-3"
//                         : "flex-1 flex flex-col justify-between py-2"
//                     }
//                   >
//                     <div className="flex items-center justify-between gap-2 mb-1">
//                       {card.category?.name && (
//                         <span className="text-xs text-gray-600 font-medium">
//                           {t("Category")}: {card.category.name}
//                         </span>
//                       )}

//                       <div className="text-xs text-gray-600 font-medium">
//                         {card.expire_at ? (
//                           <>
//                             <span className="">{t("Closes")}</span>:{" "}
//                             {new Date(card.expire_at).toLocaleDateString(
//                               "en-US",
//                               {
//                                 weekday: "short",
//                                 day: "numeric",
//                                 month: "short",
//                               }
//                             )}
//                           </>
//                         ) : (
//                           <span className="invisible">placeholder</span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="text-lg font-semibold">
//                       <div className="text-lg font-semibold">
//                         {card.title.length > 18
//                           ? `${card.title.slice(0, 18)}...`
//                           : card.title}

//                         <div className="border-t border-gray-200 my-1" />

//                         <div className="flex justify-between mt-1">
//                           {(card.creator?.city ||
//                             card.creator?.billing_address) && (
//                             <div className="text-gray-700">
//                               <div className="text-[10px] text-gray-400  tracking-wide">
//                                 {t("City")}:{" "}
//                               </div>
//                               <div className="font-bold text-xs">
//                                 {card.creator.city ||
//                                   card.creator.billing_address}
//                               </div>
//                             </div>
//                           )}

//                           {/* Price */}
//                           {card.buy_now_price && (
//                             <div className="text-right text-gray-700 flex flex-col items-end">
//                               <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                                 {t("Buy Now")}:
//                               </div>
//                               <div className="font-bold">
//                                 <span className="price">$</span>
//                                 {card.buy_now_price}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* {(card.creator?.city || card.creator?.billing_address) && (
//                       <div className="text-sm text-green-600 font-bold mt-1">
//                         {t("City")}:{" "}
//                         {card.creator.city || card.creator.billing_address}
//                       </div>
//                     )} */}
//                       {/* {card.expire_at && (
//                       <span className="text-xs text-gray-400">
//                         {t("Closes")}:{" "}
//                         {new Date(card.expire_at).toLocaleDateString("en-US", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </span>
//                     )} */}
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularProductCard;

// "use client";
// import React, { useState } from "react";
// import { Image_NotFound, Image_URL } from "@/config/constants";
// import Link from "next/link";
// import { useTranslation } from "react-i18next";
// import { listingsApi } from "@/lib/api/listings";

// const PopularProductCard = ({
//   cards: initialCards,
//   categories,
//   layout = "grid", // 'grid' or 'list'
// }) => {
//   const filterCategories = categories?.data || [];
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [cards, setCards] = useState(initialCards || []);
//   const [loading, setLoading] = useState(false);
//   const { t } = useTranslation();

//   const handleCategoryClick = async (category) => {
//     setActiveCategory(category.id);
//     setLoading(true);
//     try {
//       const data = await listingsApi.getListings({ category_id: category.id });
//       setCards(data?.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="my-10 px-4 sm:px-8 md:px-16">
//       <h2 className={`text-2xl font-semibold pb-1 mb-6 text-center`}>
//         <span className="inline-block border-b-2 border-gray-400">
//           {t("Popular Products")}
//         </span>
//       </h2>

//       {/* Category Buttons */}
//       <div className="relative mb-6">
//         <div className="flex gap-2 overflow-x-auto px-3 py-2 sm:justify-center scrollbar-hide">
//           {filterCategories.map((category) => (
//             <button
//               key={category.id}
//               className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all duration-200
//           ${activeCategory === category.id
//                   ? "bg-green-500 text-white"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-green-200"
//                 }`}
//               onClick={() => handleCategoryClick(category)}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Cards */}
//       {loading ? (
//         <div className="text-center py-10">{t("Loading")}...</div>
//       ) : (
//         <div
//           className={
//             layout === "grid"
//               ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//               : "flex flex-col gap-4"
//           }
//         >
//           {cards?.length > 0 &&
//             cards.slice(0, 3).map((card, index) => {
//               // 👇 6th item "See More" card
//               if (index === 2) {
//                 return (
//                   <Link
//                     key="see-more"
//                     href={`/marketplace/${card.category?.slug || "unknown"}?categoryId=${card.category?.id || ""}`}
//                     className="flex items-center justify-center bg-[#FBFBFB] rounded p-4 hover:shadow-lg transition-shadow w-full h-48"
//                   >
//                     <span className="text-green-600 font-bold text-lg">
//                       {t("See More")} →
//                     </span>
//                   </Link>
//                 );
//               }

//               // 👇 Normal Product Cards (only 5)
//               return (
//                 <Link
//                   key={index}
//                   href={`/marketplace/${card.category?.slug || "unknown"}/${card.slug}`}
//                   className={
//                     layout === "grid"
//                       ? "block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full"
//                       : "flex bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-full max-w-2xl"
//                   }
//                 >
//                   <img
//                     src={
//                       card.images?.[0]?.image_path
//                         ? `${Image_URL}${card.images?.[0]?.image_path}`
//                         : Image_NotFound
//                     }
//                     alt={card.images?.[0]?.alt_text || "Product Image"}
//                     className={
//                       layout === "grid"
//                         ? "w-full h-48 object-cover rounded-t bg-white"
//                         : "w-32 h-32 object-cover rounded bg-white mr-4"
//                     }
//                   />

//                   <div
//                     className={
//                       layout === "grid"
//                         ? "px-3 pt-3"
//                         : "flex-1 flex flex-col justify-between py-2"
//                     }
//                   >
//                     <div className="flex items-center justify-between gap-2 mb-1">
//                       {card.category?.name && (
//                         <span className="text-xs text-gray-600 font-medium">
//                           {t("Category")}: {card.category.name}
//                         </span>
//                       )}

//                       <div className="text-xs text-gray-600 font-medium">
//                         {card.expire_at ? (
//                           <>
//                             <span>{t("Closes")}</span>:{" "}
//                             {new Date(card.expire_at).toLocaleDateString("en-US", {
//                               weekday: "short",
//                               day: "numeric",
//                               month: "short",
//                             })}
//                           </>
//                         ) : (
//                           <span className="invisible">placeholder</span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="text-lg font-semibold">
//                       {card.title.length > 18
//                         ? `${card.title.slice(0, 18)}...`
//                         : card.title}

//                       <div className="border-t border-gray-200 my-1" />

//                       <div className="flex justify-between mt-1">
//                         {(card.creator?.city || card.creator?.billing_address) && (
//                           <div className="text-gray-700">
//                             <div className="text-[10px] text-gray-400 tracking-wide">
//                               {t("City")}:
//                             </div>
//                             <div className="font-bold text-xs">
//                               {card.creator.city || card.creator.billing_address}
//                             </div>
//                           </div>
//                         )}

//                         {/* Price */}
//                         {card.buy_now_price && (
//                           <div className="text-right text-gray-700 flex flex-col items-end">
//                             <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                               {t("Buy Now")}:
//                             </div>
//                             <div className="font-bold">
//                               <span className="price">$</span>
//                               {card.buy_now_price}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularProductCard;

// "use client";
// import React, { useState, useRef } from "react";
// import { Image_NotFound, Image_URL } from "@/config/constants";
// import Link from "next/link";
// import { useTranslation } from "react-i18next";
// import { listingsApi } from "@/lib/api/listings";
// import { FaChevronLeft, FaChevronRight ,} from "react-icons/fa";
// const PopularProductCard = ({
//   cards: initialCards,
//   categories,
//   layout = "grid", // 'grid' or 'list'
// }) => {
//   const filterCategories = categories?.data || [];
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [cards, setCards] = useState(initialCards || []);
//   const [loading, setLoading] = useState(false);
//   const { t } = useTranslation();
//   const scrollRef = useRef(null);

//   const handleCategoryClick = async (category) => {
//     setActiveCategory(category.id);
//     setLoading(true);
//     try {
//       const data = await listingsApi.getListings({ category_id: category.id });
//       setCards(data?.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollLeft = () => {
//     scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   return (
//     <div className="my-10 px-4 sm:px-8 md:px-16">
//       <h2 className={`text-2xl font-semibold pb-1 mb-6 text-center`}>
//         <span className="inline-block border-b-2 border-gray-400">
//           {t("Popular Products")}
//         </span>
//       </h2>

//       {/* Category Buttons */}
//       <div className="relative mb-6">
//         <div className="flex gap-2 overflow-x-auto px-3 py-2 sm:justify-center scrollbar-hide">
//           {filterCategories.map((category) => (
//             <button
//               key={category.id}
//               className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all duration-200
//           ${activeCategory === category.id
//                   ? "bg-green-500 text-white"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-green-200"
//                 }`}
//               onClick={() => handleCategoryClick(category)}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Cards */}
//       {loading ? (
//         <div className="text-center py-10">{t("Loading")}...</div>
//       ) : (
//         <div className="relative">
//           {/* Left Arrow */}
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 bg-white shadow-md hover:bg-gray-100"
//           >
//         {/* <FaChevronLeft size={22} /> */}
//            </button>

//           <div
//             ref={scrollRef}
//             className={
//               layout === "grid"
//                 ? "flex gap-4 overflow-x-auto px-8 scrollbar-hide snap-x snap-mandatory"
//                 : "flex flex-col gap-4 overflow-x-auto px-8 scrollbar-hide"
//             }
//           >
//             {cards?.length > 0 &&
//               cards.slice(0, 4).map((card, index) => {
//                 // 👉 Last item (20th) = See More
//                 if (index === 3) {
//                   return (
//                     <Link
//                       key="see-more"
//                       href={`/marketplace/${card.category?.slug || "unknown"}?categoryId=${card.category?.id || ""}`}
//   className="min-w-[250px] max-w-[250px] flex flex-col items-center justify-center
//     bg-[#F5F5F5] border-2 border-gray-300 rounded-xl shadow-sm
//     hover:shadow-md transition-all duration-300
//     flex-shrink-0 group"                    >
//                       <span className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-black">
//                                  See More
//                                </span>
//                                <span className="flex items-center gap-2 text-sm text-gray-500 font-medium group-hover:text-gray-700">
//                                  Explore All{" "}
//                                  <FaChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
//                                </span>
//                     </Link>
//                   );
//                 }

//                 // Normal Product Cards
//                 return (
//                   <Link
//                     key={index}
//                     href={`/marketplace/${card.category?.slug || "unknown"}/${card.slug}`}
//                     className="flex-shrink-0 block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-60 snap-start"
//                   >
//                     <img
//                       src={
//                         card.images?.[0]?.image_path
//                           ? `${Image_URL}${card.images?.[0]?.image_path}`
//                           : Image_NotFound
//                       }
//                       alt={card.images?.[0]?.alt_text || "Product Image"}
//                       className="w-full h-48 object-cover rounded-t bg-white"
//                     />

//                     <div className="px-3 pt-3">
//                       <div className="flex items-center justify-between gap-2 mb-1">
//                         {card.category?.name && (
//                           <span className="text-xs text-gray-600 font-medium">
//                             {t("Category")}: {card.category.name}
//                           </span>
//                         )}

//                         <div className="text-xs text-gray-600 font-medium">
//                           {card.expire_at ? (
//                             <>
//                               <span>{t("Closes")}</span>:{" "}
//                               {new Date(card.expire_at).toLocaleDateString("en-US", {
//                                 weekday: "short",
//                                 day: "numeric",
//                                 month: "short",
//                               })}
//                             </>
//                           ) : (
//                             <span className="invisible">placeholder</span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-lg font-semibold">
//                         {card.title.length > 18
//                           ? `${card.title.slice(0, 18)}...`
//                           : card.title}

//                         <div className="border-t border-gray-200 my-1" />

//                         <div className="flex justify-between mt-1">
//                           {(card.creator?.city || card.creator?.billing_address) && (
//                             <div className="text-gray-700">
//                               <div className="text-[10px] text-gray-400 tracking-wide">
//                                 {t("City")}:
//                               </div>
//                               <div className="font-bold text-xs">
//                                 {card.creator.city || card.creator.billing_address}
//                               </div>
//                             </div>
//                           )}

//                           {card.buy_now_price && (
//                             <div className="text-right text-gray-700 flex flex-col items-end">
//                               <div className="text-[9px] text-gray-400 uppercase tracking-wide">
//                                 {t("Buy Now")}:
//                               </div>
//                               <div className="font-bold">
//                                 <span className="price">$</span>
//                                 {card.buy_now_price}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//           </div>

//           {/* Right Arrow */}
//           <button
//             onClick={scrollRight}
//             // className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 bg-white shadow-md hover:bg-gray-100"
//           >
//         {/* <FaChevronRight size={22} /> */}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularProductCard;
"use client";
import React, { useState, useRef, useEffect } from "react"; // 👈 useEffect import kiya
import { Image_NotFound, Image_URL } from "@/config/constants";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { listingsApi } from "@/lib/api/listings";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MarketplaceCard from "./MarketplaceCard";

const PopularProductCard = ({
  cards: initialCards,
  categories,
  layout = "grid",
}) => {
  const filterCategories = categories?.data || [];
  const [activeCategory, setActiveCategory] = useState(null);
  const [cards, setCards] = useState(initialCards || []);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollRef = useRef(null);

  console.log("aaaaa Check Cards from Page:", cards);

  useEffect(() => {
    console.log("All Categories from API:", filterCategories);

    const mobileCategory = filterCategories.find(
      (cat) =>
        cat.name.toLowerCase().includes("mobile") ||
        cat.slug?.toLowerCase().includes("mobile")
    );

    if (mobileCategory) {
      console.log("Default Mobile Category Found:", mobileCategory);

      setActiveCategory(mobileCategory.id);

      const fetchMobileProducts = async () => {
        setLoading(true);
        const payload = {
          category_id: mobileCategory.id,
        };
        try {
          const data = await listingsApi.getListingsByFilter(payload);
          console.log("aaaaa Check Listing from Page:", data)
          setCards(data || []);
        } finally {
          setLoading(false);
        }
      };

      fetchMobileProducts();
    }
  }, [filterCategories]);

  const handleCategoryClick = async (category) => {
    setActiveCategory(category.id);
    setLoading(true);
    const payload = {
      category_id: category.id,
    };
    try {
      const data = await listingsApi.getListingsByFilter(payload);
      setCards(data || []);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="my-10 px-4 sm:px-8 md:px-8">
      <h2 className={`text-2xl font-semibold pb-1 mb-6 text-center`}>
        <span className="inline-block border-b-2 border-gray-400">
          {t("Popular Products")}
        </span>
      </h2>

      {/* Category Buttons */}
      <div className="relative mb-6">
        <div className="flex gap-2 overflow-x-auto px-3 py-2 sm:justify-center scrollbar-hide">
          {filterCategories.map((category) => (
            <button
              key={category.id}
              className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all duration-200
          ${
            activeCategory === category.id
              ? "bg-green-500 text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-green-200"
          }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-10">{t("Loading")}...</div>
      ) : cards?.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          {t("No products available")}
        </div>
      ) : (
        //   <div className="relative">
        // {/* Left Arrow */}
        //       <button
        //         onClick={scrollLeft}
        //         // disabled={isAtStart}
        //         className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10 bg-white
        //             ${isRTL ? "right-0" : "left-0"}
        //            `}
        //       >
        //         {isRTL ? <FaChevronRight size={22} /> : <FaChevronLeft size={22} />}
        //       </button>

        //     <div
        //       ref={scrollRef}
        //       className={
        //         layout === "grid"
        //           ? "flex gap-4 overflow-x-auto px-8 scrollbar-hide snap-x snap-mandatory"
        //           : "flex flex-col gap-4 overflow-x-auto px-8 scrollbar-hide"
        //       }
        //     >
        //       {cards.slice(0, 6).map((card, index) => {
        //         if (index === 5) {
        //           return (
        //             <Link
        //               key="see-more"
        //               href={`/marketplace/${card.category?.slug?.split("/").pop() || "unknown"}/${card.slug}`}
        //               className="min-w-[250px] max-w-[250px] flex flex-col items-center justify-center
        //                 bg-[#F5F5F5] border-2 border-gray-300 rounded-xl shadow-sm
        //                 hover:shadow-md transition-all duration-300
        //                 flex-shrink-0 group"
        //             >
        //               <span className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-black">
        //                 {t("See More")}
        //               </span>
        //               <span className="flex items-center gap-2 text-sm text-gray-500 font-medium group-hover:text-gray-700">
        //                 {t("Explore All")}
        //                 {isRTL ? (
        //                   <FaChevronLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
        //                 ) : (
        //                   <FaChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
        //                 )}
        //               </span>
        //             </Link>
        //           );
        //         }

        //         return (
        //           <Link
        //             key={index}
        //             href={`/marketplace/${card.category?.slug?.split("/").pop() || "unknown"}/${card.slug}`}
        //             className="flex-shrink-0 block bg-[#FBFBFB] p-2 rounded hover:shadow-lg transition-shadow w-60 snap-start"
        //           >
        //             <img
        //               src={
        //                 card.images?.[0]?.image_path
        //                   ? `${Image_URL}${card.images?.[0]?.image_path}`
        //                   : Image_NotFound
        //               }
        //               alt={card.images?.[0]?.alt_text || "Product Image"}
        //               className="w-full h-48 object-cover rounded-t bg-white"
        //             />

        //             <div className="px-3 pt-3">
        //               <div className="flex items-center justify-between gap-2 mb-1">
        //                 {card.category?.name && (
        //                   <span className="text-xs text-gray-600 font-medium">
        //                     {t("Category")}: {card.category.name}
        //                   </span>
        //                 )}
        //               </div>

        //               <div className="text-lg font-semibold">
        //                 {card.title.length > 18
        //                   ? `${card.title.slice(0, 18)}...`
        //                   : card.title}
        //               </div>
        //             </div>
        //           </Link>
        //         );
        //       })}
        //     </div>

        //    {/* Right Arrow */}
        // <button
        //         onClick={scrollRight}
        //         // disabled={isAtEnd}
        //         className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full p-2 z-10 bg-white
        //              ${isRTL ? "left-0" : "right-0"}

        //           `}
        //       >
        //         {isRTL ? <FaChevronLeft size={22} /> : <FaChevronRight size={22} />}
        //       </button>
        //   </div>
        <div className="mx-0 md:mx-6">
          <MarketplaceCard
            heading=""
            // cards={listings?.data?.slice(0, 8) || []}
            cards={cards}
            seeMoreLink="/hotDeals"
          />
        </div>
      )}
    </div>
  );
};

export default PopularProductCard;
