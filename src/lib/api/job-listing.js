import axiosClient from "./axiosClient";

export const JobsApi = {
  createJob: async (formData) => {
    const response = await axiosClient.post("/user/job-listing/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateJob: async (slug, formData) => {
    const response = await axiosClient.post(
      `/user/job-listing/${slug}/update`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
  placeBid: (productId, formData) =>
    axiosClient.post(`/user/listings/bids/${productId}/store`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getListings: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    const searchParams = new URLSearchParams(filteredParams).toString();
    console.log("Check Listing:", searchParams)
    const response = await axiosClient.get(
      `/listings${searchParams ? `?${searchParams}&status=1` : "?status=1"}`
    );
    return response.data;
  },
  // Listing Filter
getListingsByFilter: async (payload) => {
  // Destructure all the potential filter and pagination values from payload
  const {
    category_id,
    region_id,
    governorate_id,
    work_type,
    minimum_pay_type,
    min_amount,
    max_amount,
    search,
    status,
    limit = 10, // Set a default limit for pagination
    offset = 0, // Set a default offset for pagination
  } = payload;

  // Create a URLSearchParams object to easily build the query string
  const params = new URLSearchParams();

  // Conditionally append parameters only if they have a value (e.g., not null, undefined, or empty string)
  if (search) params.append('keyword', search);
  if (category_id) params.append('category_id', category_id);
  if (region_id) params.append('region_id', region_id);
  if (governorate_id) params.append('governorate_id', governorate_id);
  if (work_type) params.append('work_type', work_type);
  if (minimum_pay_type) params.append('minimum_pay_type', minimum_pay_type);
  if (min_amount) params.append('min_amount', min_amount);
  if (max_amount) params.append('max_amount', max_amount);
  if (status) params.append('status', status);

  // Always include limit and offset for pagination
  params.append('limit', limit);
  params.append('offset', offset);

  // Construct the final URL with the query string
  const queryString = params.toString();
  const url = `/job-listing?${queryString}`;

  console.log("Check Listing URL:", url);

  const response = await axiosClient.get(url);
  return response.data;
},
  // Listing Filter By All Categories
  getListingsFilterByAllCategories: async (params = {}) => {
        const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    const searchParams = new URLSearchParams(filteredParams).toString();
    console.log("Check Listing:", searchParams)
    const response = await axiosClient.get(
      `/listings/suggestions${searchParams ? `?${searchParams}&status=1` : "?status=1"}`
    );
    return{
      web_suggestions: response?.web_suggestions || [],
      past_searches: response?.past_searches || [],
    };
  },

  listingsSearchHistory(params) {
  return axiosClient.get("listings/search", { params });
},
updateJobApplicationStatus: async ({ job_application_id, job_status }) => {
  try {
    const formData = new FormData();
    formData.append("job_application_id", job_application_id);
    formData.append("job_status", job_status);

    const response = await axiosClient.post(
      `/user/job-applying/statusupdate`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating job application status:", error);
    throw error;
  }
},

  getListingBySlug: async (productSlug) => {
    const response = await axiosClient.get(`/user/job-listing/${productSlug}/show`);
    return response.data;
  },

  getUserListings: async () => {

    const response = await axiosClient.get(
      `/user/job-listing/myJobs`
    );
    return response.data;
  },

  getUserListingsApplied: async () => {
    const response = await axiosClient.get(`/user/job-applying/myApplication`);
    return response;
  },
  getUserJobApplicants: async ({ id }) => {
    const response = await axiosClient.get(`/user/job-applying/${id}/applicantsForMyJob`);
    return response;
  },
  getApplicantProfile: async ({ applicationId }) => {
    const response = await axiosClient.get(`/user/job-applying/${applicationId}/getApplierProfile`);
    return response;
  },
  buyNow: async (productSlug) => {
    const response = await axiosClient.post(
      `/user/listings/${productSlug}/buy-now`
    );
    return response.data;
  },
  getUserWonListings: async (params = {}) => {
    const response = await axiosClient.get(`/user/auction-results/won`);
    return response.data;
  },

  getUserLostListings: async (params = {}) => {
    const response = await axiosClient.get(`/user/auction-results/lost`);
    return response.data;
  },
  withdrawListing: async (productId) => {
    const response = await axiosClient.delete(
      `/user/job-listing/${productId}/destroy`
    );
    return response.data;
  },

  PostNote: (formData, noteId) =>
    axiosClient.post(`user/listings/note/${noteId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  DeleteNote: async (noteId) =>
    await axiosClient.delete(`user/listings/note/${noteId}`),

  userReList: async (listingId) => {
    const response = await axiosClient.post(
      `/user/listings/${listingId}/relist`
    );
    return response.data;
  },

  acceptOffer: async (litingId) => {
    const response = await axiosClient.post(
      `/user/listings/offers/${litingId}/approve`
    );
    return response.data;
  },

  declineOffer: async (litingId) => {
    const response = await axiosClient.post(
      `/user/listings/offers/${litingId}/reject`
    );
    return response.data;
  },

  acceptBid: async (bidId) => {
    const response = await axiosClient.post(
      `/user/listings/bids/${bidId}/accept-bid`
    );
    return response.data;
  },

  rejectBid: async (bidId) => {
    const response = await axiosClient.post(
      `/user/listings/bids/${bidId}/reject-bid`
    );
    return response.data;
  },
};


export const commentsApi = {
  // Question post karne ka endpoint
  postComment: async (productId, commentText) => {
    const res = await axiosClient.post(`user/comments/${productId}/comment`, {
      comment_text: commentText,   // ✅ backend ke hisaab se
    });
    return res;
  },

  // Seller reply karne ka endpoint (agar API mai hai)
  postReply: async (commentId, reply) => {
    return await axiosClient.post(`/user/comments/${commentId}/reply`, {
      comment_text: reply,
    });
  },
  updatecommnet:async(updateid,update)=>{
    return await axiosClient.post(`/user/comments/${updateid}/update`,{
      comment_text:update,
    })
  },
deleteComment: async (commentId) => {
  return await axiosClient.delete(`/user/comments/${commentId}/delete`);
}
 };
