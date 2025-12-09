// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import ListingCard from "./ListingCard";
// import { listingsApi } from "@/lib/api/listings";
// import { Image_URL } from "@/config/constants";
// import { FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";
// import NoteModal from "../../(sell)/unsold/NoteModal";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// const filters = [
//   { label: "Last 45 days", value: "45d" },
//   { label: "Last 7 days", value: "7d" },
//   { label: "Last 24 hours", value: "24h" },
//   { label: "Last 1 hours", value: "1h" },
// ];
// const Page = () => {
//     const router = useRouter();
//   const [filter, setFilter] = useState("45d");
//   const [allListings, setAllListings] = useState([]);
//   const [filteredListings, setFilteredListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [noteMap, setNoteMap] = useState({});

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   useEffect(() => {
//     applyFilter();
//   }, [filter, allListings]);

//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       const response = await listingsApi.getUserLostListings({});
//       const listData = response || [];
//       // console.log("Won Listings:", listData);
//       setAllListings(listData);
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
//       threshold = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
//     } else if (filter === "7d") {
//       threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     } else if (filter === "24h") {
//       threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
//     } else if (filter === "1h") {
//       threshold = new Date(now.getTime() - 60 * 60 * 1000);
//     } else {
//       setFilteredListings(allListings);
//       return;
//     }

//     const filtered = allListings.filter((listing) => {
//       const createdAt = new Date(listing.created_at);
//       return createdAt >= threshold;
//     });

//     setFilteredListings(filtered);
//   };

//   const handleAddNote = (listing) => {
//     const image = listing?.images?.[0]?.image_path
//       ? `${Image_URL}${listing.images[0].image_path}`
//       : "/default-image.jpg";

//     const selected = {
//       id: listing.id,
//       title: listing.title,
//       closingDate: listing.expire_at,
//       image,
//       note: listing.note || "",
//     };

//     setSelectedListing(selected);
//     setIsModalOpen(true);
//   };

//   const handleNoteSave = async (note) => {
//     if (!selectedListing?.id) return;

//     try {
//       const formData = new FormData();
//       formData.append("note", note);

//       await listingsApi.PostNote(formData, selectedListing.id);

//       const preview = note.split(" ").slice(0, 3).join(" ") + "...";

//       setNoteMap((prev) => ({
//         ...prev,
//         [selectedListing.id]: { note },
//       }));

//       // ✅ update selectedListing.note directly:
//       setSelectedListing((prev) => ({
//         ...prev,
//         note: note,
//       }));

//       toast.success("Note added successfully.");
//       setIsModalOpen(false);
//       fetchListings();
//     } catch (error) {
//       console.error("Failed to post note:", error);
//     }
//   };

//   const items = [
//     { label: "Home", href: "/" },
//     { label: "Account", href: "/account" },
//     { label: "Lost" },
//   ];
//   const handleNoteDelete = async () => {
//     if (!selectedListing?.id) return;

//     try {
//       await listingsApi.DeleteNote(selectedListing.id);

//       setNoteMap((prev) => {
//         const copy = { ...prev };
//         delete copy[selectedListing.id];
//         return copy;
//       })

//       toast.success("Note deleted successfully.");
//       setIsModalOpen(false);
//       fetchListings();
//     } catch (error) {
//       console.error("Failed to delete note:", error);
//     }
//   };

//   return (
//     <>
//     <Breadcrumbs
//             items={items}
//             styles={{
//               nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
//             }}
//           />
//     <div className="min-h-screen text-gray-800 px-4 py-6">
//       {/* <div className="text-sm text-gray-600 mb-2">
//         Home / My Ma3rood / Buy / <span className="text-black">Lost</span>
//       </div> */}

//       <h1 className="text-2xl font-bold text-green-600 uppercase mb-1">Lost</h1>

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

//       <div className="grid gap-4">
//         {loading ? (
//           <p className="text-sm text-gray-500">Loading listings...</p>
//         ) : filteredListings.length === 0 ? (
//           <p className="text-sm text-gray-500">No listings found.</p>
//         ) : (
//           filteredListings.map((listing) => (
//             <ListingCard
//               key={listing.id}
//               listing={{
//                 id: listing.id,
//                 title: listing.title,
//                 price: listing.buy_now_price || "N/A",
//                 views: listing.view_count || 0,
//                 watchers: 0,
//                 closingDate: listing.expire_at,
//                 note: listing.note,
//                 image: listing.images?.[0]?.image_path
//                   ? `${Image_URL}${listing.images[0].image_path}`
//                   : "/default-image.jpg",
//                 link: `/marketplace/${listing.category?.slug || "unknown"}/${
//                   listing.slug
//                 }`,
//               }}
//               actions={[
//                 {
//                   label: (
//                     <span className="flex items-center gap-1">
//                       {listing.note
//                         ? listing.note.split(" ").slice(0, 3).join(" ") + "..."
//                         : "Add note"}
//                       {listing.note && <FaEdit className="text-xs" />}
//                     </span>
//                   ),

//                   onClick: () => handleAddNote(listing),
//                 }, // ✅ Use modal trigger
//                 {
//                   label: "View new listing",
//                   onClick: () => router.push(`/marketplace/${listing.category?.slug || 'unknown'}`),
//                 },
//               ]}
//             />
//           ))
//         )}
//       </div>

//       {/* ✅ NoteModal */}
//       <NoteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         listing={selectedListing}
//         onDelete={handleNoteDelete}
//         onSave={handleNoteSave}
//         showStats={false}
//         initialNote={selectedListing?.note || ""}
//       />
//     </div>
//     </>
//   );
// };

// export default Page;

import LostClient from './LostClient';

export const metadata = {
  title: "Lost   | Ma3rood",
  description:
 "View and manage all the offers you've received on your listings.",
   robots: "index, follow",
};

export default function Page() {
  return <LostClient />;
}
