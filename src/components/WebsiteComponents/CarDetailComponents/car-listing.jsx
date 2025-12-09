"use client";
import { FaMapMarkerAlt, FaPhoneAlt, FaLeaf, FaCogs, FaEnvelope,  } from "react-icons/fa";
import ImageCarousel from "@/components/WebsiteComponents/CarDetailComponents/ImageCarousel";
import Rating from "./rating";
import DescriptionSection from "./description";
import {Gauge} from "lucide-react";
import {GiCarEngine} from "react-icons/gi";
import AppointmentBooking from "./Appoinmentbooking";
import DealerInfo from "./dealerinfo";
import { Image_URL } from "@/config/constants";
import Breadcrumbs from "../ReuseableComponenets/Breadcrumbs";
import CarListings from "./dealerotherlist";
import { useState } from "react";


export default function CarListing({ product, motors, dealer_listing }) {
  const [isOpen, setIsOpen] = useState(false);
  const dealer = product?.creator;
  const images = product?.images?.length
    ? product.images.map((img) => `${Image_URL}${img.image_path}`)
    : ["/placeholder.svg?height=400&width=600"];
        const items = [
    { label: "Home", href: "/" },
    { label: "Motors", href: "/motors" },
    {
      label: "Search",
      href: `/search`,
    },
    { label: product.title || "Product" },
  ];

  console.log('Car Detail', product)

  return (
    <>
    <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 px-10 py-3",
        }}
      />
    <div className="max-w-6xl mx-auto bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT - Carousel */}
        <ImageCarousel images={images} />

        {/* RIGHT - Details */}
        <div>
          {/* Title */}
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{product?.year} {product?.make} {product?.model}</h1>
            {/* <div className="bg-gray-200 rounded w-14 h-10"></div> */}
          </div>

          <p className="text-gray-600 text-sm mb-2">
           {product?.title}
          </p>
          <p className="text-gray-500 text-sm mb-4">
           {product?.description}
           </p>

          {/* Location & Specs */}
          <div className="flex flex-wrap gap-4 text-sm mb-3">
            <span className="flex items-center gap-1 text-green-500">
              <FaMapMarkerAlt /> {`${product?.creator?.city}, ${product?.creator?.country}` || "Unknown Location"}
            </span>
            <span className="flex items-center gap-1 text-green-500">
             <Gauge /> {product?.odometer} km
            </span>
            <span className="flex items-center gap-1 text-green-500">
              <FaLeaf /> {product?.fuel_type}
            </span>
            <span className="flex items-center gap-1 text-green-500">
              <FaCogs /> {product?.transmission}
            </span>
            {/* <span className="flex items-center gap-1 text-green-500">
             <FaMapMarkerAlt />{product?.engine_size || "120"} cc
            </span> */}
          </div>

          {/* On Road Costs */}
          {/* <p className="text-sm mb-3">
            On road costs: <span className="text-gray-500">{product?.on_road_costs ? "Included" : "Excluded"}</span>
          </p> */}

          {/* Category & Warranty */}
          <div className="flex gap-6 text-sm mb-4">
            <p>
              Vehicle: <span className="font-semibold uppercase">{product?.vehicle_type}</span>
            </p>
            <p>
             Condition: <span className="font-semibold uppercase">{product?.condition}</span>
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">Asking price:</p>
            <p className="text-3xl font-bold text-black">
              <span className="price">$</span>{Number(product?.buy_now_price)}{" "}
              {/* <span className="line-through text-gray-400 text-lg ml-2">
                $61,990
              </span> */}
            </p>
          </div>

          {/* Buttons */}
          {/* <div className="flex flex-col gap-3">
           
  <a
    href={`mailto:${product?.creator?.email}`}
    className="w-full bg-gray-200 text-gray-900 py-2 rounded-3xl font-medium text-center block"
  >
    Email the Dealer
  </a>
  <a
    href={`tel:${product?.creator?.phone}`}
    className="w-full bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
  >
    <FaPhoneAlt /> Contact Details
  </a>
          </div> */}
           <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
      >
        <FaPhoneAlt /> Contact Seller
      </button>
        </div>
      </div>
      {/* <div className="mt-24">
        <Rating />
        </div> */}
        <div className="mt-12"> 
          <DescriptionSection description={product?.description}  />
        </div>
        {/* <div className="mt-12">
          <AppointmentBooking />
        </div> */}

        <div className="mt-12"><DealerInfo about={product?.creator?.about_me}/></div>
        <CarListings motors={motors} product={product} dealer_listing={dealer_listing}/>

    {/* Modal */}
{isOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Background Overlay */}
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={() => setIsOpen(false)}
    ></div>

    {/* Modal Content */}
    <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
      {/* Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      {/* Dealer Info */}
      <h2 className="text-xl font-semibold mb-4">Seller Information</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left Side - Profile Photo */}
        <div className="bg-[#113f2e] w-36 h-36 rounded-full overflow-hidden border border-gray-300 flex justify-center items-center">
           {dealer?.profile_photo ? (
    <img
      src={`${Image_URL}${dealer.profile_photo}`}
      alt={dealer?.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-white text-5xl">{dealer?.name?.charAt(0)?.toUpperCase()}</span>
  )}
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 space-y-2 text-gray-700 text-md md:text-md">
          <p>
            <strong>Name:</strong> {dealer?.name}
          </p>
          <p>
            <strong>Email:</strong> {dealer?.email}
          </p>
          <p>
            <strong>Phone:</strong> {dealer?.phone}
          </p>
          <p>
            <strong>City:</strong> {dealer?.city}
          </p>
          <p>
            <strong>Country:</strong> {dealer?.country}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <a
          href={`mailto:${dealer?.email}`}
          className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
        >
          <FaEnvelope /> Email
        </a>
        <a
          href={`tel:${dealer?.phone}`}
          className="flex-1 bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
        >
          <FaPhoneAlt /> Call
        </a>
      </div>
    </div>
  </div>
)}

    </div>
    </>
  );
}
