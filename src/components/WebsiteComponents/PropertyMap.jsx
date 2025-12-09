"use client";
import React, { useRef, useEffect, useState } from "react";
import { initializeGoogleMaps, getPopularPlaces } from "@/lib/googleMaps";

const PropertyMap = ({
  propertyLocation,
  nearbyProperties = [],
  showPopularPlaces = true,
  height = "400px",
  className = "",
  t,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [popularPlaces, setPopularPlaces] = useState({});
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await initializeGoogleMaps();

        if (mapRef.current && propertyLocation) {
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: { lat: propertyLocation.lat, lng: propertyLocation.lng },
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          mapInstanceRef.current = map;

          // Add main property marker
          const mainMarker = new window.google.maps.Marker({
            position: { lat: propertyLocation.lat, lng: propertyLocation.lng },
            map: map,
            title: propertyLocation.address || "Property Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="##175F48" stroke="#ffffff" stroke-width="3" d="M24 3C15.163 3 8 10.163 8 19c0 8.837 16 26 16 26s16-17.163 16-26c0-8.837-7.163-16-16-16zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
        </svg>
      `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40), // Adjust anchor to bottom tip
            },
          });

          markersRef.current.push(mainMarker);

          // Add nearby properties markers
          nearbyProperties.forEach((property, index) => {
            if (property.lat && property.lng) {
              const marker = new window.google.maps.Marker({
                position: { lat: property.lat, lng: property.lng },
                map: map,
                title: property.title || `Property ${index + 1}`,
                icon: {
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
                      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(24, 24),
                  anchor: new window.google.maps.Point(12, 12),
                },
              });

              // Add info window for nearby properties
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div class="p-2">
                    <h3 class="font-semibold text-sm">${
                      property.title || "Property"
                    }</h3>
                    <p class="text-xs text-gray-600">${
                      property.price || "Price not available"
                    }</p>
                    <p class="text-xs text-gray-500">${
                      property.address || ""
                    }</p>
                  </div>
                `,
              });

              marker.addListener("click", () => {
                infoWindow.open(map, marker);
              });

              markersRef.current.push(marker);
            }
          });

          setIsLoaded(true);

          // Load popular places if enabled
          if (showPopularPlaces) {
            loadPopularPlaces(propertyLocation.lat, propertyLocation.lng);
          }
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [propertyLocation, nearbyProperties, showPopularPlaces]);

  // Load popular places
  const loadPopularPlaces = async (lat, lng) => {
    try {
      const places = await getPopularPlaces(lat, lng);
      setPopularPlaces(places);
    } catch (error) {
      console.error("Error loading popular places:", error);
    }
  };

  // Add/remove popular places markers
  const togglePlaceType = (placeType) => {
    if (selectedPlaceType === placeType) {
      // Remove markers for this type
      removePlaceMarkers(placeType);
      setSelectedPlaceType(null);
    } else {
      // Remove previous markers and add new ones
      if (selectedPlaceType) {
        removePlaceMarkers(selectedPlaceType);
      }
      addPlaceMarkers(placeType, popularPlaces[placeType] || []);
      setSelectedPlaceType(placeType);
    }
  };

  const addPlaceMarkers = (placeType, places) => {
    const icons = {
      hospital: { color: "#EF4444", icon: "🏥" },
      school: { color: "#3B82F6", icon: "🏫" },
      shopping_mall: { color: "#F59E0B", icon: "🛍️" },
      mosque: { color: "#10B981", icon: "🕌" },
      restaurant: { color: "#8B5CF6", icon: "🍽️" },
      gas_station: { color: "#6B7280", icon: "⛽" },
      bank: { color: "#059669", icon: "🏦" },
      pharmacy: { color: "#DC2626", icon: "💊" },
    };

    const iconConfig = icons[placeType] || { color: "#6B7280", icon: "📍" };

    places.forEach((place) => {
      if (place.geometry && place.geometry.location) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          map: mapInstanceRef.current,
          title: place.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="12" fill="${iconConfig.color}" stroke="#ffffff" stroke-width="2"/>
                <text x="14" y="18" text-anchor="middle" font-size="12" fill="white">${iconConfig.icon}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(28, 28),
            anchor: new window.google.maps.Point(14, 14),
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${place.name}</h3>
              <p class="text-xs text-gray-600">${place.vicinity || ""}</p>
              <p class="text-xs text-gray-500">${
                place.rating ? `Rating: ${place.rating}/5` : ""
              }</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        marker.placeType = placeType;
        markersRef.current.push(marker);
      }
    });
  };

  const removePlaceMarkers = (placeType) => {
    markersRef.current = markersRef.current.filter((marker) => {
      if (marker.placeType === placeType) {
        marker.setMap(null);
        return false;
      }
      return true;
    });
  };

  if (!propertyLocation) {
    return (
      <div
        className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">No location data available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full rounded-lg border border-gray-300 overflow-hidden"
        style={{ height }}
      />

      {/* Popular Places Controls */}
      {showPopularPlaces && Object.keys(popularPlaces).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            {t("Nearby Places")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(popularPlaces).map(
              ([type, places]) =>
                places.length > 0 && (
                  <button
                    key={type}
                    onClick={() => togglePlaceType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedPlaceType === type
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {type.replace("_", " ").toUpperCase()} ({places.length})
                  </button>
                )
            )}
          </div>
        </div>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
