// "use client";
// import React, { useEffect, useState } from "react";
// import NoteModal from "../unsold/NoteModal";
// import SoldListingCard from "./SoldListingCard";
// import { listingsApi } from "@/lib/api/listings";
// import { Image_URL } from "@/config/constants";
// import { FaEdit } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

import SoldClients from "./SoldClients";

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
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [noteMap, setNoteMap] = useState({});
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
//       const response = await listingsApi.getUserListings({ status: 3 });
//       const listData = response?.data || [];
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

//     const filtered = allListings.filter((listing) => {
//       const createdAt = new Date(listing.created_at);
//       return createdAt >= threshold;
//     });

//     setFilteredListings(filtered);
//   };

//   const handleOpenNoteModal = (listing) => {
//     const image = listing?.images?.[0]?.image_path
//       ? `${Image_URL}${listing.images[0].image_path}`
//       : "/default-image.jpg";

//     const selected = {
//       id: listing.id,
//       title: listing.title,
//       price: listing.buy_now_price,
//       views: listing.view_count || 0,
//       watchers: 0,
//       closingDate: listing.expire_at,
//       image,
//       note: listing.note || "",
//       winner_name: listing?.winning_bid?.user?.name,
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
//       toast.success("Note Added Successfully.");
//       setIsModalOpen(false);
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
//       setIsModalOpen(false);
//       fetchListings();
//     } catch (error) {
//       console.error("Failed to delete note:", error);
//     }
//   };

//   const handleOpenNote = (listing) => {
//     const image = listing?.images?.[0]?.image_path
//       ? `${Image_URL}${listing.images[0].image_path}`
//       : "/default-image.jpg";

//     const selected = {
//       id: listing.id,
//       title: listing.title,
//       price: listing.buy_now_price,
//       views: 0,
//       watchers: 0,
//       closingDate: listing.expire_at,
//       image,
//       note: listing.note || "",
//       winner_name: listing.winning_bid.user.name,
//     };

//     setSelectedListing(selected);
//     setIsModalOpen(true);
//   };

//   const items = [
//     { label: "Home", href: "/" },
//     { label: "Account", href: "/account" },
//     { label: "Sold" },
//   ];

//   return (
//     <div className="min-h-screen text-gray-800">
//       <Breadcrumbs
//         items={items}
//         styles={{
//           nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
//         }}
//       />

//       <h1 className="text-2xl font-bold text-green-600 uppercase mb-1 mt-5">
//         SOLD
//       </h1>
//       <p className="text-sm mb-4">{filteredListings.length} listings</p>

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
//       {loading ? (
//         <p className="text-sm text-gray-500">Loading listings...</p>
//       ) : filteredListings.length === 0 ? (
//         <p className="text-sm text-gray-500">No listings found.</p>
//       ) : (
//         filteredListings.map((listing) => (
//           <SoldListingCard
//             key={listing.id}
//             listing={{
//               id: listing.id,
//               title: listing.title,
//               price: listing.buy_now_price || "N/A",
//               views: 0,
//               watchers: 0,
//               closingDate: listing.expire_at,
//               winner_name: listing?.winning_bid?.user?.name,
//               image: listing.images?.[0]?.image_path
//                 ? `${Image_URL}${listing.images[0].image_path}`
//                 : "/default-image.jpg",
//               link: `/marketplace/${listing.category?.slug || "unknown"}/${
//                 listing.slug
//               }`,
//             }}
//             actions={[
//               {
//                 label: (
//                   <span className="flex items-center gap-1">
//                     {listing.note
//                       ? listing.note.split(" ").slice(0, 3).join(" ") + "..."
//                       : "Add note"}
//                     {listing.note && <FaEdit className="text-xs" />}
//                   </span>
//                 ),

//                 onClick: () => handleOpenNote(listing),
//               },
//             ]}
//           />
//         ))
//       )}

//       <NoteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         listing={{
//           ...selectedListing,
//           winner_name: selectedListing?.winning_bid?.user?.name,
//         }}
//         onSave={handleNoteSave}
//         onDelete={handleNoteDelete}
//         showStats={false}
//         initialNote={selectedListing?.note || ""}
//       />

//       {/* <div className="mt-6 text-center text-sm text-green-600 hover:underline cursor-pointer">
//         ↑ Back to top
//       </div> */}
//     </div>
//   );
// };

// export default Page;


export const metadata = {
  title: "Sold Products | Ma3rood",
  description:
 "View and manage all the offers you've received on your listings.",
   robots: "index, follow",
};

export default function Page() {
  return <SoldClients />;
}