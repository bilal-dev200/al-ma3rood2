"use client";
import React, { useState, useEffect } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useLocationStore } from "@/lib/stores/locationStore";

const Filtersidebar = () => {
  const { regions, cities, areas, fetchRegions, fetchCities, fetchAreas } = useLocationStore();

  useEffect(() => {
    fetchRegions();
  }, []);

  const [expanded, setExpanded] = useState({
    category: false,
    make: false,
    newUsed: false,
    year: false,
  });

  const [filters, setFilters] = useState({
    region: '',
    city: '',
    area: ''
  });

  const handleResultLocationChange = async (type, value) => {
    // Update state immediately for the change
    setFilters(prev => {
      const newFilters = { ...prev, [type]: value };
      if (type === 'region') {
        newFilters.city = '';
        newFilters.area = '';
      }
      if (type === 'city') {
        newFilters.area = '';
      }
      return newFilters;
    });

    if (type === 'region' && value) {
      fetchCities(value);
    }
    if (type === 'city' && value) {
      const fetchedAreas = await fetchAreas(value);
      if (fetchedAreas?.length === 1) {
        setFilters(prev => ({ ...prev, area: fetchedAreas[0].id }));
      }
    }
  };

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[250px] border p-5 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">Filter</h2>
        <button className=""><Trash2 className="w-4 h-4  hover:text-gray-500 " /></button>
      </div>

      {/* Category */}
      <div
        className="flex justify-between items-center py-2 cursor-pointer "
        onClick={() => toggleExpand("category")}
      >
        <div>
          <p className="font-medium text-gray-500">Category</p>
          <p className="text-xs ">Motors / Cars</p>
        </div>
        <FaChevronRight
          className={`transition-transform duration-200 ${expanded.category ? "rotate-90" : ""
            }`}
        />
      </div>
      {expanded.category && (
        <div className="py-2 border-b">
          <select className="w-full border px-2 py-1 rounded">
            <option>Motors</option>
            <option>Cars</option>
            <option>Bikes</option>
          </select>
        </div>
      )}

      {/* Make */}
      <div
        className="flex justify-between items-center py-2 cursor-pointer "
        onClick={() => toggleExpand("make")}
      >
        <p className="font-medium text-gray-500">Make</p>
        <FaChevronRight
          className={`transition-transform duration-200 ${expanded.make ? "rotate-90" : ""
            }`}
        />
      </div>
      {expanded.make && (
        <div className="py-2 border-b">
          <select className="w-full border px-2 py-1 rounded">
            <option>Toyota</option>
            <option>Honda</option>
            <option>BMW</option>
          </select>
        </div>
      )}

      {/* New & Used */}
      <div
        className="flex justify-between items-center py-2 cursor-pointer "
        onClick={() => toggleExpand("newUsed")}
      >
        <div>
          <p className="font-medium text-gray-500">New & Used</p>
          <p className="text-xs ">New</p>
        </div>
        <FaPlus
          className={`transition-transform duration-200 ${expanded.newUsed ? "rotate-45" : ""
            }`}
        />
      </div>
      {expanded.newUsed && (
        <div className="py-2 border-b space-y-1">
          <label className="flex items-center gap-2">
            <input type="radio" name="condition" /> New
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="condition" /> Used
          </label>
        </div>
      )}

      {/* Year */}
      <div
        className="flex justify-between items-center py-2 cursor-pointer "
        onClick={() => toggleExpand("year")}
      >
        <p className="font-medium text-gray-500">Year</p>
        <FaPlus
          className={`transition-transform duration-200 ${expanded.year ? "rotate-45" : ""
            }`}
        />
      </div>
      {expanded.year && (
        <div className="py-2 text-gray-400 space-y-2">
          <input
            type="number"
            placeholder="From"
            className="w-full border border-gray-200 px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="To"
            className="w-full border border-gray-200 px-1 py-1 rounded focus:none"
          />
        </div>

      )}

      {/* Pricing */}
      <div className="py-3 border-b">
        <p className="font-medium text-gray-600">Pricing</p>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="From"
            className="w-1/2 border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="To"
            className="w-1/2 border px-2 py-1 rounded"
          />
        </div>
        <button className="text-xs text-gray-500 mt-1">Clear</button>
        <button className="w-full bg-gray-300 py-2 mt-2 text-xs">
          View Results (1,000)
        </button>
      </div>

      {/* Odometer */}
      <div className="py-3 ">
        <p className="font-medium text-gray-600">Kilometers</p>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="From"
            className="w-1/2 border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="To"
            className="w-1/2 border px-2 py-1 rounded"
          />
        </div>
        <button className="text-xs text-gray-500 mt-1">Clear</button>
        <button className="w-full bg-gray-300 py-2 mt-2 text-xs">
          View Results (1,000)
        </button>
      </div>

      {/* Location */}
      <div className="py-3 space-y-3">
        <div>
          <p className="font-medium ">Region</p>
          <select
            className="w-full border px-2 py-1 rounded mt-1 text-gray-600"
            value={filters.region}
            onChange={(e) => handleResultLocationChange('region', e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="font-medium ">City</p>
          <select
            className="w-full border px-2 py-1 rounded mt-1 text-gray-600"
            value={filters.city}
            onChange={(e) => handleResultLocationChange('city', e.target.value)}
            disabled={!filters.region}
          >
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="font-medium ">Area</p>
          <select
            className="w-full border px-2 py-1 rounded mt-1 text-gray-600"
            value={filters.area}
            onChange={(e) => handleResultLocationChange('area', e.target.value)}
            disabled={!filters.city}
          >
            <option value="">Select Area</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button className="text-xs text-gray-500 mt-1" onClick={() => {
            setFilters(prev => ({ ...prev, region: '', city: '', area: '' }));
          }}>Clear</button>
        </div>
        <button className="w-full bg-gray-300 py-2 text-xs">
          View Results
        </button>
      </div>
    </div>
  );
};

export default Filtersidebar;
