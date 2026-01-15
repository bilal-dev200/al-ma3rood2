import { fetchAllCategories, fetchAllJobCategories } from "@/lib/api/category.server";
import { fetchAllListingsByFilter } from "@/lib/api/listings.server";

const BASE_URL = "https://ma3rood.com";

export default async function sitemap() {
    // 1. Define Static Routes
    const staticRoutes = [
        "",
        "/login",
        "/about",
        "/work",
        "/contact-us",
        "/coolAuction",
        "/terms",
        "/privacy",
        "/hotDeals",
        "/marketplace",
        "/jobs",
        "/motors",
        "/property",
        "/services",
        "/register",
        "/forgot-password",
        "/notification",
        "/watchlist",
        "/favourite",
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString(),
        priority: route === "" ? 1.0 : 0.8,
    }));

    try {
        // 2. Fetch Dynamic Data (Parallel)
        // Fetch categories and a large batch of recent listings
        const [
            marketplaceCats,
            jobCats,
            marketListings,
            motorListings,
            propertyListings,
            jobListings
        ] = await Promise.all([
            fetchAllCategories(),
            fetchAllJobCategories(),
            // Fetch recent items for each major type
            fetchAllListingsByFilter({ listing_type: "marketplace", pagination: { per_page: 500 } }),
            fetchAllListingsByFilter({ listing_type: "motors", pagination: { per_page: 500 } }),
            fetchAllListingsByFilter({ listing_type: "property", pagination: { per_page: 500 } }),
            fetchAllListingsByFilter({ listing_type: "job", pagination: { per_page: 500 } }),
        ]);

        // 3. Map Categories to Sitemap Entries
        // Marketplace Categories
        const marketCatEntries = (marketplaceCats.categories || []).map((cat) => ({
            url: `${BASE_URL}/marketplace/${cat.name.replace(/\s+/g, "-")}?categoryId=${cat.id}`,
            lastModified: new Date().toISOString(),
            priority: 0.6,
        }));

        // Job Categories (usually map to /jobs/Category-Name?) - Adjust based on actual job routing if needed
        // Assuming /jobs?category_id=ID for now, or if they have specific pages.
        // Based on sitemap.xml, it seemed to just use query params mostly, but let's stick to safe query params
        // or standard category routes if they exist.
        // The previous sitemap had: https://ma3rood.com/marketplace/Plastic?categoryId=3197
        // So distinct pages per category seem to exist for Marketplace.
        // For jobs, current sitemap has https://ma3rood.com/jobs/account-administrator-slug

        // 4. Map Listings to Sitemap Entries
        const generateListingEntries = (listings, type) => {
            return (listings?.data?.data || []).map((item) => {
                let path = "";
                if (type === "motors") {
                    path = `/motors/${item.slug}`;
                } else if (type === "property") {
                    path = `/property/${item.slug}`;
                } else if (type === "job") {
                    path = `/jobs/${item.slug}`;
                } else {
                    // Marketplace
                    const catSlug = item.category?.slug?.split('/').pop() || item.category?.slug || "category";
                    path = `/marketplace/${catSlug}/${item.slug}`;
                }

                return {
                    url: `${BASE_URL}${path}`,
                    lastModified: item.updated_at || new Date().toISOString(),
                    priority: 0.7,
                };
            });
        };

        const marketEntries = generateListingEntries(marketListings, "marketplace");
        const motorEntries = generateListingEntries(motorListings, "motors");
        const propertyEntries = generateListingEntries(propertyListings, "property");
        const jobEntries = generateListingEntries(jobListings, "job");

        return [
            ...staticRoutes,
            ...marketCatEntries,
            ...marketEntries,
            ...motorEntries,
            ...propertyEntries,
            ...jobEntries,
        ];

    } catch (error) {
        console.error("Sitemap generation error:", error);
        // Fallback to just static routes if API fails
        return staticRoutes;
    }
}
