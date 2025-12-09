import { listingsApi } from './listings';

/**
 * Fetch nearby properties based on coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in kilometers (default: 5)
 * @param {string} listingType - Type of listing to search for (default: 'property')
 * @returns {Promise<Array>} - Array of nearby properties
 */
export async function getNearbyProperties(lat, lng, radius = 5, listingType = 'property') {
  try {
    // This would typically be a backend API call that searches for properties
    // within a certain radius of the given coordinates
    // For now, we'll simulate this with a mock implementation
    
    // In a real implementation, you would call your backend API like:
    // const response = await listingsApi.getNearbyProperties(lat, lng, radius, listingType);
    // return response.data;
    
    // Mock data for demonstration
    const mockNearbyProperties = [
      {
        id: 1,
        title: "Luxury Villa in Downtown",
        price: "2,500,000",
        address: "123 King Fahd Road, Riyadh",
        lat: lat + 0.01,
        lng: lng + 0.01,
        bedrooms: 4,
        bathrooms: 3,
        area: "350 sqm",
        image: "/placeholder-property-1.jpg"
      },
      {
        id: 2,
        title: "Modern Apartment Complex",
        price: "1,800,000",
        address: "456 Olaya Street, Riyadh",
        lat: lat - 0.005,
        lng: lng + 0.008,
        bedrooms: 3,
        bathrooms: 2,
        area: "280 sqm",
        image: "/placeholder-property-2.jpg"
      },
      {
        id: 3,
        title: "Family House with Garden",
        price: "3,200,000",
        address: "789 Diplomatic Quarter, Riyadh",
        lat: lat + 0.015,
        lng: lng - 0.012,
        bedrooms: 5,
        bathrooms: 4,
        area: "450 sqm",
        image: "/placeholder-property-3.jpg"
      }
    ];

    return mockNearbyProperties;
  } catch (error) {
    console.error('Error fetching nearby properties:', error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
