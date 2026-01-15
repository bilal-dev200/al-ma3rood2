import axiosClient from "./axiosClient";

export const locationsApi = {
  getAllLocations: (payload) =>
    axiosClient.post(`/countries/list`, payload),

  getRegions: () => axiosClient.get(`/regions?limit=200`),
  getCities: (region_id, search = '') => axiosClient.get(`/cities?region_id=${region_id}&search=${search}&limit=200`),
  getAreas: (city_id, search = '') => axiosClient.get(`/areas?city_id=${city_id}&search=${search}&limit=200`),
};
