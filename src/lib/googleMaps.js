// Google Maps utility functions

/**
 * Initialize Google Maps API
 * @returns {Promise<boolean>} - Returns true when Google Maps is loaded
 */
export function initializeGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) {
      resolve(true);
      return;
    }

    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        resolve(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  });
}

/**
 * Geocode an address to get coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
export async function geocodeAddress(address) {
  await initializeGoogleMaps();
  
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Find nearby places using Places API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} type - Type of place (hospital, school, shopping_mall, mosque, etc.)
 * @param {number} radius - Search radius in meters (default: 2000)
 * @returns {Promise<Array>} - Array of nearby places
 */
export async function findNearbyPlaces(lat, lng, type, radius = 2000) {
  await initializeGoogleMaps();
  
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: radius,
      type: type
    };
    
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
}

/**
 * Calculate distance between two points
 * @param {number} lat1 - First point latitude
 * @param {number} lng1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lng2 - Second point longitude
 * @returns {number} - Distance in meters
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Get popular places around a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Object containing different types of places
 */
export async function getPopularPlaces(lat, lng) {
  const placeTypes = [
    'hospital',
    'school',
    'shopping_mall',
    'mosque',
    'restaurant',
    'gas_station',
    'bank',
    'pharmacy'
  ];

  const places = {};
  
  for (const type of placeTypes) {
    try {
      const results = await findNearbyPlaces(lat, lng, type, 2000);
      places[type] = results.slice(0, 5); // Limit to 5 results per type
    } catch (error) {
      console.error(`Error fetching ${type} places:`, error);
      places[type] = [];
    }
  }

  return places;
}
