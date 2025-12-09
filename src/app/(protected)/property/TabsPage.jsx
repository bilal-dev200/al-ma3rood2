"use client";
import { useState } from "react";
import Sale from "./Sale";

export default function TabsPage() {
  const tabs = [
    { key: "sale", name: "For Sale", icon: "./house.png" },
    { key: "rent", name: "For Rent", icon: "./rent.png" },
    { key: "flatmates", name: "Flatmates", icon: "./flat.png" },
    { key: "retirement", name: "Retirement Villages", icon: "./villages.png" },
    { key: "agent", name: "Find an ss", icon: "./agent.png" },
  ];

  const [activeTab, setActiveTab] = useState("sale");

  const tabContentMap = {
    sale: <Sale />,
    rent: (
      <div className="p-6 text-gray-600 text-sm">
        🏠 Browse rentals in your area
      </div>
    ),
    flatmates: (
      <div className="p-6 text-gray-600 text-sm">🏠 Find or list flatmates</div>
    ),
    retirement: (
      <div className="p-6 text-gray-600 text-sm">
        🏠 Discover retirement village options
      </div>
    ),
    agent: (
      <div className="p-6 text-gray-600 text-sm">
        👤 Find a trusted local agent
      </div>
    ),
  };

  const renderTabContent = () => {
    return (
      tabContentMap[activeTab] || (
        <div className="p-6 text-sm text-gray-500">No content available</div>
      )
    );
  };

  return (
    <div className="flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-sm">
        {/* Tabs */}
        <div className="border-b px-1 pt-1">
          <div className="flex flex-wrap rounded-t overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] text-sm font-medium py-2 px-3 text-center border-r border-gray-300 last:border-r-0
        ${activeTab === tab.key ? "" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab.icon && (
                    <img
                      src={tab.icon}
                      alt={tab.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span className="truncate">{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-1 border-t border-gray-300" />
        </div>

        {/* Heading */}
        <div className="px-4 sm:px-6 py-4 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
            Search New Zealand&apos;s largest range of houses <br className="hidden sm:block" /> 
            and properties for sale
          </h2>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
