"use client";
import React, { useState, useEffect } from "react";
import PropertyMap from "./PropertyMap";
import { getNearbyProperties } from "@/lib/api/nearbyProperties";
import { geocodeAddress } from "@/lib/googleMaps";
import { Image_URL } from "@/config/constants";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const PropertyMapSection = ({ property, nearBy }) => {
  const [propertyLocation, setPropertyLocation] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if property has coordinates
        if (property.latitude && property.longitude) {
          const location = {
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude),
            address: property.address || "Property Location"
          };
          setPropertyLocation(location);

          // Fetch nearby properties
          const nearby = await getNearbyProperties(location.lat, location.lng);
          setNearbyProperties(nearby);
        } else if (property.address) {
          // Geocode the address to get coordinates
          try {
            const geocoded = await geocodeAddress(property.address);
            const location = {
              lat: geocoded.lat,
              lng: geocoded.lng,
              address: geocoded.formatted_address
            };
            setPropertyLocation(location);

            // Fetch nearby properties
            const nearby = await getNearbyProperties(location.lat, location.lng);
            setNearbyProperties(nearby);
          } catch (geocodeError) {
            console.error('Geocoding error:', geocodeError);
            setError('Unable to locate the property address on the map.');
          }
        } else {
          setError('No location information available for this property.');
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load the map. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (property) {
      initializeMap();
    }
  }, [property]);
  console.log('nearBy', nearBy);

  if (loading) {
    return (
      <div className="mx-auto p-4 sm:px-6 md:px-10 font-sans max-w-6xl">
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 sm:px-6 md:px-10 font-sans max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Unavailable</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!propertyLocation) {
    return (
      <div className="mx-auto p-4 sm:px-6 md:px-10 font-sans max-w-6xl">
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">No location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:px-6 md:px-10 font-sans max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("Property Location")}</h2>
        <p className="text-gray-600">
          {propertyLocation.address}
        </p>
      </div>

      <PropertyMap
        propertyLocation={propertyLocation}
        nearbyProperties={nearbyProperties}
        showPopularPlaces={true}
        height="500px"
        className="mb-6"
        t={t}
      />

      {/* Nearby Properties Section */}
      {nearBy.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t("Nearby Properties")} ({nearBy?.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearBy?.map((property) => (
              <Link href={`/property/${property?.slug}`} key={property.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src={`${Image_URL}${property.images[0]?.image_path}`}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-property.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {property.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {property.address}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                      {property.bedrooms && (
                        <span>{property.bedrooms} {t("Bed")}</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} {t("Bath")}</span>
                      )}
                      {property.land_area && (
                        <span>{property.land_area} {t("Sqft")}</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-green-600 mt-2">
                     <span className="price"> $</span> {property.buy_now_price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMapSection;
