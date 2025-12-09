"use client";
import React, { useRef, useEffect, useState } from "react";
import { initializeGoogleMaps } from "@/lib/googleMaps";

const GooglePlacesAutocomplete = ({ 
  value, 
  onChange, 
  onPlaceSelect, 
  placeholder = "Enter address",
  className = "",
  disabled = false 
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await initializeGoogleMaps();
        
        if (inputRef.current && window.google) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['address'],
              componentRestrictions: { country: ['sa'] }, // GCC countries
              fields: ['place_id', 'geometry', 'name', 'formatted_address', 'address_components']
            }
          );

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            
            if (place.geometry && place.geometry.location) {
              const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
                place_id: place.place_id,
                name: place.name,
                address_components: place.address_components,
              };
              
              onChange(place.formatted_address);
              onPlaceSelect?.(location);
            }
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || !isLoaded}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      {!isLoaded && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
