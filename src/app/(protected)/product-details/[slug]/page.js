import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page;

// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { FaRegHeart } from "react-icons/fa";
// import Link from "next/link";
// import { CiDeliveryTruck } from "react-icons/ci";
// import PlaceBidModal from "@/components/WebsiteComponents/ReuseableComponenets/PlaceBidModal";
// import { Image_NotFound, Image_URL } from "@/config/constants";

// const ProductDetailsPage = () => {
//   const { slug } = useParams();
//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState("");
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isBuyNowModalOpen, setBuyNowModalOpen] = useState(false);
//   const [carouselIndex, setCarouselIndex] = useState(0);

//   useEffect(() => {
//     async function loadProduct() {
//       setLoading(true);
//       try {
//         const { fetchProduct } = await import('@/lib/api/listings.server');
//         const data = await fetchProduct(slug);
//         setProduct(data);
//         if (data?.images?.length > 0) setMainImage(data.images[0].image_path);
//       } catch (e) {
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (slug) loadProduct();
//   }, [slug]);

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   if (!product)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Product not found.
//       </div>
//     );

//   const images = product.images?.map((img) => img.image_path) || [];

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="bg-white border-b border-gray-200 px-4 py-3">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <Link href="/" className="hover:text-green-600">
//               Home
//             </Link>
//             <span>|</span>
//             <Link href="/marketplace" className="hover:text-green-600">
//               Marketplace
//             </Link>
//             <span>|</span>
//             <span className="text-gray-900">
//               {product.category?.name || "Product"}
//             </span>
//           </div>
//         </div>
//       </nav>

//       <section className="mx-auto px-4 py-2">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           <div className="bg-white rounded-lg p-4 w-full max-w-[700px] mx-auto">
//             {/* Carousel */}
//             <div className="relative w-full h-[400px] flex items-center justify-center">
//               {/* Left Arrow */}
//               {images.length > 1 && (
//                 <button
//                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
//                   onClick={() => {
//                     setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//                   }}
//                   aria-label="Previous image"
//                 >
//                   <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                 </button>
//               )}
//               <img
//                 src={images[carouselIndex] ? `${Image_URL}${images[carouselIndex]}` : Image_NotFound}
//                 alt={`Product Image ${carouselIndex + 1}`}
//                 className="object-contain rounded-lg w-full h-full"
//                 style={{ maxHeight: 400 }}
//               />
//               {/* Right Arrow */}
//               {images.length > 1 && (
//                 <button
//                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
//                   onClick={() => {
//                     setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//                   }}
//                   aria-label="Next image"
//                 >
//                   <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
//                 </button>
//               )}
//               {/* Dots */}
//               {/* {images.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                   {images.map((_, idx) => (
//                     <button
//                       key={idx}
//                       className={`w-3 h-3 rounded-full ${carouselIndex === idx ? 'bg-green-600' : 'bg-gray-300'}`}
//                       onClick={() => setCarouselIndex(idx)}
//                       aria-label={`Go to image ${idx + 1}`}
//                     />
//                   ))}
//                 </div>
//               )} */}
//             </div>
//             {/* Thumbnails */}
//             <div className="flex justify-center gap-4 mt-10 flex-wrap">
//               {images.map((img, idx) => (
//                 <div
//                   key={idx}
//                   className={`relative w-24 mt-10 h-20 rounded-lg border cursor-pointer ${
//                     carouselIndex === idx ? "border-green-500" : "border-gray-300"
//                   }`}
//                   onClick={() => setCarouselIndex(idx)}
//                 >
//                   <img
//                     src={`${Image_URL}${img}`}
//                     alt={`thumb-${idx}`}
//                     className="object-cover rounded-md w-full h-full"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-6 mt-5">
//             <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//               {product.title}
//             </h1>

//             {/* <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2">
//               <span className="font-medium">Closes:</span>
//               <span className="font-bold">{product.expire_at ? new Date(product.expire_at).toLocaleDateString() : "-"}</span>
              
//             </div> */}

//             <div className="flex justify-between items-center text-sm">
//               <div className="text-green-600">
//                 <span className="text-gray-600">Condition:</span>{" "}
//                 {product.condition ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1) : "-"}
//               </div>

//               <div className="text-green-600">
//                 <span className="text-gray-600">Shipping:</span> Not available
//                 {/* {product.shipping_method_id ? "Available" : "Not available"} */}
//               </div>

//               {/* <div className="text-green-600">
//                 {product.watchlist_count || 0}{" "}
//                 <span className="text-gray-600">: other Watchlisted</span>
//               </div> */}
//             </div>

//             {/* <div className="flex space-x-3">
//               <button className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800">
//                 Add to Watchlist
//               </button>
//               <button className="border border-gray-300 p-3 rounded-full">
//                 <FaRegHeart />
//               </button>
//             </div> */}

//             {/* Bid Section */}
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center space-y-4">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Buy Now</p>
//                 <p className="text-4xl font-bold text-gray-900">
//                   {product.buy_now_price || "-"}
//                   {/* {product.current_bid || product.buy_now_price || "-"} */}
//                 </p>
//               </div>
//               <button
//                 className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold rounded-full"
//                 onClick={() => setBuyNowModalOpen(true)}
//               >
//                 Contact Seller
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ======= PRODUCT DETAILS ======= */}
//       {/* <div className="max-w-7xl mx-auto bg-white rounded-lg p-20">
//         <h2 className="text-xl font-bold text-gray-600 mb-3">Details</h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
//           <div>
//             <div className="font-medium">Condition:</div>
//             <div className="text-gray-700">{product.condition || "-"}</div>
//           </div>

