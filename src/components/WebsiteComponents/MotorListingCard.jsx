import React from "react";
import Link from "next/link";
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Heart,
  Eye,
} from "lucide-react";
import { Image_URL } from "@/config/constants";

const MotorListingCard = ({ listing, viewMode }) => {
  const getAttributeValue = (key) => {
    const attribute = listing.attributes?.find((attr) => attr.key === key);
    return attribute ? attribute.value : null;
  };

  const make = getAttributeValue("make");
  const model = getAttributeValue("model");
  const year = getAttributeValue("year");
  const fuelType = getAttributeValue("fuel_type");
  const transmission = getAttributeValue("transmission");
  const odometer = getAttributeValue("odometer");
  const vehicleType = getAttributeValue("vehicle_type");
  const bodyStyle = getAttributeValue("body_style");

  // const formatPrice = (price) => {
  //   if (!price) return 'Price on application';
  //   const numPrice = parseFloat(price);
  //   if (numPrice >= 1000000) {
  //     return `${(numPrice / 1000000).toFixed(1)}M`;
  //   } else if (numPrice >= 1000) {
  //     return `${(numPrice / 1000).toFixed(0)}k`;
  //   }
  //   return `${numPrice.toLocaleString()}`;
  // };
  const formatPrice = (price) => {
    if (!price) return "Price on application";

    // Remove commas and any extra spaces before converting
    const numPrice = parseFloat(price.replace(/,/g, ""));

    if (isNaN(numPrice)) return "Price on application";

    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M`;
    } else if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(0)}k`;
    }

    // Add commas properly formatted
    return numPrice.toLocaleString();
  };

  console.log("aaa listing", listing);

  const formatOdometer = (km) => {
    if (!km) return null;
    const numKm = parseFloat(km);
    if (numKm >= 1000) {
      return `${(numKm / 1000).toFixed(0)}k km`;
    }
    return `${numKm.toLocaleString()} km`;
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "car":
        return <Car className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  return (
    <Link
      href={`/motors/${listing.slug}`}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
        viewMode !== "grid" ? "flex flex-col md:flex-row" : "flex flex-col"
      }`}
    >
      <div
        className={`relative ${
          viewMode == "grid" ? "h-48" : "w-96  h-58"
        } bg-gray-200`}
      >
        {listing.images && listing.images.length > 0 ? (
          <img
            src={`${Image_URL}/${listing.images[0].image_path}`}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Car className="w-16 h-16" />
          </div>
        )}

        {/* Badge for vehicle type */}
        <div className="absolute top-2 left-2">
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium capitalize">
            {listing.vehicle_type || "Vehicle"}
          </span>
        </div>

        {/* Condition badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              listing.condition === "new"
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {listing.condition === "new" ? "New" : "Used"}
          </span>
        </div>

        {/* Action buttons */}
        {/* <div className="absolute bottom-2 right-2 flex space-x-2">
          <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div> */}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold text-gray-900 line-clamp-2 truncate ${
                viewMode !== "grid" ? "w-32 md:w-64" : "w-32 md:w-72"
              }`}
            >
              {year && `${year} `}
              {make && `${make} `}
              {model || listing.title}
            </h3>
            {listing?.body_style && (
              <p className="text-sm text-gray-600 capitalize">
                {listing?.body_style}
              </p>
            )}
          </div>
          <div className="text-right ml-4">
            {listing.bids_count === 0
              ? listing.buy_now_price && (
                  <p className="text-xl font-bold text-green-600">
                    <span className="price">$</span>
                    {formatPrice(listing.buy_now_price)}
                  </p>
                )
              : listing.bids_count &&
                (listing.bids?.length > 0) &
                (
                  <p className="text-xl font-bold text-green-600">
                    <span className="price">$</span>
                    {formatPrice(listing.bids?.[0]?.amount)}
                  </p>
                )}
            {listing.allow_offers && (
              <p className="text-xs text-gray-500">or best offer</p>
            )}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {listing?.year || "Not specified"}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            {(listing?.odometer && formatOdometer(listing?.odometer)) ||
              "Not specified"}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Fuel className="w-4 h-4 mr-2 text-gray-400" />
            {listing?.fuel_type || "Not specified"}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Settings className="w-4 h-4 mr-2 text-gray-400" />
            {listing?.transmission || "Not specified"}
          </div>
        </div>

        {/* Location and Date */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb4">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {`${listing.creator.regions?.name}, ${listing.creator.countries?.name}` ||
              "Location not specified"}
          </div>
          <div>Listed {new Date(listing.created_at).toLocaleDateString()}</div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex space-x-2">
          <Link 
            href={`/motors/listing/${listing.slug}`}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-center text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          {listing.allow_offers && (
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-medium transition-colors">
              Make Offer
            </button>
          )}
        </div> */}

        {/* Description Preview */}
        {/* {listing.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>
          </div>
        )} */}
      </div>
    </Link>
  );
};

export default MotorListingCard;
