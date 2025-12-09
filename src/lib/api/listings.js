import axiosClient from "./axiosClient";

export const listingsApi = {
  createListing: async (formData) => {
    const response = await axiosClient.post("/user/listings/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateListing: async (slug, formData) => {
    const response = await axiosClient.post(
      `/user/listings/${slug}/update`,
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
  getListingsByFilter: async (payload, search) => {
    const formattedPayload = {
      listing_type: "marketplace",
      pagination: {
        page: payload?.pagination?.page || 1,
        per_page: payload?.pagination?.per_page || 30,
      },
    };

    // ✅ add category_id conditionally
    if (payload?.category_id !== undefined && payload?.category_id !== null) {
      const categoryId = parseInt(payload.category_id, 10);
      if (!Number.isNaN(categoryId)) {
        formattedPayload.category_id = categoryId;
      }
    }
    // ✅ add city if present
    if (payload?.city) {
      formattedPayload.city = payload.city;
    }
    if (payload?.region_id) {
      formattedPayload.regions_id = payload.region_id;
    }
    if (payload?.governorate_id) {
      formattedPayload.governorates_id = payload.governorate_id;
    }
    if (payload?.creator_id) {
      formattedPayload.creator_id = payload.creator_id;
    }

    // ✅ add condition if present
    if (payload?.condition) {
      formattedPayload.condition = payload.condition;
    }

    // ✅ add search if present
    if (payload?.search) {
      formattedPayload.search = payload.search;
    }
    // ✅ add search if present
    if (search) {
      formattedPayload.search = search;
    }

    // ✅ add min_price if present
    if (payload?.min_price !== undefined && payload?.min_price !== null) {
      formattedPayload.min_price = payload.min_price;
    }

    // ✅ add max_price if present
    if (payload?.max_price !== undefined && payload?.max_price !== null) {
      formattedPayload.max_price = payload.max_price;
    }

    // ✅ add filters if present
    if (payload?.filters && Object.keys(payload.filters).length > 0) {
      formattedPayload.filters = { ...payload.filters };
    }

    console.log("Check Listing:", formattedPayload)
    const response = await axiosClient.post(
      `/listings/filters`,
      formattedPayload
    );
    console.log("aaaaa Check Listing Response:", response)
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
    return {
      web_suggestions: response?.web_suggestions || [],
      past_searches: response?.past_searches || [],
      ...response // Pass through other properties like meta/links for pagination
    };
  },

  listingsSearchHistory: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    const searchParams = new URLSearchParams(filteredParams).toString();
    const response = await axiosClient.get(
      `/listings/search${searchParams ? `?${searchParams}&status=1` : "?status=1"}`
    );
    return response;
  },


  getListingBySlug: async (productSlug) => {
    const response = await axiosClient.get(`/listings/${productSlug}/show`);
    console.log("Check Listing By Slug:", response.data)
    return response.data;
  },
  // getUserListings: async (params = {}) => {
  //   const filteredParams = Object.fromEntries(
  //     Object.entries(params).filter(([_, v]) => v !== undefined)
  //   );
  //   const searchParams = new URLSearchParams(filteredParams).toString();
  //   const hasNotEqualStatus = Object.prototype.hasOwnProperty.call(
  //     filteredParams,
  //     "not_equal_status"
  //   );
  //   const response = await axiosClient.get(
  //     `/user/listings${
  //       searchParams
  //         ? hasNotEqualStatus
  //           ? `?${searchParams}`
  //           : `?${searchParams}&status=1`
  //         : hasNotEqualStatus
  //         ? ""
  //         : "?status=1"
  //     }`
  //   );
  //   return response.data;
  // },
  // getUserListingsOffer: async (params = {}) => {
  //   const filteredParams = Object.fromEntries(
  //     Object.entries(params).filter(([_, v]) => v !== undefined)
  //   );
  //   const searchParams = new URLSearchParams(filteredParams).toString();
  //   const response = await axiosClient.get(`/getUserListingsOffer`);
  //   return response.data;
  // },
  // getUserListings: async (params = {}) => {
  //   const filteredParams = Object.fromEntries(
  //     Object.entries(params).filter(([_, v]) => v !== undefined)
  //   );
  //   const searchParams = new URLSearchParams(filteredParams).toString();
  //   const hasNotEqualStatus = Object.prototype.hasOwnProperty.call(
  //     filteredParams,
  //     "not_equal_status"
  //   );
  //   const hasStatus = Object.prototype.hasOwnProperty.call(
  //     filteredParams,
  //     "status"
  //   );
  //   const response = await axiosClient.get(
  //     `/user/listings${
  //       searchParams
  //         ? (hasNotEqualStatus || hasStatus)
  //           ? `?${searchParams}`
  //           : `?${searchParams}&status=1`
  //         : (hasNotEqualStatus || hasStatus)
  //         ? ""
  //         : "?status=1"
  //     }`
  //   );
  //   return response.data;
  // },
  // getUserListings: async (params = {}) => {
  //   const filteredParams = Object.fromEntries(
  //     Object.entries(params).filter(([_, v]) => v !== undefined)
  //   );
  //   const hasNotEqualStatus = Object.prototype.hasOwnProperty.call(
  //     filteredParams,
  //     "not_equal_status"
  //   );
  //   const hasStatus = Object.prototype.hasOwnProperty.call(
  //     filteredParams,
  //     "status"
  //   );

  //   // Build query string manually to support repeated params like ?status=4&status=5
  //   const searchParams = new URLSearchParams();

  //   for (const [key, value] of Object.entries(filteredParams)) {
  //     if (Array.isArray(value)) {
  //       // Append each item as separate query param
  //       value.forEach((v) => searchParams.append(key, v));
  //     } else {
  //       searchParams.append(key, value);
  //     }
  //   }

  //   // Append default status=1 if neither status nor not_equal_status is provided
  //   if (!hasStatus && !hasNotEqualStatus) {
  //     searchParams.append("status", "1");
  //   }

  //   const queryString = searchParams.toString();
  //   const response = await axiosClient.get(
  //     `/user/listings${queryString ? `?${queryString}` : ""}`
  //   );
  //   return response.data;
  // },
  getUserListings: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const hasNotEqualStatus = Object.prototype.hasOwnProperty.call(
      filteredParams,
      "not_equal_status"
    );
    const hasStatus = Object.prototype.hasOwnProperty.call(
      filteredParams,
      "status"
    );

    // Manually build the query string to avoid encoding commas
    const queryParts = [];

    for (const [key, value] of Object.entries(filteredParams)) {
      if (Array.isArray(value)) {
        queryParts.push(`${key}=${value.join(",")}`); // Force comma without encoding
      } else {
        queryParts.push(`${key}=${value}`);
      }
    }

    // Append default status=1 if neither status nor not_equal_status is provided
    if (!hasStatus && !hasNotEqualStatus) {
      queryParts.push("status=1");
    }

    const queryString = queryParts.join("&");
    const response = await axiosClient.get(
      `/user/listings${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  },

  getUserListingsOffer: async (params = {}) => {
    const response = await axiosClient.get(`/user/listings/offers`);
    return response;
  },
  makeOffer: async (productId, formData) => {
    const response = await axiosClient.post(
      `/user/listings/offers/${productId}/store`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
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
  withdrawListing: async (productSlug) => {
    const response = await axiosClient.post(
      `/user/listings/${productSlug}/withdraw`
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

  getCoolAuctions: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    const searchParams = new URLSearchParams(filteredParams).toString();
    const response = await axiosClient.get(
      `/listings/coolAuctions${searchParams ? `?${searchParams}` : ""}`
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
  updatecommnet: async (updateid, update) => {
    return await axiosClient.post(`/user/comments/${updateid}/update`, {
      comment_text: update,
    })
  },
  deleteComment: async (commentId) => {
    return await axiosClient.delete(`/user/comments/${commentId}/delete`);
  }
};
