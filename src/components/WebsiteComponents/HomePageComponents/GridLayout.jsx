"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { listingsApi } from "@/lib/api/listings";
import { useRouter } from "next/navigation";
import { Image_NotFound, Image_URL } from "@/config/constants";
import { useStaticCategoryStore } from "@/lib/stores/staticCategoryStore";

const GridLayout = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dropdownRef = useRef(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [pastSearches, setPastSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { staticCategories, setSelectedStaticCategory } =
    useStaticCategoryStore(); // 👈 get from store
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch results when typing
  useEffect(() => {
    if (searchTerm.length > 2) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await listingsApi.getListingsFilterByAllCategories({
            query: searchTerm,
          });
          setResults(res?.web_suggestions || []);
          setShowDropdown(true);
          console.log("Search results:", res);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Fetch past searches on mount
  useEffect(() => {
    const fetchPastSearches = async () => {
      try {
        const res = await listingsApi.getListingsFilterByAllCategories({});
        setPastSearches(res?.past_searches || []);
      } catch (error) {
        console.error("Error fetching past searches:", error);
      }
    };
    fetchPastSearches();
  }, []);

  // When input is clicked → show dropdown (past searches if no term)
  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleSelectProduct = async (listing) => {

    const catSlug = listing.category?.slug?.includes("/")
      ? listing.category.slug.split("/").pop()
      : listing.category?.slug || "unknown";

    setShowDropdown(false);
    setSearchTerm("");
    try {
      // Call API with title as keyword
      const res = await listingsApi.listingsSearchHistory({
        keyword: listing.title,
      });
    } catch (error) {
      console.error("Error fetching product search:", error);
    }

    // Check listing.type first for service and job
    if (listing.type === "service") {
      console.log("service clicked!", listing);
      router.push(`/services/${listing?.slug}`);
      return;
    }

    if (listing.type === "job") {
      router.push(`/jobs/${listing?.slug}`);
      return;
    }

    // Then check listing_type for marketplace, property, and motors
    switch (listing.listing_type) {
      case "marketplace":
        router.push(`/marketplace/${catSlug}/${listing?.slug}`);
        break;
      case "property":
      case "motors":
        router.push(`/${listing.listing_type}/${listing?.slug}`);
        break;
      default:
        console.warn("Unknown listing type:", listing.listing_type, listing.type);
        break;
    }
  };

  const handleCategoryClick = (card) => {
    setSelectedStaticCategory(card.type);
    if (card.route) {
      router.push(card.route);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setShowDropdown(false);
    router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  // Subcomponent for dropdown item rendering
  function DropdownResultItem({ item, onSelect }) {
    function getImageSrc() {
      if (item.type === "listing" || item.type === "service") {
        return item?.images?.[0]?.image_path
          ? `${Image_URL}${item.images[0].image_path}`
          : Image_NotFound;
      }
      if (item.type === "job") {
        return item?.logo
          ? `${Image_URL}${item.logo}`
          : Image_NotFound;
      }
      return Image_NotFound;
    }

    return (
      <div
        onClick={() => {
          onSelect(item)
        }}
        className="p-3 hover:bg-gray-100 cursor-pointer flex items-start gap-3 transition-all"
      >
        <img
          src={getImageSrc()}
          alt={item?.title || "No Image"}
          className="min-w-12 h-12 object-cover rounded"
          onError={e => {
            e.target.onerror = null;
            e.target.src = Image_NotFound;
          }}
        />
        <DropdownResultContent item={item} />
      </div>
    );
  }

  function DropdownResultContent({ item }) {
    if (item.type === "listing") {
      return (
        <div>
          <p className="text-sm text-start text-black font-medium">
            {item.title}
          </p>
          <p className="text-xs text-start text-black">
            <span className="price">$</span>
            {Number(item.buy_now_price)}
          </p>
        </div>
      );
    }

    if (item.type === "service") {
      return (
        <div>
          <p className="text-sm text-start text-black font-medium">
            {item.title}
          </p>
          <p className="text-xs text-start text-black">
            <span className="price">$</span>
            {Number(item.price)} {item.price_unit}
          </p>
        </div>
      );
    }

    if (item.type === "job") {
      return (
        <div>
          <p className="text-sm text-start text-black font-medium">
            {item.title}
          </p>
          <p className="text-xs text-start text-black">
            @{item.company_name}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div
        className=" px-4 py-16 text-center text-white rounded-b-[80px]"
        style={{
          background: "#175f48", //Dark Green
          // background: '#29a048', //Light Green
          // background: "linear-gradient(to right, #129cbd, #087590)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("FIND EVERYTHING YOU NEED IN ONE PLACE")}
          </h1>
          <p className=" text-sm mb-4 opacity-90">
            {t(
              "Ma3rood — The Kingdom’s marketplace for everything from household items and cars to homes, jobs, and services."
            )}
          </p>
          <p className="text-xs text-center text-amber-200 mb-4 opacity-90 w-3/4 mx-auto">
            {t(
              "Please note: Ma3rood is currently under development. This MVP website is a limited release to test core features and gather your feedback."
            )}
          </p>

          <div className="relative mx-auto flex max-w-3xl gap-2 mb-14 px-4">
            {/* Input field - grows more */}
            <input
              type="text"
              placeholder={t("What are you looking for?")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm?.trim()) {
                  handleSearch();
                }
              }}
              className="h-12 w-full md:flex-1 rounded-md border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Button: icon only on mobile, icon + text on desktop */}
            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className={`h-12 rounded-md flex items-center justify-center w-12 md:w-auto px-0 md:px-6
                  ${loading
                    ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-100"
                  }
  `}
                disabled={loading}
              >
                {loading ? (
                  <span className="hidden md:inline ml-2">
                    {t("Searching")}...
                  </span>
                ) : (
                  <>
                    {/* yahan check kar raha hun ke agar current language Arabic hai toh row reverse */}
                    <span
                      className={`hidden md:inline ${i18n.language === "ar" ? "mr-2" : "ml-2"
                        }`}
                    >
                      {t("Search")}
                    </span>
                    <FaSearch className="h-5 w-5 md:h-4 md:w-4 md:ml-2" />
                  </>
                )}
              </button>
            </div>
            {/* Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-14 w-[82vw] md:w-full md:max-w-[37rem] bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {searchTerm.length > 2 ? (
                  results.length > 0 ? (
                    results.map((item) =>
                      <DropdownResultItem
                        key={item.id}
                        item={item}
                        onSelect={handleSelectProduct}
                      />
                    )
                  ) : (
                    <div className="p-4 text-gray-500 text-center">
                      No results found
                    </div>
                  )
                ) : (
                  pastSearches.length > 0 &&
                  pastSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-black text-start text-sm"
                    >
                      {search}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative -mt-16 px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
            {staticCategories.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(card)}
                className={`group relative overflow-hidden ${card.colSpan} ${card.rowSpan
                  } ${card.rounded} ${card.route
                    ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg transition"
                    : ""
                  }`}
              >
                {card.route ? (
                  // <Link href={card.route} className="block h-full">
                  <div
                    className={`relative ${card.height} text-white hover:text-green-600 transition`}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-start justify-center bg-black/20">
                      <h2 className="text-3xl md:text-4xl font-bold pt-6 drop-shadow-lg tracking-tight">
                        {t(card.title)}
                      </h2>
                    </div>
                  </div>
                ) : (
                  // </Link>
                  <div className={`relative ${card.height}`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/50">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {t(card.title)}
                      </h2>
                      <p className="text-sm text-gray-200 italic pb-1">
                        (Coming Soon)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GridLayout;
