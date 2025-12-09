"use client";
import React, { useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";

const Filtersidebar = () => {
  const [expanded, setExpanded] = useState({
    category: false,
    make: false,
    newUsed: false,
    year: false,
  });

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[250px] border p-5 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">Filter</h2>
        <button className=""><Trash2 className="w-4 h-4  hover:text-gray-500 "/></button>
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
          className={`transition-transform duration-200 ${
            expanded.category ? "rotate-90" : ""
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
          className={`transition-transform duration-200 ${
            expanded.make ? "rotate-90" : ""
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
          className={`transition-transform duration-200 ${
            expanded.newUsed ? "rotate-45" : ""
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
          className={`transition-transform duration-200 ${
            expanded.year ? "rotate-45" : ""
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
          <select className="w-full border px-2 py-1 rounded mt-1 text-gray-600">
            <option>All locations (250,492)</option>
            <option>Punjab</option>
            <option>Sindh</option>
          </select>
        </div>
        <div>
          <p className="font-medium ">District</p>
          <select className="w-full border px-2 py-1 rounded mt-1 text-gray-600">
            <option>Select District</option>
            <option>Lahore</option>
            <option>Karachi</option>
          </select>
          <button className="text-xs text-gray-500 mt-1">Clear</button>
        </div>
        <button className="w-full bg-gray-300 py-2 text-xs">
          View Results (1,000)
        </button>
      </div>
    </div>
  );
};

export default Filtersidebar;
