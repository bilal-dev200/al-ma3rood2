"use client";

import { FaListUl } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";

const Sortings = ({ sortOption, setSortOption, layout, setLayout }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
      {/* Sorting Dropdown */}
      <div className="relative w-full sm:w-auto sm:min-w-[160px]">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-gray-100 text-gray-700 text-sm px-3 py-2 pr-8  focus:outline-none  w-full h-10 transition-colors duration-200"
          aria-label="Sort items"
        >
          <option value="featured">Sort: Featured First</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>

        {/* Down Arrow Icon */}
        <div className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
          </svg>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="hidden md:flex items-center gap-2 sm:gap-2 w-full sm:w-auto">
        {/* List View Button */}
        <button
          type="button"
          onClick={() => setLayout("list")}
          aria-label="List view"
          aria-pressed={layout === "list"}
          className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5  transition-all duration-200 flex-1 sm:flex-none h-9 sm:h-10 ${
            layout === "list"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaListUl
            className={`text-sm sm:text-base ${
              layout === "list" ? "text-white" : "text-blue-600"
            }`}
          />
          <span className="text-xs sm:text-sm">List</span>
        </button>

        {/* Grid View Button */}
        <button
          type="button"
          onClick={() => {
            setLayout("grid");

            setCardCount(4); // Assuming you have this state
          }}
          aria-label="Grid view"
          aria-pressed={layout === "grid"}
          className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5  transition-all duration-200 flex-1 sm:flex-none h-9 sm:h-10 ${
            layout === "grid"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <RiLayoutMasonryFill
            className={`text-sm sm:text-base ${
              layout === "grid" ? "text-blue" : "text-blue-600"
            }`}
          />
          <span className="text-xs sm:text-sm">Gallery</span>
        </button>
      </div>
    </div>
  );
};

export default Sortings;
