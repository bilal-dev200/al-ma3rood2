"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Sortings from "./Sortingoptions";
import { Menu, X } from "lucide-react";

// Define filter dropdowns
const filterDropdowns = [
  {
    label: "Refine",
    hasDropdown: true,
    isActive: true,
    options: ["Option 1", "Option 2", "Option 3"],
  },
  {
    label: "Category (Animals & pets)",
    hasDropdown: true,
    options: ["Dogs", "Cats", "Birds", "Fish"],
  },
  {
    label: "All Locations",
    hasDropdown: true,
    options: ["Location 1", "Location 2", "Location 3"],
  },
];

const items = [
  {
    title: "Charity Auction - signed",
    price: "$900.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Marketplaces",
    closeDate: "Tue, 1 Apr",
    buyNow: true,
  },
  {
    title: "Vintage Guitar - Rare Find",
    price: "$1,540",
    imageUrl: "https://via.placeholder.com/300",
    category: "Instruments",
    closeDate: "Wed, 2 Apr",
    buyNow: true,
  },
  {
    title: "Antique Vase - 19th Century",
    price: "$730.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Antiques",
    closeDate: "Thu, 3 Apr",
    buyNow: true,
  },
  {
    title: "Collectible Coin Set",
    price: "$420.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Collectibles",
    closeDate: "Fri, 4 Apr",
    buyNow: true,
  },
  {
    title: "Signed Basketball Jersey",
    price: "$1,150.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Sports",
    closeDate: "Sat, 5 Apr",
    reserveMet: true,
  },
  {
    title: "Designer Handbag",
    price: "$2,500.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Fashion",
    closeDate: "Sun, 6 Apr",
    buyNow: true,
  },
  {
    title: "Original Painting - Abstract",
    price: "$3,200.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Art",
    closeDate: "Mon, 7 Apr",
    buyNow: true,
  },
  {
    title: "Classic Car Model",
    price: "$980.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Toys",
    closeDate: "Tue, 8 Apr",
    buyNow: true,
  },
  {
    title: "Limited Edition Watch",
    price: "$4,500.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Accessories",
    closeDate: "Wed, 9 Apr",
    reserveMet: true,
  },
  {
    title: "Gaming Console - Sealed",
    price: "$650.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Electronics",
    closeDate: "Thu, 10 Apr",
    buyNow: true,
  },
  {
    title: "Luxury Perfume Set",
    price: "$300.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Beauty",
    closeDate: "Fri, 11 Apr",
    buyNow: true,
  },
  {
    title: "Custom Skateboard Deck",
    price: "$220.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Sports",
    closeDate: "Sat, 12 Apr",
    buyNow: true,
  },
  {
    title: "Handcrafted Wooden Table",
    price: "$1,800.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Furniture",
    closeDate: "Sun, 13 Apr",
    buyNow: true,
  },
  {
    title: "Rare Book - First Edition",
    price: "$1,200.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Books",
    closeDate: "Mon, 14 Apr",
    buyNow: true,
  },
  {
    title: "High-End DSLR Camera",
    price: "$3,000.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Photography",
    closeDate: "Tue, 15 Apr",
    buyNow: true,
  },
  {
    title: "Fitness Equipment Bundle",
    price: "$1,100.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Health",
    closeDate: "Wed, 16 Apr",
    reserveMet: true,
  },
  {
    title: "Professional DJ Set",
    price: "$2,800.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Music",
    closeDate: "Thu, 17 Apr",
    buyNow: true,
  },
  {
    title: "Smartphone - Latest Model",
    price: "$1,250.00",
    imageUrl: "https://via.placeholder.com/300",
    category: "Electronics",
    closeDate: "Fri, 18 Apr",
    buyNow: true,
  },
];

