"use client";
import { useState } from "react";

const tabs = [
  "Cars",
  "Motorbikes",
  "Caravans & motorhomes",
  "Boats",
  " Car parts & accessories",
  "Popular Searches",
];

export default function PopularSearches() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-10">
      <div className="mb-10 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <div
            className="inline-block pb- border-b-2"
            style={{ borderColor: "#7B7B7B" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 ">
              Popular Searches
            </h2>
          </div>
{/* 
          <p className="text-sm sm:text-base text-gray-600 sm:text-right sm: -mt-0 mt-2">
            We have 9,170 jobs across New Zealand
          </p> */}
        </div>
      </div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`pb-4 px-1 border-b-1 whitespace-nowrap transition-all duration-300 ease-in-out ${
                activeTab === index
                  ? "border-[#7B7B7B] text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-[#7B7B7B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dummy Grid (static for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, colIndex) => (
          <div key={colIndex} className="space-y-3">
            {[
              "Toyota for Sale",
              "Nissan for Sale",
              "Mazda for sale",
              
            ].map((city, i) => (
              <a
                key={i}
                href="#"
                className="block text-[#175f48] hover:text-blue-600 hover:underline"
              >
                {city}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
