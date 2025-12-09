import { cookies } from "next/headers";

// job-listing.server.js
export async function fetchProduct(slug) {
  const res = await fetch(
    `https://ma3rood.datainovate.com/backend/api/job-listing/${slug}/show`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("API Error:", res.status, await res.text());
    throw new Error("Failed to fetch product");
  }

  return res.json();
}


export async function fetchAllListingsByFilter() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}job-listing?limit=10`;


    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch listings: " + res.status);

    console.log(res.data);
    
    return await res.json();
  } catch (error) {
    console.error("fetchAllListings error:", error);
    return { data: { data: [] } }; // Return fallback structure
  }
}
