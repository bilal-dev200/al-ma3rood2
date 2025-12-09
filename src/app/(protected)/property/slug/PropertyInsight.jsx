import React, { useState } from "react";

const tabs = [
  { key: "estimate", label: "Property estimate" },
  { key: "value", label: "Capital value" },
  { key: "trends", label: "Trends" },
];

const tabContent = {
  estimate: (
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="md:w-1/2 md:pr-4 md:border-r">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">
          Homes Estimate
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
          Not yet available
        </p>
        <p className="text-sm text-gray-600 mb-4">
          We don’t currently have enough data for the area to provide a
          confident estimate
        </p>
        <a href="#" className="text-[#469BDB] text-sm">
          What is the homes Estimate?
        </a>
      </div>

      <div className="md:w-1/2 md:pl-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">
          RentEstimate
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
          Not yet available
        </p>
        <div className="mt-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">
            RentEstimate
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
            Not yet available
          </p>
        </div>
        <a href="#" className="text-[#469BDB] text-sm">
          More About Rent estimate and rental yield
        </a>
      </div>
    </div>
  ),

  value: (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        Capital Value
      </h3>
      <p className="text-gray-600">Capital value details go here.</p>
    </div>
  ),

  trends: (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Trends</h3>
      <p className="text-gray-600">Trends data goes here.</p>
    </div>
  ),
};

const PropertyInsight = () => {
  const [activeTab, setActiveTab] = useState("estimate");

  return (
    <div className="px-2 sm:px-6 md:px-8 lg:px-16 mt-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Property insights
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.key
                  ? "bg-[#469BDB] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border rounded-md p-4 w-full max-w-4xl mx-auto overflow-x-auto">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default PropertyInsight;