//           <div>
//             <div className="font-medium">Memory:</div>
//             <div className="text-gray-700">8 to 16 GB</div>
//           </div>

//           <div>
//             <div className="font-medium">Hard Drive Size:</div>
//             <div className="text-gray-700">1 to 1.9 TB</div>
//           </div>

//           <div>
//             <div className="font-medium">Cross:</div>
//             <div className="text-gray-700">4</div>
//           </div>
//         </div>
//       </div> */}

//       {/* ======= PRODUCT DESCRIPTION ======= */}
//       <div className="max-w-7xl mx-auto  bg-white rounded-lg p-20 space-y-4">
//         <h2 className="text-xl font-semibold">Description</h2>
//         {/* <div className="text-sm text-gray-600 space-y-2">
//           <p>----- Please See our Other Listing, thank you -------</p>
//           <p>
//             ---- Please Read the Auction Description and See the Auction Photos
//             -----
//           </p>
//           <p>---- No Pickup -----</p>
//         </div> */}

//         <div>
//           <h3 className="font-semibold">
//             {product.title}
//           </h3>
//           <div className="text-sm prose" dangerouslySetInnerHTML={{ __html: product.description }} />
//         </div>

//         {/* <div className="space-y-4">
//           <h4 className="font-semibold">Specification:</h4>

//           <div className="grid gap-4 text-sm">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <span className="font-medium">Processor:</span>
//               <span className="md:col-span-2">
//                 Intel® Core™ i7-3770 Processor 8M Cache, up to 3.90 GHz
//               </span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <span className="font-medium">RAM:</span>
//               <span className="md:col-span-2">8GB Memory</span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <span className="font-medium">Dual Hard Drive:</span>
//               <div className="md:col-span-2 space-y-1">
//                 <p>Hard Drive - 128GB 2.5" Solid State Drive</p>
//                 <p>HDD - 1TB Hard Drive extra for data storage</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <span className="font-medium">Graphics:</span>
//               <span className="md:col-span-2">NVIDIA Quadro 600</span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <span className="font-medium">Ports:</span>
//               <div className="md:col-span-2 space-y-1">
//                 <p>4x USB Ports in front</p>
//                 <p>6 USB Ports in rear</p>
//                 <p>1x Display Port and 1 DVI (Via Graphic Card)</p>
//                 <p>1 x RJ-45 Ethernet</p>
//                 <p>1 X DVD/CD Drive</p>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </div>

//       {/* ======= SHIPPING SECTION ======= */}
//       {/* <section className=" w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="border-b border-gray-200 px-6 py-4 text-center">
//           <h2 className="text-xl font-semibold text-black">
//             Shipping & pick-up options
//           </h2>
//         </div>

//         <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex justify-between text-sm font-medium text-gray-700">
//           <span>Destination & description</span>
//           <span>Price</span>
//         </div>

//         <div className="divide-y divide-gray-200 text-sm">
//           <div className="px-6 py-4 flex justify-between">
//             <span className="text-gray-800">
//               North Island &gt; 2-5 business days
//             </span>
//             <span className="font-semibold">$15.00</span>
//           </div>
//           <div className="px-6 py-4 flex justify-between">
//             <span className="text-gray-800">
//               South Island &gt; 2-5 business days
//             </span>
//             <span className="font-semibold">$17.00</span>
//           </div>
//         </div>

//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm">
//           <span className="text-gray-700">Seller does not allow pick-ups</span>
//         </div>

//         <div className="px-6 py-4 border-t border-dashed border-green-300 bg-gray-50 rounded-b-lg flex items-center gap-2 text-sm">
//           <CiDeliveryTruck className="text-green-600 text-xl" />
//           <Link
//             href="/shipping"
//             className="text-green-600 hover:text-green-800 underline"
//           >
//             Learn more about shipping and delivery options.
//           </Link>
//         </div>
//       </section> */}

//       {/* Buy Now Modal */}
//       {isBuyNowModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//           onClick={() => setBuyNowModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative"
//             onClick={e => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
//               onClick={() => setBuyNowModalOpen(false)}
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-bold mb-4 text-center">Contact Seller to Buy</h2>
//             <div className="mb-4 text-center">
//               <p className="text-gray-700 mb-2">To buy this item, please contact the seller directly:</p>
//               <div className="bg-gray-50 rounded p-4 text-left">
//                 <div className="mb-1"><span className="font-medium">Name:</span> {product.creator?.name}</div>
//                 <div className="mb-1"><span className="font-medium">Email:</span> <a href={`mailto:${product.creator?.email}`} className="text-green-600 underline">{product.creator?.email}</a></div>
//                 {product.creator?.phone && (
//                   <div className="mb-1"><span className="font-medium">Phone:</span> <a href={`tel:${product.creator.phone}`} className="text-green-600 underline">{product.creator.phone}</a></div>
//                 )}
//               </div>
//             </div>
//             <div className="text-gray-600 text-sm text-center mb-2">
//               The seller will provide payment and delivery details. Please mention this listing when you contact them.
//             </div>
//             <button
//               className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//               onClick={() => setBuyNowModalOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetailsPage;
