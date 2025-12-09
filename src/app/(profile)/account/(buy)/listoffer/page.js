// "use client";
// import React, { useEffect, useState } from "react";
// import { listingsApi } from "@/lib/api/listings";
// import { Image_URL } from "@/config/constants";
// import ListingCard from "../lost/ListingCard";
// import NoteModal from "../../(sell)/unsold/NoteModal";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// const filters = [
//   { label: "Last 45 days", value: "45d" },
//   { label: "Last 7 days", value: "7d" },
//   { label: "Last 24 hours", value: "24h" },
//   { label: "Last 1 hours", value: "1h" },
// ];
// const Page = () => {
//   const [filter, setFilter] = useState("45d");
//   const [allListings, setAllListings] = useState([]);
//   const [filteredListings, setFilteredListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [selectedListing, setSelectedListing] = useState(null);
//   useEffect(() => {
//     fetchListings();
//   }, []);

//   useEffect(() => {
//     applyFilter();
//   }, [filter, allListings]);

//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       const response = await listingsApi.getUserListingsOffer({});
//       const listData = response || []; // <- Fix here
//       console.log("list", listData);
//       setAllListings(listData.map((offer) => offer.listing)); // <- Extract listings from offers
//     } catch (error) {
//       console.error("Failed to fetch listings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = () => {
//     const now = new Date();
//     let threshold;

//     if (filter === "45d") {
//       threshold = new Date(now.setDate(now.getDate() - 45));
//     } else if (filter === "7d") {
//       threshold = new Date(now.setDate(now.getDate() - 7));
//     } else if (filter === "24h") {
//       threshold = new Date(now.setHours(now.getHours() - 24));
//     } else if (filter === "1h") {
//       threshold = new Date(now.setHours(now.getHours() - 1));
//     } else {
//       setFilteredListings(allListings);
//       return;
//     }
  
//     const filtered = (allListings || []).filter((listing) => {
//       const createdAt = new Date(listing.created_at);
//       return createdAt >= threshold;
//     });

//     setFilteredListings(filtered);
//   };

//   const handleAddNote = (listing) => {
//     setSelectedListing(listing);
//     setIsNoteModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsNoteModalOpen(false);
//     setSelectedListing(null);
//   };

//   const handleSaveNote = (note) => {
//     console.log("Saved Note:", note);
//     // You can store note to DB if needed
//   };
//   const items = [
//   { label: "Home", href: "/" },
//   { label: "Account", href: "/account" },
//   { label: "Listoffer" },
// ];


//   return (
//     <>
//     <Breadcrumbs
//         items={items}
//         styles={{
//           nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
//         }}
//       />
//     <div className="min-h-screen text-gray-800 px-2 py-6">
//       {/* <div className="text-sm text-gray-600 mb-2">
//         Home / My Ma3rood / Buyss/ <span className="text-black">Offers</span>
//       </div> */}

  
//       <h1 className="text-2xl font-bold text-green-600 uppercase mb-1">
//         Offers
//       </h1>

//       <div className="mb-4">
//         <select
//           className="border border-green-500 text-green-500 px-4 py-1 rounded-full text-sm hover:bg-green-50"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           {filters.map((item) => (
//             <option key={item.value} value={item.value}>
//               {item.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Listings */}
//       <div className="grid gap-4">
//         {loading ? (
//           <p className="text-sm text-gray-500">Loading listings...</p>
//         ) : filteredListings.length === 0 ? (
//           <p className="text-sm text-gray-500">No listings found.</p>
//         ) : (
//           filteredListings.map((listing, index) => (
//             <ListingCard
//               key={index}
//               listing={{
//                 id: listing.id,
//                 title: listing.title,
//                 price: listing.buy_now_price || "N/A",
//                 views: 0,
//                 watchers: 0,
//                 closingDate: listing.expire_at,
//                 image: listing.images?.[0]?.image_path
//                   ? `${Image_URL}${listing.images[0].image_path}`
//                   : "/default-image.jpg",
//                 link: `/marketplace/${listing.category?.slug || "unknown"}/${
//                   listing.slug
//                 }`,
//               }}
//               actions={[
//                 { label: "Add note", onClick: () => handleAddNote(listing) }, // ✅ Use modal trigger
//                 {
//                   label: "View new listing",
//                   onClick: () => alert("Viewing new listing"),
//                 },
//               ]}
//             />
//           ))
//         )}
//       </div>

//       {/* ✅ NoteModal */}
//       <NoteModal
//         isOpen={isNoteModalOpen}
//         onClose={handleCloseModal}
//         listing={selectedListing}
//         onSave={handleSaveNote}
//         showStats={false} // ❗ Lost page = no views, no price, no reference, red closed text
//       />
//     </div>
//     </>
//   );
// };

// export default Page;

import ListofferClient from './ListofferClient';

export const metadata = {
  title: "ListOffer | Ma3rood",
  description:
 "View and manage all the offers you've received on your listings.",
   robots: "index, follow",
};

export default function Page() {
  return <ListofferClient />;
}
