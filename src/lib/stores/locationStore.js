import { create } from "zustand";
import { locationsApi } from "../api/location";

export const useLocationStore = create((set, get) => ({
  locations: [],
  isLoading: false,
  error: null,

  // Selected values
  selectedCountry: null,
  selectedRegion: null,
  selectedGovernorate: null,

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

   // Setters for selected values
  setSelectedCountry: (country) =>
    set({
      selectedCountry: country,
      selectedRegion: null,
      selectedGovernorate: null, // reset dependent values
    }),

  setSelectedRegion: (region) =>
    set({
      selectedRegion: region,
      selectedGovernorate: null, // reset dependent value
    }),

  setSelectedGovernorate: (governorate) =>
    set({ selectedGovernorate: governorate }),

}));
