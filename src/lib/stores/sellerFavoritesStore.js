import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '../api/user';

export const useSellerFavoritesStore = create(
  persist(
    (set, get) => ({
      favoriteSellers: [],
      isLoading: false,
      error: null,
      async fetchSellerFavorites() {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.sellerFavorites();
          const favoriteSellers = response.data || [];
          set({ favoriteSellers, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      async toggleSellerFavorite(sellerId) {
        set({ isLoading: true, error: null });
        try {
          await userApi.addAndDeleteSeller(sellerId);
          // Refresh favorites after toggle
          const response = await userApi.sellerFavorites();
          const favoriteSellers = response.data || [];
          set({ favoriteSellers, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      isSellerFavorite(sellerId) {
        const { favoriteSellers } = get();
        return favoriteSellers.some((seller) => seller.id === sellerId);
      },
      setFavoriteSellers(favoriteSellers) {
        set({ favoriteSellers });
      },
      clearFavoriteSellers() {
        set({ favoriteSellers: [] });
      },
    }),
    {
      name: 'seller-favorites-storage',
      getStorage: () => localStorage,
    }
  )
);

