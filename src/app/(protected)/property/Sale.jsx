import React from "react";

const filterDropdowns = [
  {
    label: "Location",
    options: [
      "All Cities",
      "Auckland",
      "Wellington",
      "Christchurch",
      "Hamilton",
    ],
  },
  {
    label: "",
    options: [
      "All Districts",
      "North Shore",
      "Central Auckland",
      "South Auckland",
    ],
  },
  {
    label: "",
    options: ["All Suburbs", "Ponsonby", "Parnell", "Remuera"],
  },
];

const priceOptions = {
  start: ["Any", "$100k", "$200k", "$300k", "$500k", "$1M+"],
  end: ["Any", "$200k", "$500k", "$1M", "$2M", "$5M+"],
};

const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const bathroomOptions = ["Any", "1+", "2+", "3+", "4+"];
const propertyTypes = ["All", "House", "Apartment", "Townhouse", "Unit"];

const checkBoxFilters = [
  "Exclude listed by deadline",
  "Open home only",
  "New home only",
];

const Sale = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Location Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filterDropdowns.map(({ label, options }, index) => (
          <div key={index}>
            {label ? (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
            ) : (
              <div className="h-[21px]"></div>
            )}
            <div className="relative">
              <select className="w-full px-3 text-[12px] py-2 bg-[#FAFAFA] appearance-none rounded-md pr-10">
                {options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
                ▼
              </span>
            </div>
          </div>
        ))}

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full bg-[#175f48] text-white py-2 rounded-md">
            Search
          </button>
        </div>
      </div>

      {/* Price, Bedrooms, Bathrooms */}
      <div className="flex flex-wrap gap-3 md:gap-4 items-end">
        {/* Start Price */}
        <div className="w-full sm:w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="relative text-[12px]">
            <select className="w-full px-3 py-2 bg-[#FAFAFA] appearance-none rounded-md pr-8">
              {priceOptions.start.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        <span className="hidden sm:inline text-gray-500">-</span>

        {/* End Price */}
        <div className="w-full sm:w-[120px] relative text-[12px]">
          <select className="w-full px-3 py-2 bg-[#FAFAFA] appearance-none rounded-md pr-8">
            {priceOptions.end.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
            ▼
          </span>
        </div>

        {/* Bedrooms */}
        <div className="w-full sm:w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <div className="relative text-[12px]">
            <select className="w-full px-3 py-2 bg-[#FAFAFA] appearance-none rounded-md pr-8">
              {bedroomOptions.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        <span className="hidden sm:inline text-gray-500">-</span>

        {/* Bathrooms */}
        <div className="w-full sm:w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathroom
          </label>
          <div className="relative text-[12px]">
            <select className="w-full px-3 py-2 bg-[#FAFAFA] appearance-none rounded-md pr-8">
              {bathroomOptions.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        {/* Property Type */}
        <div className="w-full sm:w-[200px] md:w-[250px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <div className="relative text-[12px]">
            <select className="w-full px-3 py-2 bg-[#FAFAFA] appearance-none rounded-md pr-10">
              {propertyTypes.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4 mt-4">
        {checkBoxFilters.map((text, i) => (
          <label key={i} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#469BDB] rounded outline-none"
            />
            <span>{text}</span>
          </label>
        ))}

        <button className="text-sm text-[#469BDB] ml-2 mt-1">
          Clear requirement
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>

        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Input */}
          <div className="relative flex-1 min-w-[200px] max-w-[400px] bg-[#FAFAFA]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search using keywords"
              className="w-full pl-10 pr-3 py-2 bg-[#FAFAFA] appearance-none rounded-md"
            />
          </div>

          <div className="text-sm text-gray-600 flex items-center space-x-1 cursor-pointer">
            <span>More Options</span>
            <span className="text-[#175f48]">▼</span>
          </div>

          <button className="border border-[#175f48] text-[#175f48] px-4 py-2 rounded-md hover:bg-green-50">
            Advanced Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sale;
