import { create } from "zustand";
import { locationsApi } from "../api/location";

export const useLocationStore = create((set, get) => ({
  locations: [], // Countries
  regions: [],
  cities: [],
  areas: [], // Renamed from cities/governorates for consistency or just structural changes

  isLoading: false,
  error: null,

  // Selected values
  selectedCountry: null,
  selectedRegion: null,
  selectedCity: null,
  selectedArea: null,

  // Fetch Countries
  getAllLocations: async () => {
    const { locations } = get();
    if (locations.length > 0) return locations;

    set({ isLoading: true, error: null });
    try {
      const { data } = await locationsApi.getAllLocations();
      const countries = data?.countries || [];
      set({ locations: countries, isLoading: false });
      return countries;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch Regions
  fetchRegions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await locationsApi.getRegions();
      const regions = response.data || [];
      set({ regions, isLoading: false });
      return regions;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching regions:", error);
      return [];
    }
  },

  // Fetch Cities by Region
  fetchCities: async (region_id, search = '') => {
    if (!region_id) return;
    set({ isLoading: true, error: null });
    try {
      const response = await locationsApi.getCities(region_id, search);
      const cities = response.data || [];
      set({ cities, isLoading: false });
      return cities;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching cities:", error);
      return [];
    }
  },

  // Fetch Areas by City
  fetchAreas: async (city_id, search = '') => {
    if (!city_id) return;
    set({ isLoading: true, error: null });
    try {
      const response = await locationsApi.getAreas(city_id, search);
      const areas = response.data || [];
      set({ areas, isLoading: false });
      return areas;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching areas:", error);
      return [];
    }
  },

  // Setters
  setSelectedCountry: (country) =>
    set({
      selectedCountry: country,
      selectedRegion: null,
      selectedCity: null,
      selectedArea: null,
      regions: [],
      cities: [],
      areas: []
    }),

  setSelectedRegion: (region) =>
    set({
      selectedRegion: region,
      selectedCity: null,
      selectedArea: null,
      cities: [],
      areas: []
    }),

  setSelectedCity: (city) =>
    set({
      selectedCity: city,
      selectedArea: null,
      areas: []
    }),

  setSelectedArea: (area) =>
    set({ selectedArea: area }),

  reset: () => set({
    selectedRegion: null,
    selectedCity: null,
    selectedArea: null,
    regions: [],
    cities: [],
    areas: []
  })
}));
