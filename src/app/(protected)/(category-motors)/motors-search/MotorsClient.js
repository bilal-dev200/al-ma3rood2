 "use client";
 import React, { useState, useEffect, useRef } from 'react';
 import { Search, Grid, List } from 'lucide-react';
 import MotorListingCard from '@/components/WebsiteComponents/MotorListingCard';
 import { motorsApi, motorSearchFilters } from '@/lib/api/motors';
 import { toast } from 'react-toastify';   
import { FaTh, FaThList } from 'react-icons/fa';
 
 
 const MotorsClient = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('price_low');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [motorListings, setMotorListings] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const modelsByMake = {
  Toyota: ["Corolla", "Camry", "Yaris"],
  Honda: ["Civic", "Accord", "CR-V"],
  BMW: ["X5", "3 Series", "5 Series"],
  Ford: ["Mustang", "F-150", "Explorer"],
};


  
  // Filter states
  const [filters, setFilters] = useState({
    vehicle_type: '',
    make: '',
    model: '',
    year_min: '',
    year_max: '',
    price_min: null,
    price_max: null,
    fuel_type: '',
    transmission: '',
    body_style: '',
    condition: '',
    odometer_min: '',
    odometer_max: ''
  });

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Load motor listings
  useEffect(() => {
    loadMotorListings();
  }, [filters, currentPage, searchQuery]);

  const loadMotorListings = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...filters,
        max_price: filters?.price_max,
        min_price: filters?.price_min,
        search: searchQuery,
        sort: sortBy,
        pagination: {
        page: currentPage,
        per_page: 10
        }
      };

      const response = await motorsApi.getMotorsByFilter(payload);
      setMotorListings(response || []);
    } catch (error) {
      console.error('Error loading motor listings:', error);
      toast.error('Failed to load motor listings');
      setMotorListings([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadMotorListings();
  };

  const clearFilters = () => {
    setFilters({
      vehicle_type: '',
      make: '',
      model: '',
      year_min: '',
      year_max: '',
      price_min: '',
      price_max: '',
      fuel_type: '',
      transmission: '',
      body_style: '',
      condition: '',
      odometer_min: '',
      odometer_max: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

    const FilterSidebar = () => (
    <div className="w-full  bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            value={filters.vehicle_type}
            onChange={(e) => handleFilterChange('vehicle_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Types</option>
            {motorSearchFilters.vehicleTypes.map(type => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Conditions</option>
            {motorSearchFilters.conditions.map(condition => (
              <option key={condition} value={condition} className="capitalize">
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Make */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Make
  </label>
  <select
    value={filters.make}
    onChange={(e) => handleFilterChange("make", e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select Make</option>
    {["Toyota", "Honda", "BMW", "Mercedes", "Ford", "Audi"].map((make) => (
      <option key={make} value={make}>
        {make}
      </option>
    ))}
  </select>
</div>

{/* Model */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Model
  </label>
 <select
  value={filters.model}
  onChange={(e) => handleFilterChange("model", e.target.value)}
  disabled={!filters.make}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
>
  <option value="">Select Model</option>
  {filters.make &&
    modelsByMake[filters.make]?.map((model) => (
      <option key={model} value={model}>
        {model}
      </option>
    ))}
</select>
</div>

        {/* Price Range */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Price Range ($)
  </label>
  <div className="grid grid-cols-2 gap-2">
    <select
      value={filters.price_min}
      onChange={(e) => handleFilterChange("price_min", e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Min</option>
      {[0, 500, 1000, 5000, 10000, 20000, 50000].map((price) => (
        <option key={price} value={price}>
          ${price.toLocaleString()}
        </option>
      ))}
    </select>

    <select
      value={filters.price_max}
      onChange={(e) => handleFilterChange("price_max", e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Max</option>
      {[1000, 5000, 10000, 20000, 50000, 100000].map((price) => (
        <option key={price} value={price}>
          ${price.toLocaleString()}
        </option>
      ))}
    </select>
  </div>
</div>


        {/* Year Range */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Year
  </label>
  <div className="grid grid-cols-2 gap-2">
    <select
      value={filters.year_min}
      onChange={(e) => handleFilterChange("year_min", e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Min</option>
      {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)
        .map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
    </select>

    <select
      value={filters.year_max}
      onChange={(e) => handleFilterChange("year_max", e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Max</option>
      {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)
        .map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
    </select>
  </div>
</div>


        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            value={filters.fuel_type}
            onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Fuel Types</option>
            {motorSearchFilters.fuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Transmissions</option>
            {motorSearchFilters.transmissions.map(trans => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>

        {/* Body Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Style
          </label>
          <select
            value={filters.body_style}
            onChange={(e) => handleFilterChange('body_style', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Body Styles</option>
            {motorSearchFilters.bodyStyles.map(style => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
  
// Apply sorting before rendering
const sortedListings = [...motorListings].sort((a, b) => {
  const getPrice = (item) => {
    if (item.allow_offers) {
      return parseFloat(item.start_price) || 0;
    }
    return parseFloat(item.buy_now_price) || 0;
  };

   const getCreatedAt = (item) => new Date(item.created_at).getTime();

  switch (sortBy) {
    case "price_low":
      return getPrice(a) - getPrice(b); // lowest price first
    case "price_high":
      return getPrice(b) - getPrice(a); // highest price first
    case "year_new": // latest created_at
      return getCreatedAt(b) - getCreatedAt(a);
    case "year_old": // oldest created_at
      return getCreatedAt(a) - getCreatedAt(b);
    default:
      return 0; // no sorting
  }
});




return (
      <div className="p-4 md:px-10 mt-7">
        <div className="flex flex-col lg:flex-row items-start gap-6">


          <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Open Filters
          </button>
        </div>
    
<div className="hidden md:block lg:w-1/4">
  <FilterSidebar  />
</div>
{isMobileMenuOpen && (
  <div className="fixed inset-0 z-40 flex">
    {/* Overlay */}
    <div 
      className="fixed inset-0 bg-black/40 bg-opacity-50"
      onClick={() => setIsMobileMenuOpen(false)}
    ></div>

    {/* Sidebar */}
    <div
      ref={menuRef}
      className="relative w-3/4 max-w-xs bg-white h-full shadow-lg p-6 transform transition-transform duration-300 ease-in-out"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
      <FilterSidebar />
    </div>
  </div>
)}
          {/* Sidebar */}
          {/* <FilterSidebar /> */}

          {/* Right side */}
          <div className="flex-1">
           

            {/* Results header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <p className="text-gray-900 text-sm">
                {isLoading ? (
                  ''
                ) : (
                  <>
                    Showing <span className="font-semibold">{motorListings.length || 0}</span> Results
                  </>
                )}
              </p>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {/* <option value="featured">Sort: Featured First</option> */}
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="year_new">Newest First</option>
                  <option value="year_old">Oldest First</option>
                  {/* <option value="odometer_low">Mileage: Low to High</option> */}
                </select>
                {/* <div className="flex justify-center gap-2">
                            <button
                              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${viewMode === "list"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              onClick={() => setViewMode("list")}
                              aria-pressed={viewMode === "list"}
                            >
                              <FaThList />
                              <span>{"List"}</span>
                            </button>
                            <button
                              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${viewMode === "grid"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              onClick={() => setViewMode("grid")}
                              aria-pressed={viewMode === "grid"}
                            >
                              <FaTh />
                              <span>{"Grid"}</span>
                            </button>
                          </div> */}
              </div>
            </div>

            {/* Motor listings */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : motorListings.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {sortedListings.map((listing) => (
                  <MotorListingCard key={listing.id} listing={listing} viewMode={viewMode}/>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No motors found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalResults > 12 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, Math.ceil(totalResults / 12)) }, (_, i) => {
                    const pageNum = currentPage - 2 + i;
                    if (pageNum < 1 || pageNum > Math.ceil(totalResults / 12)) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border border-gray-300 rounded-md ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {currentPage < Math.ceil(totalResults / 12) && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
) }


  export default MotorsClient;