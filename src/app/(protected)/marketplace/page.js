// import MarketplaceCategories from "./MarketplaceCategories";
// import MarketplaceCard from "./MarketplaceCard";
// import LatestNews from "@/components/WebsiteComponents/ReuseableComponenets/LatestNews";
// import { fetchAllCategories } from "@/lib/api/category.server";
// import { fetchAllListings } from "@/lib/api/listings.server";
// import PopularProductCard from "./PopularProductCard";
// import { Suspense } from "react";
// import Pagination from "@/components/WebsiteComponents/ReuseableComponenets/Pagination";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
// import { Heading } from "./Heading";
// import { SearchFilter } from "./SearchFilter";

// export const metadata = {
//   title: "Marketplace | Ma3rood",
//   description:
//     "Browse and discover the best deals on Ma3rood Marketplace. Find products, categories, and more.",
//   robots: "index, follow",
// };

// export default async function Page({ params, searchParams }) {
//   const { categoryId } = await searchParams;
//   const categoryIdFilter = searchParams?.category_id || "";
//   const search = searchParams?.search || "";
//   const city = searchParams?.city || "";
//   console.log("For Test Category", categoryIdFilter)
//   const [catResult, listings] = await Promise.all([
//     fetchAllCategories(),
//     fetchAllListings(categoryId, categoryIdFilter, search, city),
//   ]);
//   const { categories, isLoading, error } = catResult;
//   console.log("cate",categories);

//   return (
//     <div className="w-full">
//       <div className="bg-gray-50">
//         {/* Blue Background Section */}
//         <div
//           className="w-full rounded-b-[80px] text-white text-left"
//           style={{
//             background: "#175f48",
//             // background: "linear-gradient(to right, #469BDB, #3587C4)",
//           }}
//         >
//           {/* Top Navigation Links */}
//           <Breadcrumbs
//             items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]}
//             styles={{
//               nav: "flex justify-start px-10 pt-4 text-sm font-medium",
//             }}
//           />

//           {/* Divider Line */}
//           <div className="mt-3 border-b  border-white opacity-40 mx-8"></div>

//           {/* Heading */}
//           <Heading />
//         </div>

//         <SearchFilter />

//         <div className="md:p-10 p-3">
//           <MarketplaceCategories
//             heading="Marketplace"
//             categories={categories}
//             isLoading={isLoading}
//             error={error}
//           />
//         </div>
//       </div>
//       <div className="md:px-20" id="marketplace-deals">
//         <MarketplaceCard
//           heading="Deals"
//           cards={listings?.data?.slice(0, 8) || []}
//           seeMoreLink="/hotDeals"
//         />
//       </div>
//       <Suspense
//         fallback={
//           <div className="py-10 text-center">Loading popular products...</div>
//         }
//       >
//         <PopularProductCard
//           categories={categories}
//           cards={listings?.data?.slice(0, 4)}
//         />
//       </Suspense>
//       <div className="md:px-10 px-3 mt-10">
//         <LatestNews />
//       </div>
//     </div>
//   );
// }
import Marketplace from "./Marketplace";

export const metadata = {
  title: "Marketplace | Ma3rood",
  description: "Browse and discover the best deals on Ma3rood Marketplace. Find products, categories, and more.",
  robots: "index, follow",
};

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <Marketplace searchParams={resolvedSearchParams} />;
}
