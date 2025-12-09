import { create } from "zustand";

export const useCityStore = create((set) => ({
  cities: [],
  isLoading: false,
  error: null,
  selectedCity: "", // <- this is the correct state key
  setSelectedCity: (city) => set({ selectedCity: city }), // <- fixed key name
}));