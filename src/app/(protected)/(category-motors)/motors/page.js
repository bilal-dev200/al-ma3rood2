import React from "react";
import { fetchAllCategories } from "@/lib/api/category.server";
import {
  fetchAllListingsByFilter,
} from "@/lib/api/listings.server";
import MotorsClient from "./MotorsClient";

export const metadata = {
  title: "Cars, Bikes & Vehicles for Sale in Saudi Arabia | Ma3rood Motors",
  description:
    "Discover the latest cars, bikes, and commercial vehicles for sale in Saudi Arabia. Find new and used vehicles from trusted sellers across major cities with Ma3rood Motors.",
};

export default async function page () {
    const [catResult, listings] = await Promise.all([
    fetchAllCategories(),
    fetchAllListingsByFilter({
      listing_type: "motors",
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
      
      <MotorsClient
      category={catResult}
            initialProducts={listings?.data || []}
            pagination={pagination}
      />
    </div>
  );
};
