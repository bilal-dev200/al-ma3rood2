// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { listingsApi } from "@/lib/api/listings";
// import { Image_URL } from "@/config/constants";
// import ListingCard from "../lost/ListingCard";
// import { FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
// import NoteModal from "../../(sell)/unsold/NoteModal";

// const filters = [
//   { label: "Last 45 days", value: "45d" },
//   { label: "Last 7 days", value: "7d" },
//   { label: "Last 24 hours", value: "24h" },
//   { label: "Last 1 hours", value: "1h" },
// ];
// const Page = () => {
//   const [filter, setFilter] = useState("45d");
//   const router = useRouter();
//   const [allListings, setAllListings] = useState([]);
//   const [filteredListings, setFilteredListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
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
//       const response = await listingsApi.getUserWonListings({});
//       const listData = response || [];
//       setAllListings(listData);
//     } catch (error) {
//       console.error("Failed to fetch listings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const items = [
//     { label: "Home", href: "/" },
//     { label: "Account", href: "/account" },
//     { label: "Won" },
//   ];

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

//   const handleCloseModal = () => {
//     setIsNoteModalOpen(false);
//     setSelectedListing(null);
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
//     setIsNoteModalOpen(true);
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
//       setIsNoteModalOpen(false);
//       fetchListings();
//     } catch (error) {
//       console.error("Failed to post note:", error);
//     }
//   };

//   const handleNoteDelete = async () => {
//     if (!selectedListing?.id) return;

//     try {
//       await listingsApi.DeleteNote(selectedListing.id);

//       setNoteMap((prev) => {
//         const copy = { ...prev };
//         delete copy[selectedListing.id];
//         return copy;
//       });
//       console.log("Note deleted successfully.");

//       toast.success("Note deleted successfully.");
//       setIsNoteModalOpen(false);
//       fetchListings();
//     } catch (error) {
//       console.error("Failed to delete note:", error);
//     }
//   };

//   return (
//     <>
//       <Breadcrumbs
//         items={items}
//         styles={{
//           nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
//         }}
//       />
//       <div className="min-h-screen text-gray-800 px-1 py-6">
        

//         <h1 className="text-2xl font-bold text-green-600 uppercase mb-1">Won</h1>

//         <div className="mb-4">
//           <select
//             className="border border-green-500 text-green-500 px-4 py-1 rounded-full text-sm hover:bg-green-50"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             {filters.map((item) => (
//               <option key={item.value} value={item.value}>
//                 {item.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Listings */}
//         <div className="grid gap-4">
//           {loading ? (
//             <p className="text-sm text-gray-500">Loading listings...</p>
//           ) : filteredListings.length === 0 ? (
//             <p className="text-sm text-gray-500">No listings found.</p>
//           ) : (
//             filteredListings.map((listing) => (
//               <ListingCard
//                 key={listing.id}
//                 listing={{
//                   id: listing.id,
//                   title: listing.title,
//                   price: listing.buy_now_price || "N/A",
//                   views: listing.view_count || 0,
//                   watchers: 0,
//                   closingDate: listing.expire_at,
//                   image: listing.images?.[0]?.image_path
//                     ? `${Image_URL}${listing.images[0].image_path}`
//                     : "/default-image.jpg",
//                   link: `/marketplace/${listing.category?.slug || "unknown"}/${
//                     listing.slug
//                   }`,
//                 }}
//                 actions={[
//                   {
//                     label: (
//                       <span className="flex items-center gap-1">
//                         {listing.note
//                           ? listing.note.split(" ").slice(0, 3).join(" ") +
//                             "..."
//                           : "Add note"}
//                         {listing.note && <FaEdit className="text-xs" />}
//                       </span>
//                     ),

//                     onClick: () => handleAddNote(listing),
//                   },
//                   {
//                     label: "View new listing",
//                     onClick: () =>
//                       router.push(
//                         `/marketplace/${listing.category?.slug || "unknown"}`
//                       ),
//                   },
//                 ]}
//               />
//             ))
//           )}
//         </div>

//         {/* ✅ NoteModal */}
//         <NoteModal
//           isOpen={isNoteModalOpen}
//           onClose={handleCloseModal}
//           listing={selectedListing}
//           onDelete={handleNoteDelete}
//           onSave={handleNoteSave}
//           showStats={false}
//           initialNote={selectedListing?.note || ""}
//         />
//       </div>
//     </>
//   );
// };

// export default Page;
import WonClient from './WonClient';

export const metadata = {
  title: "Won | Ma3rood",
  description:
 "View and manage all the offers you've received on your listings.",
   robots: "index, follow",
};

export default function Page() {
  return <WonClient />;
}
