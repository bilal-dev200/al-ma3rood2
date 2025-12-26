"use client";

import { useCategoryStore } from "@/lib/stores/categoryStore";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import React from "react";

function ServiceCategories({
  heading,
  isLoading = false,
  error = null,
  description,
}) {
  const { setSelectedCategory } = useCategoryStore();
  const { t } = useTranslation();
  const router = useRouter();

  // ✅ Static categories (SSR-safe)
  const categories = {
    data: [
      {
        id: 6421,
        parent_id: null,
        name: "Domestic services",
        slug: "Services/Domestic-services",
        icon: "/icons/service/domestic-services.svg",
        image_path: "/icons/service/domestic-services.png",
        total_listing_count: 0,
      },
      {
        id: 6432,
        parent_id: null,
        name: "Events & entertainment",
        slug: "Services/Events-entertainment",
        icon: "/icons/service/events-entertainment.svg",
        image_path: "/icons/service/events-entertainment.png",
        total_listing_count: 0,
      },
      {
        id: 6439,
        parent_id: null,
        name: "Health & wellbeing",
        slug: "Services/Health-wellbeing",
        icon: "/icons/service/health-wellbeing.svg",
        image_path: "/icons/service/health-wellbeing.png",
        total_listing_count: 0,
      },
      {
        id: 6457,
        parent_id: null,
        name: "Other services",
        slug: "Services/Other-services",
        icon: "/icons/service/other-services.svg",
        image_path: "/icons/service/other-services.png",
        total_listing_count: 0,
      },
      {
        id: 6446,
        parent_id: null,
        name: "Trades",
        slug: "Services/Trades",
        icon: "/icons/service/trades.svg",
        image_path: "/icons/service/trades.png",
        total_listing_count: 0,
      },
    ],
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading categories: {error}
      </div>
    );
  }

  // ✅ Correct redirect logic
  const handleClick = (category) => {
    // setSelectedCategory(category);

    router.push(
      `/service-search?listing_type=services&selected_category=${category.id}`
    );
  };

  return (
    <section className="p-1 rounded-lg">
      {/* Header */}
      <div className="bg-white p-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {t(
            decodeURIComponent(heading)
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )}
        </h2>

        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}
      </div>

      {/* Categories */}
      <div className="mt-6">
        {/* ✅ Mobile: horizontal scroll */}
        <div className="block sm:hidden overflow-x-auto scrollbar-hide">
          <div className="flex flex-wrap w-[480px] gap-4">
            {categories.data.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleClick(cat)}
                className="w-[22%] flex flex-col items-center justify-center p-2 bg-white rounded-lg hover:shadow cursor-pointer transition"
              >
                <img
                  src={cat.image_path}
                  alt={cat.name}
                  className="w-10 h-10 mb-2 object-cover"
                />
                <p className="text-xs text-center font-medium">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Desktop grid */}
        <div className="hidden sm:grid grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.data.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat)}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition"
            >
              <img
                src={cat.image_path}
                alt={cat.name}
                className="w-10 h-10 mb-2"
              />
              <p className="text-xs text-center font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceCategories;
