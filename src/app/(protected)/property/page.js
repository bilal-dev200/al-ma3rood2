import React from "react";
import PropertiesClient from "./PropertiesClient";
import { fetchAllCategories } from "@/lib/api/category.server";
import {
  fetchAllListingsByFilter,
} from "@/lib/api/listings.server";

export const metadata = {
  title: "Properties for Sale & Rent in Saudi Arabia | Ma3rood",
  description:
    "Explore the latest properties for sale and rent in Saudi Arabia. Find apartments, villas, offices, and more across major cities with Ma3rood.",
};

export default async function page() {
  const [catResult, listings] = await Promise.all([
    fetchAllCategories(),
    fetchAllListingsByFilter({
      listing_type: "property",
      pagination: {
        page: 1,
      }
    }),
  ]);
  const pagination = {
    currentPage: listings?.pagination?.current_page || 1,
    totalPages: listings?.pagination?.last_page || 5,
    perPage: listings?.pagination?.per_page || 10,
    totalItems: listings?.pagination?.total || 1000,
  };

  const { categories, isLoading, error } = catResult;

  return (
    <div className="bg-white min-h-screen">

      <PropertiesClient
        category={catResult}
        initialProducts={listings?.data || []}
        pagination={pagination}
      />
    </div>
  );
};
