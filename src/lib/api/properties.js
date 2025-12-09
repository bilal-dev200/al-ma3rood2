import axiosClient from "./axiosClient";

export const propertiesApi = {
  // Get motor listings with specific filters
  getMotorListings: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    
    // Add motor-specific category filter
    filteredParams.category_type = 'motors';
    
    const searchParams = new URLSearchParams(filteredParams).toString();
    const response = await axiosClient.get(
      `/listings${searchParams ? `?${searchParams}&status=1` : "?status=1&category_type=motors"}`
    );
    return response.data;
  },

    getPropertiesByFilter: async (payload, search) => {
   const formattedPayload = {
        listing_type: "property",
    filters: {},
        pagination: {
          page: payload?.pagination?.page || 1,
          per_page: payload?.pagination?.per_page || 6,
        },
      };

        // ✅ add vehicle_type only if present
  if (payload?.parking) {
    formattedPayload.filters.parking = payload.parking;
  }

          // ✅ add make only if present
  if (payload?.make) {
    formattedPayload.filters.make = payload.make;
  }

            // ✅ add model only if present
  if (payload?.model) {
    formattedPayload.filters.model = payload.model;
  }

            // ✅ add fuel_type only if present
  if (payload?.fuel_type) {
    formattedPayload.filters.fuel_type = payload.fuel_type;
  }

            // ✅ add transmission only if present
  if (payload?.transmission) {
    formattedPayload.filters.transmission = payload.transmission;
  }

              // ✅ add body_style only if present
  if (payload?.land_area) {
    formattedPayload.filters.land_area = payload.land_area;
  }

  if (payload?.region) {
    formattedPayload.filters.region = payload.region;
  }
  if (payload?.governorate) {
    formattedPayload.filters.governorate = payload.governorate;
  }
  
        // ✅ add category_id conditionally
      // if (payload?.category_id !== undefined && payload?.category_id !== null) {
      //   const categoryId = parseInt(payload.category_id, 10);
      //   if (!Number.isNaN(categoryId)) {
      //     formattedPayload.category_id = categoryId;
      //   }
      // }
       // ✅ add city if present
      if (payload?.min_price) {
        formattedPayload.min_price = payload.min_price;
      }
  
      if (payload?.max_price) {
        formattedPayload.max_price = payload.max_price;
      }
  
      // ✅ add condition if present
      if (payload?.condition) {
        formattedPayload.condition = payload.condition;
      }
  
      // ✅ add search if present
      if (payload?.search) {
        formattedPayload.search = payload.search;
      }
  
      // // ✅ add min_price if present
      // if (payload?.min_price !== undefined && payload?.min_price !== null) {
      //   formattedPayload.min_price = payload.min_price;
      // }

         if (payload?.category_id !== undefined && payload?.category_id !== null) {
        formattedPayload.category_id = payload.category_id;
      }
  
      // ✅ add max_price if present
      // if (payload?.max_price !== undefined && payload?.max_price !== null) {
      //   formattedPayload.max_price = payload.max_price;
      // }
  
      // ✅ add filters if present
      // if (payload?.filters && Object.keys(payload.filters).length > 0) {
      //   formattedPayload.filters = { ...payload.filters };
      // }
  
      console.log("Check Listing:", formattedPayload)
      const response = await axiosClient.post(
        `/listings/filters`,
        formattedPayload
      );
      return response.data;
    },

  // Search motors with advanced filters
  searchMotors: async (filters = {}) => {
    const searchData = {
      ...filters,
      category_type: 'motors',
      status: 1
    };

    const response = await axiosClient.post('/motors/search', searchData);
    return response.data;
  },

  // Get motor by slug
  getMotorBySlug: async (slug) => {
    const response = await axiosClient.get(`/motors/${slug}`);
    return response.data;
  },

  // Get motor makes based on vehicle type
  getMotorMakes: async (vehicleType = null) => {
    const params = vehicleType ? `?vehicle_type=${vehicleType}` : '';
    const response = await axiosClient.get(`/motors/makes${params}`);
    return response.data;
  },

  // Get motor models based on make
  getMotorModels: async (make, vehicleType = null) => {
    const params = new URLSearchParams({ make });
    if (vehicleType) params.append('vehicle_type', vehicleType);
    
    const response = await axiosClient.get(`/motors/models?${params.toString()}`);
    return response.data;
  },

  // Get popular motor searches
  getPopularSearches: async () => {
    const response = await axiosClient.get('/motors/popular-searches');
    return response.data;
  },

  // Get motor statistics
  getMotorStats: async () => {
    const response = await axiosClient.get('/motors/stats');
    return response.data;
  },

  // Advanced motor search with multiple criteria
  advancedMotorSearch: async (criteria) => {
    const response = await axiosClient.post('/motors/advanced-search', criteria);
    return response.data;
  },

  // Get similar motors
  getSimilarMotors: async (motorSlug, limit = 4) => {
    const response = await axiosClient.get(`/motors/${motorSlug}/similar?limit=${limit}`);
    return response.data;
  },

  // Get motor price estimates
  getMotorPriceEstimate: async (make, model, year, odometer) => {
    const params = new URLSearchParams({ make, model, year, odometer });
    const response = await axiosClient.get(`/motors/price-estimate?${params.toString()}`);
    return response.data;
  }
};

// Motor search filters helper
export const motorSearchFilters = {
  vehicleTypes: ['Cars', 'Motorbikes', 'Caravans & Motorhomes', 'Boats & marine', 'Car parts & accessories'],
  
  conditions: ['new', 'used'],
  
  fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'],
  
  transmissions: ['Automatic', 'Manual'],
  
  bodyStyles: ['Sedan', 'SUV', 'Hatchback', 'Crossover', 'Truck', 'Ute', 'Van', 'Coupe', 'Wagon', 'Convertible'],
  
  priceRanges: [
    { label: 'Under $5,000', min: 0, max: 5000 },
    { label: '$5,000 - $10,000', min: 5000, max: 10000 },
    { label: '$10,000 - $20,000', min: 10000, max: 20000 },
    { label: '$20,000 - $30,000', min: 20000, max: 30000 },
    { label: '$30,000 - $50,000', min: 30000, max: 50000 },
    { label: '$50,000 - $100,000', min: 50000, max: 100000 },
    { label: 'Over $100,000', min: 100000, max: null }
  ],
  
  yearRanges: (() => {
    const currentYear = new Date().getFullYear();
    const ranges = [];
    for (let i = currentYear; i >= 1990; i -= 5) {
      ranges.push({
        label: `${i - 4} - ${i}`,
        min: i - 4,
        max: i
      });
    }
    return ranges;
  })(),
  
  odometerRanges: [
    { label: 'Under 10,000 km', min: 0, max: 10000 },
    { label: '10,000 - 50,000 km', min: 10000, max: 50000 },
    { label: '50,000 - 100,000 km', min: 50000, max: 100000 },
    { label: '100,000 - 150,000 km', min: 100000, max: 150000 },
    { label: '150,000 - 200,000 km', min: 150000, max: 200000 },
    { label: 'Over 200,000 km', min: 200000, max: null }
  ]
};

export default propertiesApi; 