import axiosClient from "./axiosClient";

export const locationsApi = {
  getAllLocations: (payload) =>
    axiosClient.post(`/countries/list`, payload),
};
