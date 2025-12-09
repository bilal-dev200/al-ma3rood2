"use client"
import { Image_URL } from "@/config/constants"
import Link from "next/link"
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const CarListings = ({ motors, product, dealer_listing }) => {
   const [isOpen, setIsOpen] = useState(false);
    const dealer = product?.creator;
  const carData = {
    title: "2025 Toyota Corolla",
    price: "from $37,890",
    link: "View model specs",
    image: "/bmw.jpg", // apni image ka path
  }

  const CarCard = ({ car }) => (
    <div className="flex-1 min-w-0 bg-gray-100 rounded-lg p-3">
      {/* Image Container */}
      <div className="rounded-lg overflow-hidden mb-3 w-full h-40">
        <img
          src={`${Image_URL}${car.images[0]?.image_path}`}
          alt={car.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <h3 className="font-medium text-gray-900 mb-1 truncate" title={car?.title}>{car?.title}</h3>
      <p className="text-gray-900 text-sm mb-2">
         <span className="price">$</span>{Number(car?.buy_now_price)}</p>
      <Link href={`/motors/${car?.slug}`} className="text-blue-600 text-sm hover:underline">
        View vehicle
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-12">
      {/* Dealer's other listing */}
      <div>
        {/* <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
      
        </h2> */}
            <div
            className="inline-block border-b-2 "
            style={{ borderColor: "#7B7B7B" }}
          >
            <h2 className="text-2xl font-semibold "> Seller's other listing</h2>
          </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {dealer_listing.slice(0,4).map((carData, index) => (
            <CarCard key={`dealer-${index}`} car={carData} />
          ))}
        </div>
      </div>

      {/* Other Listings you might like */}
      <div className="mt-14">
         <div
            className="inline-block border-b-2 "
            style={{ borderColor: "#7B7B7B" }}
          >
            <h2 className="text-2xl font-semibold ">  Other Listings you might like</h2>
          </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {motors.map((carData, index) => (
            <CarCard key={`dealer-${index}`} car={carData} />
          ))}
        </div>
      </div>

<div className="mt-24">
  <h2 className="text-xl font-semibold mb-6">Seller Contact</h2>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
    {/* View Location - Map Section */}
    <div>
      <h3 className="text-sm font-medium mb-3">View Location</h3>
      <div className="w-full h-56 rounded">
         <iframe
      width="100%"
      height="250"
      style={{ border: 0, borderRadius: "8px" }}
      loading="lazy"
      allowFullScreen
      src={`https://www.google.com/maps?q=${encodeURIComponent(
        `${product?.creator?.city}, ${product?.creator?.country}`
      )}&output=embed`}
    ></iframe>
      </div>
    </div>

    {/* Contact Details Section */}
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 text-teal-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Location</span>
        </div>
        <div className="ml-6">
          <p className="font-medium text-gray-900 mb-1">{product?.creator?.business_name || 'Seller'}</p>
          <p className="text-sm text-gray-600">
            {`${product?.creator?.city}, ${product?.creator?.country}`}
          </p>
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="space-y-4 w-full">
        <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
          Email the Dealer
        </button>
        <button className="w-full py-3 px-4 bg-green-700 text-white rounded-full text-sm font-medium hover:bg-teal-800 transition-colors flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Contact Details
        </button>
      </div> */}
       <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-green-500 text-white py-2 rounded-3xl font-medium flex items-center justify-center gap-2"
            >
              <FaPhoneAlt /> Contact Seller
            </button>
    </div>
  </div>
</div>
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
  )
}

export default CarListings
