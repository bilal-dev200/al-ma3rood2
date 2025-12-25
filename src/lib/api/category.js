import axiosClient from "./axiosClient";

export const categoriesApi = {
  getAllCategories: (categoryId, listing_type) =>
    categoryId
      ? axiosClient.get(
          `/category?status=1&category_type=${listing_type ? listing_type : 'marketplace'}&parent_id=${categoryId}`
        )
      : axiosClient.get(`/category?status=1&category_type=${listing_type ? listing_type : 'marketplace'}`),
  getCategoryTree: (listing_type = "marketplace") =>
    axiosClient.get(`/category/tree?status=1&category_type=${listing_type}`),
    getAllCategoriesSearches: (categoryId, listing_type) =>
    categoryId
      ? axiosClient.get(
          `/category?status=1&category_type=${listing_type ? listing_type : ''}&parent_id=${categoryId}`
        )
      : axiosClient.get(`/category?status=1&category_type=${listing_type ? listing_type : ''}`),
};
