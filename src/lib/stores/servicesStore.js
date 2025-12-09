import { create } from "zustand";

const initialState = {
  query: "",
  selectedCategory: "",
  selectedRegion: "",
  selectedArea: "",
  priceRange: [0, 5000],
  sortBy: "price-low-high",
  viewMode: "grid",
  // Service metadata (categories and regions)
  categories: [],
  regions: [],
  isLoadingMeta: false,
};

export const useServicesStore = create((set, get) => ({
  ...initialState,
  // Metadata setters
  setCategories: (categories) => set({ categories }),
  setRegions: (regions) => set({ regions }),
  setServiceMeta: (meta) => set({ 
    categories: meta.categories || [], 
    regions: meta.regions || [],
    isLoadingMeta: meta.isLoading || false,
  }),
  setIsLoadingMeta: (isLoading) => set({ isLoadingMeta: isLoading }),
  setQuery: (value) => set({ query: value }),
  setCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setRegion: (regionId) =>
    set({
      selectedRegion: regionId,
      selectedArea: regionId === get().selectedRegion ? get().selectedArea : "",
    }),
  setArea: (value) => set({ selectedArea: value }),
  setPriceRange: (range) => {
    const current = get().priceRange || [];
    if (
      current.length === 2 &&
      range.length === 2 &&
      current[0] === range[0] &&
      current[1] === range[1]
    ) {
      return;
    }
    set({ priceRange: range });
  },
  setSortBy: (value) => set({ sortBy: value }),
  setViewMode: (mode) => set({ viewMode: mode }),
  hydrateFromParams: (params = {}) => {
    const nextState = { ...initialState };
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (key === "priceMin" || key === "priceMax") return;
      if (key in nextState) {
        nextState[key] = value;
      }
    });

    const priceMin = Number.parseInt(params.priceMin, 10);
    const priceMax = Number.parseInt(params.priceMax, 10);
    if (!Number.isNaN(priceMin) || !Number.isNaN(priceMax)) {
      nextState.priceRange = [
        Number.isNaN(priceMin) ? initialState.priceRange[0] : priceMin,
        Number.isNaN(priceMax) ? initialState.priceRange[1] : priceMax,
      ];
    }

    set(nextState);
  },
  resetFilters: () => set(initialState),
}));


