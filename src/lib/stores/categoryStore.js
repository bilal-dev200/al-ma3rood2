import { create } from "zustand";
import { categoriesApi } from "../api/category";

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  getAllCategories: async (categoryId, categoryType) => {
    set({ isLoading: true, error: null, categories: [] });
    try {
      const { data: categories } = await categoriesApi.getAllCategories(categoryId, categoryType);
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
