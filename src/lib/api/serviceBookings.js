import axiosClient from "./axiosClient";

export const serviceBookingsApi = {
  bookService: (serviceSlug, payload) =>
    axiosClient.post(`/user/services/${serviceSlug}/book`, payload),

  getBooking: (bookingId) =>
    axiosClient.get(`/user/services/bookings/${bookingId}`),

  getBuyerBookings: (params = {}) =>
    axiosClient.get("/user/services/bookings", { params }),

  getProviderBookings: (params = {}) =>
    axiosClient.get("/user/services/provider-bookings", { params }),

  providerRespond: (bookingId, payload) =>
    axiosClient.post(
      `/user/services/bookings/${bookingId}/provider-response`,
      payload
    ),

  buyerConfirm: (bookingId, payload) =>
    axiosClient.post(
      `/user/services/bookings/${bookingId}/buyer-confirmation`,
      payload
    ),

  markComplete: (bookingId, payload) =>
    axiosClient.post(
      `/user/services/bookings/${bookingId}/mark-complete`,
      payload
    ),
};


