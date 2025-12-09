import React, { useState } from "react";

const tabs = [
  { key: "sale", label: "Properties for sale" },
  { key: "new", label: "New homes" },
  { key: "commercial", label: "Commercial for sale" },
  { key: "retirement", label: "Retirement villages" },
];

const tabData = {
  sale: [
    "Houses and properties for sale in Auckland",
    "Houses and properties for sale in Canterbury",
    "Houses and properties for sale in Waikato",
    "Houses and properties for sale in Canterbury",
    "Houses and properties for sale in Waikato",
    "Houses and properties for sale in Canterbury",
    "Houses and properties for sale in Waikato",
    "Houses and properties for sale in Canterbury",
    "Houses and properties for sale in Waikato",
    "Houses and properties for sale in Canterbury",
  ],
  new: [],
  commercial: [],
  retirement: [],
};

const tabContentMap = {
  sale: (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tabData.sale.map((item, i) => (
        <a
          href="#"
          key={i}
          className="text-green-600 hover:underline text-sm"
        >
          {item}
        </a>
      ))}
    </div>
  ),
  new: (
    <div className="mt-6 text-sm text-gray-500">
      🏡 Explore listings of newly built homes soon!
    </div>
  ),
  commercial: (
    <div className="mt-6 text-sm text-gray-500">
      🏢 Commercial listings coming soon!
    </div>
  ),
  retirement: (
    <div className="mt-6 text-sm text-gray-500">
      🧓 Discover retirement living options here.
    </div>
  ),
};

export default function PopularSearches() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-10">
      <h2 className="text-xl sm:text-2xl font-semibold border-b border-black inline-block pb-2">
        Popular Searches
      </h2>

      {/* Tabs responsive */}
      <nav className="flex flex-wrap gap-4 sm:space-x-8 mt-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      {tabContentMap[activeTab] || (
        <div className="mt-6 text-sm text-gray-400">No content available.</div>
      )}
    </div>
  );
}
