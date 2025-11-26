import axiosClient from "./axiosClient";

export const userApi = {
  uploadProfileImage: (formData) =>
    axiosClient.post("/user/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  uploadCoverImage: (userId, formData) =>
    axiosClient.post(`/user/upload-background`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  uploadEmail: (formData) =>
    axiosClient.post("/user/change-email", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updatePassword: (formData) =>
    axiosClient.post("/user/change-password", formData),

  updateUsername: (formData) => axiosClient.post("/user/update-name", formData),

  contactDetail: (userId, formData) =>
    axiosClient.post(`/user/${userId}/edit-contact-details`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getDeliveryAddress: () => axiosClient.get("/user/delivery-addresses"),

  deleteDeliveryAddress: (id) =>
    axiosClient.delete(`/user/delivery-addresses/${id}/destroy`),

  updateDeliveryAddress: (id, formData) =>
    axiosClient.post(`/user/delivery-addresses/${id}/update`, formData),

  updateProfile: (formData) =>
    axiosClient.post("/user/profile-update", formData),

  getProfile: () => axiosClient.get("/user/profile"),

  getJobProfile: (id) => axiosClient.get(`user/job-applying/${id}/getApplierProfile`),


  categoryFavorites: () => axiosClient.get("/user/favorites/categories"),

  sellerFavorites: () => axiosClient.get("/user/favorites/sellers"),

  addAndDeleteFavorities: (id) =>
    axiosClient.post(`user/favorites/category/${id}`),

  addAndDeleteSeller: (id) =>
    axiosClient.post(`user/favorites/seller/${id}`),

  userNotification: () => axiosClient.get("/user/notification"),

  userReadNotification: (id) =>
    axiosClient.post(`user/notification/${id}/read`),

  userAllReadNotification: () =>
    axiosClient.post(`user/notification/read`),

  // userFeedbacks: () => axiosClient.get("/user/notification"),
  addFeedback: (payload) => {
    return axiosClient.post("user/feedback/store", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  addImprovementFeedback: (payload) => {
    return axiosClient.post("user/feedback/storeform", payload);
  },

  updateFeedback: (id, formData) => {
    return axiosClient.post(`user/feedback/${id}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  userFeedback: (userId) =>
    axiosClient.get(`user/feedback/stats/${userId}`),

  getFeedbackForm: () =>
    axiosClient.get("/user/feedback/form"),

  contactmessage: async (payload) => {
    return await axiosClient.post("contact/message", payload);
  }
};