// Card Component to display item details
const Card = ({ item, isList }) => {
  return (
    <div
      className={`bg-gray-100 hover:shadow-md overflow-hidden  transition-all duration-300 border border-gray-200 ${
        isList
          ? "flex flex-col sm:flex-row w-full p-3 sm:p-4"
          : "flex flex-col w-full h-full" // Added h-full for grid items
      }`}
    >
      {/* Image Section */}
      <div
        className={`${
          isList
            ? "w-full sm:w-[160px] md:w-[180px] lg:w-[200px] mb-3 sm:mb-0 sm:mr-4"
            : "p-2 w-full"
        }`}
      >
        <div
          className={`${
            isList
              ? "w-full h-36 sm:h-full aspect-[4/3]"
              : "w-full aspect-[4/3]"
          } bg-gray-300 rounded-md overflow-hidden`}
        >
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.undefined}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={`${isList ? "flex-1 min-w-0" : "flex-1 min-w-0 p-3"}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 mb-2 gap-1">
          <p className="truncate">
            Categories: <span className="text-gray-700">{item.category}</span>
          </p>
          <p className="whitespace-nowrap">
            Closes: <span className="text-gray-700">{item.closeDate}</span>
          </p>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>

        <hr className="my-2 h-px bg-gray-200 border-0" />

        {/* Pricing Block */}
        <div className="mt-auto">
          {" "}
          {/* Pushes price to bottom */}
          {item.buyNow ? (
            <div className="flex flex-col items-end text-sm">
              <span className="text-gray-500">Buy Now</span>
              <span className="font-medium text-gray-900">{item.price}</span>
            </div>
          ) : item.reserveMet ? (
            <div className="text-sm">
              <p className="text-gray-500">Reserve met</p>
              <p className="font-medium text-gray-900">{item.price}</p>
            </div>
          ) : (
            <p className="font-semibold text-gray-900 text-sm">{item.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Page Component
const Page = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [layout, setLayout] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const itemsPerPage = 16;

  const dropdownRefs = useRef([]);
  const filterContainerRef = useRef(null);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu on resize if screen is large enough
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
      // Close dropdowns when screen size changes significantly
      setOpenDropdown(null);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getNumericPrice = (item) =>
    Number.parseFloat((item.price || "").replace(/[^0-9.]/g, "")) || 0;

  const sortItems = (items, option) => {
    if (!Array.isArray(items)) return [];
    if (option === "low-to-high") {
      return [...items].sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
    }
    if (option === "high-to-low") {
      return [...items].sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
    }
    return [...items];
  };

  const sortedItems = sortItems(items, sortOption);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [cardCount, setCardCount] = useState(4); // Default to 4 cards
  // Handle dropdown positioning
  const getDropdownPosition = (index) => {
    if (typeof window === "undefined") return "bottom";

    const button = dropdownRefs.current[index]?.getBoundingClientRect();
    if (!button) return "bottom";

    // Check if there's enough space below the button
    const spaceBelow = window.innerHeight - button.bottom;
    const dropdownHeight = 150; // Approximate dropdown height

    return spaceBelow > dropdownHeight ? "bottom" : "top";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <div
        className="border-b border-gray-200 px-2 sm:px-4 py-2"
        style={{ background: "linear-gradient(to right, #469BDB, #3587C4)" }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile Navigation */}
          <div className="flex justify-between items-center h-8 sm:h-10 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-100 p-2 rounded-md transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link
              href="/list-an-Items"
              className="text-white hover:text-blue-100 text-xs sm:text-sm"
            >
              List an Item
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center h-1 lg:h-1 text-xs lg:text-sm text-white">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link
                href="/store"
                className="text-white hover:text-blue-100 transition-colors"
              >
                Store
              </Link>
              <span className="opacity-50">|</span>
              <Link
                href="/deals"
                className="text-white hover:text-blue-100 px-2 lg:px-7 py-0 rounded transition-colors"
              >
                Deals
              </Link>
              <span className="opacity-50">|</span>
              <Link
                href="/book-a-courier"
                className="text-white hover:text-blue-100 px-2 lg:px-7 py-0 rounded transition-colors"
              >
                Book a Courier
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/list-an-Items"
                className="hover:text-blue-100 transition-colors"
              >
                List an Item
              </Link>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 pb-2 space-y-2 border-t border-blue-400 pt-2">
              <Link
                href="/store"
                className="block text-white hover:text-blue-100 py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Store
              </Link>
              <Link
                href="/deals"
                className="block text-white hover:text-blue-100 py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/book-a-courier"
                className="block text-white hover:text-blue-100 py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Courier
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative"
        style={{ background: "linear-gradient(to right, #469BDB, #3587C4)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
            SHOP NEW & USED ITEMS <br className="hidden sm:block" />
            FOR SALE
          </h1>
        </div>
      </div>

      {/* Filter Card */}
      <div className="max-w-6xl mx-auto -mt-12 sm:-mt-16 lg:-mt-20 relative z-10 mb-6 sm:mb-8 lg:mb-10 px-4">
        <div className="bg-white rounded-lg p-5 sm:p-6 shadow-lg">
          <div className="space-y-4">
            <label className="block text-sm text-black mb-2">
              Search by Keywords{" "}
              <span className="text-gray-500">(optional)</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 min-w-0 h-[48px] sm:h-[48px] lg:h-[44px] px-4 rounded-lg bg-gray-50 text-base sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-sm sm:placeholder:text-base placeholder:text-gray-500"
              />

              <button className="h-[44px] sm:h-[48px] lg:h-[44px] flex items-center justify-center gap-2 sm:gap-3 px-4 text-base sm:text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition whitespace-nowrap">
                <span className="w-4 h-4 sm:w-5 sm:h-5 relative inline-block flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.001 4.529c2.349-2.532 6.163-2.536 8.516-.036 2.28 2.423 2.285 6.305.01 8.736L12 21.35l-8.527-8.121c-2.274-2.431-2.27-6.313.01-8.736 2.353-2.5 6.167-2.496 8.518.036z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute -bottom-1 -right-1 bg-black rounded-full p-[1px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="white"
                      className="w-2 h-2 sm:w-3 sm:h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </span>
                <span className="hidden sm:inline">Save this category</span>
                <span className="inline sm:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto pb-2 scrollbar-hide">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <span className="opacity-50">|</span>
          <Link
            href="/services"
            className="text-gray-700 hover:text-blue-600 bg-gray-100 px-2"
          >
            Services
          </Link>
          <span className="opacity-50">|</span>
          <span className="bg-gray-100 px-2 text-gray-800 py-0">
            <Link href="/trades">Trades</Link>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-6">
        {/* Filter Buttons */}
        <div
          className="flex flex-wrap gap-2 mb-4 sm:mb-6"
          ref={filterContainerRef}
        >
          {filterDropdowns.map((filter, index) => (
            <div className="relative" key={index}>
              <button
                ref={(el) => (dropdownRefs.current[index] = el)}
                onClick={() =>
                  setOpenDropdown(openDropdown === index ? null : index)
                }
                className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm border ${
                  filter.isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                } flex items-center gap-1 sm:gap-1.5 whitespace-nowrap`}
                aria-expanded={openDropdown === index}
                aria-haspopup="true"
              >
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {filter.label}
                </span>
                {filter.hasDropdown && (
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
                      openDropdown === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Dropdown content */}
              {openDropdown === index && filter.options && (
                <div
                  className={`absolute z-20 mt-1 bg-white rounded-md shadow-lg w-[var(--dropdown-width)] max-w-[calc(100vw-2rem)] max-h-60 overflow-y-auto whitespace-nowrap animate-fade-in ${
                    getDropdownPosition(index) === "top"
                      ? "bottom-full mb-1"
                      : "top-full"
                  }`}
                  style={{
                    "--dropdown-width": `${dropdownRefs.current[index]?.offsetWidth}px`,
                  }}
                >
                  {filter.options.map((option, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        // Handle option selection here
                        setOpenDropdown(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results and Sort/View */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
          <div className="border-b-2 pb-1 border-neutral-500">
            <h1 className="text-base sm:text-lg font-semibold">
              Showing {items.length} results
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Sortings
              sortOption={sortOption}
              setSortOption={setSortOption}
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        {paginatedItems.length > 0 ? (
          layout === "grid" ? (
            <div
              className="grid grid-cols-1 
                     min-[481px]:grid-cols-3 
                     sm:grid-cols-4 
                     gap-3 sm:gap-4 mb-6"
            >
              {paginatedItems.map((item, index) => (
                <Link
                  href="#"
                  key={index}
                  className="hover:no-underline h-full"
                >
                  <Card
                    item={item}
                    isList={false}
                    className="h-full flex flex-col"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 mb-6">
              {paginatedItems.map((item, index) => (
                <Link href="#" key={index} className="hover:no-underline">
                  <Card item={item} isList={true} />
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-400 text-white hover:bg-gray-500"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            {Array.from({
              length: Math.min(totalPages, windowWidth < 640 ? 3 : 5),
            }).map((_, index) => {
              let pageNumber;
              if (totalPages <= (windowWidth < 640 ? 3 : 5)) {
                pageNumber = index + 1;
              } else if (
                currentPage <= Math.floor((windowWidth < 640 ? 3 : 5) / 2)
              ) {
                pageNumber = index + 1;
              } else if (
                currentPage >=
                totalPages - Math.floor((windowWidth < 640 ? 3 : 5) / 2)
              ) {
                pageNumber =
                  totalPages - ((windowWidth < 640 ? 3 : 5) - index - 1);
              } else {
                pageNumber =
                  currentPage -
                  Math.floor((windowWidth < 640 ? 3 : 5) / 2) +
                  index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-400 text-white hover:bg-gray-500"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
