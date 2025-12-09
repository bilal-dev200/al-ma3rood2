// "use client";
// import { userApi } from "@/lib/api/user";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// // const favouriteSellers = [
// //   {
// //     id: 1,
// //     name: "isitcomputers",
// //     initials: "I",
// //     rating: 89,
// //     stars: 2,
// //     emailFrequency: "Email me every day",
// //   },
// //   {
// //     id: 2,
// //     name: "techhub",
// //     initials: "T",
// //     rating: 120,
// //     stars: 3,
// //     emailFrequency: "Email me weekly",
// //   },
// // ];
// 4;
// const items = [
//   { label: "Home", href: "/" },
//   { label: "Account", href: "/account" },
//   { label: "Favourite" },
// ];

// // const favouriteCategories = [
// //   { id: 1, name: "Laptops", newItems: 23 },
// //   { id: 2, name: "Mobile Phones", newItems: 15 },
// //   { id: 3, name: "Headphones", newItems: 7 },
// // ];

// const Page = () => {
//   const [activeTab, setActiveTab] = useState("sellers");
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [favouriteCategories, setFavouriteCategories] = useState([]);
//   const [favouriteSeller, setFavouriteSeller] = useState([]);

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       const response = await userApi.categoryFavorites();
//       const response2 = await userApi.sellerFavorites();

//       setFavouriteCategories(response.data || []);
//       setFavouriteSeller(response2.data || []);
//     } catch (error) {
//       console.error("Failed to fetch listings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!favouriteSeller && !favouriteCategories) {
//     return (
//       <div className="min-h-screen px-4 py-6 text-gray-800">
//         <p>Loading notifications...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Breadcrumbs
//         items={items}
//         styles={{
//           nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
//         }}
//       />
// <div className="mt-5 min-h-screen font-sans w-full  mx-auto">
//   <h1 className="text-2xl font-bold text-[#469BDB] mb-2">FAVOURITES</h1>

//   <div className="flex flex-wrap gap-1 text-sm text-gray-600 mb-4">
//     Manage additional email settings on your{" "}
//     <div className="text-green-500 underline cursor-not-allowed opacity-50">
//       email preferences page.
//     </div>
//   </div>

//   {/* Tabs */}
//   <div className="flex flex-wrap gap-6 text-gray-600 border-b mb-4">
//     <button
//       onClick={() => setActiveTab("categories")}
//       className={`flex items-center gap-1 pb-2 ${
//         activeTab === "categories"
//           ? "font-semibold border-b-2 border-black text-black"
//           : "hover:text-black"
//       }`}
//     >
//       🗂️ <span>Categories</span>
//     </button>
//     <button
//       onClick={() => setActiveTab("sellers")}
//       className={`flex items-center gap-1 pb-2 ${
//         activeTab === "sellers"
//           ? "font-semibold border-b-2 border-black text-black"
//           : "hover:text-black"
//       }`}
//     >
//       👤 <span>Sellers</span>
//     </button>
//   </div>

//   {/* Content */}
//   {activeTab === "sellers" ? (
//     <>
//       <p className="text-sm text-gray-700 mb-3">
//         {favouriteSeller.length} Favourite seller
//         {favouriteSeller.length > 1 && "s"}
//       </p>

//       {favouriteSeller.map((seller) => (
//         <div
//           key={seller.id}
//           className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-full bg-[#469BDB] text-green-50 flex items-center justify-center text-xl font-bold">
//               {seller?.profile_photo ? (
//                 <Image
//                   src={`${Image_URL}${seller.profile_photo}`}
//                   alt="Profile"
//                   fill
//                   sizes="128px"
//                   className="object-cover"
//                 />
//               ) : (
//                 seller?.name?.charAt(0)?.toUpperCase()
//               )}
//             </div>
//             <div>
//               <p className="text-green-600 font-medium flex items-center gap-1 flex-wrap">
//                 {seller.name}{" "}
//                 <span className="text-black">({seller.rating}</span>
//                 <span>{"🌟".repeat(seller.stars)})</span>
//               </p>
//               <div className="text-green-500 text-sm underline cursor-not-allowed opacity-50">
//                 View current listings
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col items-start sm:items-end text-sm text-green-600">
//             <button className="mr-2 cursor-not-allowed opacity-50">
//               Email me weekly
//             </button>
//             <button
//               className="underline cursor-pointer"
//               onClick={async () => {
//                 try {
//                   await userApi.addAndDeleteSeller(seller.id);
//                   setFavouriteSeller((prev) =>
//                     prev.filter((item) => item.id !== seller.id)
//                   );
//                   toast.success("Seller removed from favourites");
//                 } catch (error) {
//                   console.error("Error removing Seller", error);
//                   toast.error("Failed to remove Seller");
//                 }
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       ))}
//     </>
//   ) : (
//     <>
//       <p className="text-sm text-gray-700 mb-3">
//         {favouriteCategories.length} Favourite Categor
//         {favouriteCategories.length > 1 ? "ies" : "y"}
//       </p>

//       {favouriteCategories.map((category) => (
//         <div
//           key={category.id}
//           className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3"
//         >
//           <div>
//             <p className="font-semibold text-green-600">{category.name}</p>
//             <p className="text-sm text-gray-500">
//               {category.listings_count} items
//             </p>
//           </div>
//           <div className="flex flex-col text-sm text-green-600 items-start sm:items-end">
//             <div
//               className="mb-2 underline cursor-pointer"
//               onClick={() =>
//                 router.push(
//                   `/marketplace/${category.slug}?categoryId=${category.id}`
//                 )
//               }
//             >
//               View listings
//             </div>
//             <button
//               className="underline cursor-pointer"
//               onClick={async () => {
//                 try {
//                   await userApi.addAndDeleteFavorities(category.id);
//                   setFavouriteCategories((prev) =>
//                     prev.filter((item) => item.id !== category.id)
//                   );
//                   toast.success("Category removed from favourites");
//                 } catch (error) {
//                   console.error("Error removing category", error);
//                   toast.error("Failed to remove category");
//                 }
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       ))}
//     </>
//   )}
// </div>
//     </>
//   );
// };

// export default Page;
// src/app/(profile)/account/favourite/page.js

import FavouriteClientPage from './FavouriteClientPage';

export const metadata = {
  title: "Favourites | Ma3rood",
  description:
    "Manage your favourite categories and sellers on Ma3rood. View saved listings, sellers, and stay updated with new items.",
  robots: "index, follow",
};

export default function Page() {
  return <FavouriteClientPage />;
}
