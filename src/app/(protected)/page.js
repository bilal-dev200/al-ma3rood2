import AuctionGrid from "@/components/WebsiteComponents/HomePageComponents/AuctionGrid";
import GridLayout from "@/components/WebsiteComponents/HomePageComponents/GridLayout";
// import TrendingCategories from "@/components/WebsiteComponents/HomePageComponents/TrendingCategories";
import LatestNews from "@/components/WebsiteComponents/ReuseableComponenets/LatestNews";
import Watchlist from "@/components/WebsiteComponents/Watchlistcards/Watchlist";
import {
  fetchAllListings,
  fetchListingsByReservePrice,
  fetchCoolAuctions,
} from "@/lib/api/listings.server";
import MarketplaceCard from "./marketplace/MarketplaceCard";
import CoolAuctions from "@/components/WebsiteComponents/HomePageComponents/CoolAuctions";
import { fetchAllCategories } from "@/lib/api/category.server";
import { useAuthStore } from "@/lib/stores/authStore";
import Watch from "@/components/WebsiteComponents/HomePageComponents/Watch";

// const dummyCards = [
//   {
//     title: "Charity Auction - signed All",
//     price: "$1,540",
//     tags: "Categories: Marketplace • Closes: Tue 1 Apr",
//     sm: "Reserve met",
//     image:
//       "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
//   },
//   {
//     title: "Paul Henry’s mansion",
//     price: "Deadline sale by 29 May",
//     tags: "Categories: Marketplace • Listed: Tue 1 Apr",
//     image:
//       "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
//   },
//   {
//     title: "Paul Henry’s mansion",
//     price: "Price by negotiation",
//     tags: "Categories: Marketplace • Listed: Tue 1 Apr",
//     image:
//       "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
//   },
//   {
//     title: "Paul Henry’s mansion",
//     price: "Price by negotiation",
//     tags: "Categories: Marketplace • Listed: Tue 1 Apr",
//     image:
//       "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
//   },
// ];

export const metadata = {
  title: "Ma3rood",
  description:
    "Browse and discover the best deals on MA3rood Marketplace. Find products, categories, and more.",
  // openGraph: {
  //   title: "Marketplace | Ma3rood",
  //   description: "Browse and discover the best deals on Ma3rood Marketplace. Find products, categories, and more.",
  //   url: "https://yourdomain.com/marketplace", // to be replaced with the actual domain
  //   siteName: "Ma3rood",
  //   images: [
  //     {
  //       url: "https://yourdomain.com/og-marketplace.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "Marketplace | Ma3rood",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  robots: "index, follow",
};

export default async function Home({ params, searchParams }) {
  // Fetch $1 reserve listings
  const reserveListings = await fetchListingsByReservePrice(1);
  const reserveCards = reserveListings?.data || [];
  const { categoryId } = await searchParams;
  const categoryIdFilter = searchParams?.category_id || "";
  const search = searchParams?.search || "";
  const city = searchParams?.city || "";
  console.log("For Test Category", categoryIdFilter);

  const [catResult, listings, coolAuctions] = await Promise.all([
    fetchAllCategories(),
    fetchAllListings(categoryId, categoryIdFilter, search, city),
    fetchCoolAuctions(),
  ]);
  const { token } = useAuthStore;
  // console.log('tok', token)
  console.log("aaa listings", listings);
  console.log("aaa reserveCards", reserveCards);
  console.log("aaa coolAuctions", coolAuctions);

  return (
    <>
      <div className="bg-white">
        <GridLayout />
      </div>
      <div className="px-2 md:px-14 py-2">
        {/* <div className="space-y-6">
          <div className="w-full h-20 bg-[#D9D9D9] rounded" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded overflow-hidden">
              <img
                src="./banner1.png"
                alt="Image 2"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-48 bg-gray-200 rounded overflow-hidden">
              <img
                src="./banner2.png"
                alt="Image 2"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-48 bg-gray-200 rounded overflow-hidden">
              <img
                src="./banner3.png"
                alt="Image 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div> */}
        {token && <Watch />}

        {reserveCards.length > 0 && (
          <AuctionGrid cards={reserveCards.slice(0, 4)} centerHeading={true} />
        )}
        <div className="mt-5" id="marketplace-deals">
          <MarketplaceCard
            heading="Cool Auction"
            cards={Array.isArray(coolAuctions?.data) ? coolAuctions.data : (Array.isArray(coolAuctions) ? coolAuctions : [])}
          />
        </div>
        {/* <LatestNews /> */}
      </div>
    </>
  );
}
