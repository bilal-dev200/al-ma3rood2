import axiosClient from "./axiosClient";
import axiosPublicClient from "./axiosPublicClient";

function buildListParams(filters = {}) {
  const params = {};
  if (filters.query) {
    params.keyword = filters.query.trim();
  }

  const categorySource = filters.subcategory || filters.category;
  const categoryId = Number.parseInt(categorySource, 10);
  if (!Number.isNaN(categoryId)) {
    params.category_id = categoryId;
  }

  const regionId = Number.parseInt(filters.region, 10);
  if (!Number.isNaN(regionId)) {
    params.region_id = regionId;
  }

  const governorateId = Number.parseInt(filters.area, 10);
  if (!Number.isNaN(governorateId)) {
    params.governorate_id = governorateId;
  }

  if (Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
    const [min, max] = filters.priceRange;
    const parsedMin = Number.parseFloat(min);
    const parsedMax = Number.parseFloat(max);
    if (!Number.isNaN(parsedMin)) {
      params.price_min = parsedMin;
    }
    if (!Number.isNaN(parsedMax)) {
      params.price_max = parsedMax;
    }
  }

  if (filters.sortBy) {
    params.sort = filters.sortBy;
  }

  params.page = filters.page || 1;
  params.page_size = filters.pageSize || 20;
  return params;
}

export const servicesApi = {
  createService: async (formData) => {
    return axiosClient.post("/user/services/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getServices: async (filters = {}) => {
    const params = buildListParams(filters);
    return axiosPublicClient.get("/services", { params });
  },
  getServiceBySlug: async (slug) => {
    return axiosPublicClient.get(`/services/show?slug=${slug}`);
  },
  getUserServices: async (filters = {}) => {
    const params = buildListParams(filters);
    return axiosClient.get("/user/services", { params });
  },
  updateService: async (serviceId, formData) => {
    return axiosClient.post(`/user/services/update/${serviceId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteImage: async (serviceId, imageId) => {
    const formData = new FormData();
    formData.append("service_id", serviceId);
    formData.append("image_id", imageId);
    return axiosClient.post("/user/services/imageDelete", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

