import CreatorListingsClient from "./CreatorListingsClient";
import { fetchAllListingsByFilter } from "@/lib/api/listings.server";
import { Suspense } from "react";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

export const metadata = {
  title: "Creator Listings | Ma3rood",
  description: "Browse listings from this creator on Ma3rood Marketplace.",
  robots: "index, follow",
};

// Ensure this route is dynamic to avoid build-time conflicts
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreatorListingsPage({ searchParams }) {
  const creatorId = searchParams?.creator_id || "";
  const status = searchParams?.status || "1";

  if (!creatorId) {
    return (
      <div className="min-h-screen px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Marketplace", href: "/marketplace" },
            { label: "Creator Listings" },
          ]}
          styles={{
            nav: "flex justify-start px-10 pt-4 text-sm font-medium",
          }}
        />
        <div className="text-center py-10 text-gray-500">
          <p>No creator specified. Please select a creator to view their listings.</p>
        </div>
      </div>
    );
  }

  let listings = { data: { data: [] } };
  let creatorInfo = null;

  try {
    const result = await fetchAllListingsByFilter({
      listing_type: "marketplace",
      creator_id: creatorId,
      status,
      pagination: {
        page: 1,
        per_page: 50,
      },
    });

    console.log("api-result", result);

    listings = result || { data: { data: [] } };
    
    // Extract creator info from first listing if available
    if (listings?.data?.data?.length > 0) {
      creatorInfo = listings.data.data[0]?.creator;
    } else if (listings?.data?.length > 0) {
      // Handle different response structure
      creatorInfo = listings.data[0]?.creator;
    }
  } catch (error) {
    console.error("Error fetching creator listings:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Loading listings...</div>
        </div>
      }
    >
      <CreatorListingsClient
        listings={listings?.data?.data || listings?.data || []}
        creatorInfo={creatorInfo}
        creatorId={creatorId}
      />
    </Suspense>
  );
}

