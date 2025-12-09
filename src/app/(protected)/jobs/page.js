import React from "react";
import JobsClient from "./JobsClient";
import { fetchAllJobCategories } from "@/lib/api/category.server";
import {
  fetchAllListingsByFilter,
} from "@/lib/api/job-listing.server";


export const metadata = {
  title: "Latest Jobs & Career Opportunities in Saudi Arabia | Ma3rood Jobs",
  description:
    "Explore thousands of the latest job vacancies in Saudi Arabia. Find full-time, part-time, and remote career opportunities across major industries with Ma3rood.",
};

export default async function page () {
    const [catResult, 
      listings
    ] = await Promise.all([
    fetchAllJobCategories(),
    fetchAllListingsByFilter(),
  ]);

  console.log("Job Listings:", listings);

  return (
    <div className="bg-white min-h-screen">
      
      <JobsClient 
      category={catResult?.categories?.data || []}
            initialProducts={listings?.data || []}
      />
    </div>
  );
};
