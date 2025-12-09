import axiosClient from './axiosClient';

export const watchlistApi = {
  addToWatchlist: (productSlug) =>
    axiosClient.post(`/user/watchlist/${productSlug}/store`),
  getWatchlist: () =>
    axiosClient.get('/user/watchlist'),
  removeFromWatchlist: (productSlug) =>
    axiosClient.delete(`/user/watchlist/${productSlug}/destroy`),
}; 