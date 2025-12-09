import { create } from "zustand";
import { serviceBookingsApi } from "@/lib/api/serviceBookings";
import { Image_URL } from "@/config/constants";

const initialPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  lastPage: 1,
};

const initialState = {
  buyerBookings: [],
  providerBookings: [],
  buyerPagination: { ...initialPagination },
  providerPagination: { ...initialPagination },
  isLoading: false,
  error: null,
};

function upsert(list, booking) {
  // Only upsert if booking is valid and has a bookingId
  if (!booking || !booking.bookingId) return list;
  const exists = list.some((item) => item.bookingId === booking.bookingId);
  if (exists) {
    return list.map((item) =>
      item.bookingId === booking.bookingId ? booking : item
    );
  }
  return [booking, ...list];
}

function normalizeActor(actor) {
  if (!actor) return null;
  return {
    id: actor.id,
    name: actor.name || actor.full_name || "",
    email: actor.email || "",
    phone: actor.phone || "",
    avatar: actor.avatar || actor.image || actor.profile_photo || null,
    profile_photo: actor.profile_photo || actor.avatar || actor.image || null,
  };
}

function normalizeSchedule(schedule = {}) {
  if (!schedule) {
    return { date: null, startTime: null, endTime: null };
  }
  return {
    date: schedule.date || schedule.scheduled_date || null,
    startTime: schedule.start_time || schedule.startTime || null,
    endTime: schedule.end_time || schedule.endTime || null,
  };
}

function normalizeQuote(quote = {}) {
  if (!quote) return null;
  const price = Number.parseFloat(
    quote.price ?? quote.amount ?? quote.total ?? 0
  );
  return {
    price: Number.isFinite(price) ? price : 0,
    priceUnit: quote.price_unit || quote.priceUnit || "per project",
    currency: quote.currency || "SAR",
    paymentRequired:
      quote.payment_required ?? quote.paymentRequired ?? false,
  };
}

function normalizeService(service = {}) {
  if (!service) return null;
  return {
    slug: service.slug,
    title: service.title,
    subtitle: service.subtitle,
    regionLabel: service.region?.name || "",
    governorateLabel: service.governorate?.name || "",
    price: Number.isFinite(Number(service.price))
      ? Math.round(Number(service.price))
      : service.price || "",
    priceUnit: service.price_unit || "",
    photo: {
      url: `${Image_URL}${service?.images?.[0]?.image_path}` || "/placeholder.svg",
      alt: service.title || "Service",
    },
  };
}

function normalizeActivity(activity = [], bookingId = "activity") {
  if (!Array.isArray(activity)) return [];
  return activity.map((item, index) => ({
    id: item.id || `${bookingId}-activity-${index}`,
    type: item.type || item.status || "update",
    actor: item.actor || item.triggered_by || "system",
    message: item.message || item.note || "",
    timestamp: item.timestamp || item.created_at || item.updated_at || null,
  }));
}

function normalizeBooking(rawBooking) {
  if (!rawBooking) return null;
  const bookingId =
    rawBooking.bookingId || rawBooking.booking_id || rawBooking.id;
  return {
    bookingId,
    status: rawBooking.status,
    booking_details: rawBooking.booking_details || null,
    service: normalizeService(rawBooking.service),
    quote: normalizeQuote(rawBooking.quote),
    schedule: normalizeSchedule(rawBooking.schedule),
    buyer: normalizeActor(rawBooking.buyer),
    provider: normalizeActor(rawBooking.provider),
    counterparty: normalizeActor(rawBooking.counterparty),
    buyerNote: rawBooking.buyer_note || rawBooking.buyerNote || "",
    providerNote: rawBooking.provider_note || rawBooking.providerNote || "",
    buyerMarkedCompleteAt:
      rawBooking.booking_details?.buyer_marked_complete_at ||
      null,
    providerMarkedCompleteAt:
      rawBooking.booking_details?.provider_marked_complete_at ||
      null,
    activity: normalizeActivity(
      rawBooking.activity || rawBooking.timeline || [],
      bookingId
    ),
    createdAt: rawBooking.created_at || rawBooking.createdAt || null,
    updatedAt: rawBooking.updated_at || rawBooking.updatedAt || null,
  };
}

function extractList(response) {
  if (!response) {
    return { bookings: [], pagination: null };
  }
  // Axios wraps responses in .data, backend returns { data: { bookings: [], pagination: {} } }
  const data = response?.data || response;
  const bookings = Array.isArray(data?.bookings) ? data.bookings : Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination || null;
  return { bookings, pagination };
}

function parseBookingResponse(response) {
  if (!response) return null;
  
  // Axios wraps responses in .data, backend may return { data: { booking: {...} } } or { data: {...} }
  const data = response?.data || response;
  
  // Check if response has empty data array
  if (Array.isArray(data) && data.length === 0) return null;
  if (Array.isArray(data?.data) && data.data.length === 0) return null;
  
  const booking = data?.booking || data;
  
  // Only normalize if we have a valid booking with at least an ID
  if (!booking || (!booking.id && !booking.booking_id && !booking.bookingId)) {
    return null;
  }
  
  const normalized = normalizeBooking(booking);
  
  // Double-check that normalized booking has required fields
  if (!normalized || !normalized.bookingId) {
    return null;
  }
  
  return normalized;
}

export const useServiceBookingsStore = create((set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  async fetchBuyerBookings(options = {}) {
    const { page = 1 } = options;
    set({ isLoading: true, error: null });
    try {
      const response = await serviceBookingsApi.getBuyerBookings({
        page,
      });
      const { bookings, pagination } = extractList(response);
      const normalized = bookings.map(normalizeBooking).filter(Boolean);
      set({
        buyerBookings: normalized,
        buyerPagination: {
          page: pagination?.page || page,
          pageSize: pagination?.page_size || pagination?.pageSize || 20,
          total: pagination?.total || normalized.length,
          lastPage: pagination?.last_page || pagination?.lastPage || 1,
        },
        isLoading: false,
      });
      return normalized;
    } catch (error) {
      set({
        error: error.message || "Unable to load bookings",
        isLoading: false,
      });
      return null;
    }
  },

  async fetchProviderBookings(options = {}) {
    const { page = 1 } = options;
    set({ isLoading: true, error: null });
    try {
      const response = await serviceBookingsApi.getProviderBookings({
        page,
      });
      const { bookings, pagination } = extractList(response);
      const normalized = bookings.map(normalizeBooking).filter(Boolean);
      set({
        providerBookings: normalized,
        providerPagination: {
          page: pagination?.page || page,
          pageSize: pagination?.page_size || pagination?.pageSize || 20,
          total: pagination?.total || normalized.length,
          lastPage: pagination?.last_page || pagination?.lastPage || 1,
        },
        isLoading: false,
      });
      return normalized;
    } catch (error) {
      set({
        error: error.message || "Unable to load provider bookings",
        isLoading: false,
      });
      return null;
    }
  },

  async bookService(formValues) {
    set({ error: null });
    const {
      serviceSlug,
      preferredTimeWindow,
      projectDetails,
      addressLine1,
      regionId,
      governorateId,
      budget,
      preferredDate,
      startTime,
      endTime,
    } = formValues;

    if (!serviceSlug) {
      throw new Error("Unable to identify this service.");
    }

    const address =
      addressLine1 
        ? {
            address: addressLine1,
            ...(regionId ? { region_id: regionId } : {}),
            ...(governorateId ? { governorate_id: governorateId } : {}),
          }
        : undefined;

    const timeWindow =
      preferredTimeWindow ||
      (startTime && endTime
        ? { start: startTime, end: endTime }
        : undefined);

    const numericBudget = Number.parseFloat(
      typeof budget === "string" ? budget.replace(/[^0-9.]/g, "") : budget
    );

    const payload = {
      service_slug: serviceSlug,
      buyer_note: projectDetails,
      preferred_date: preferredDate,
      ...(timeWindow ? { preferred_time_window: timeWindow } : {}),
      ...(address ? { address } : {}),
      ...(Number.isFinite(numericBudget) ? { budget: numericBudget } : {})
    };

    const response = await serviceBookingsApi.bookService(
      serviceSlug,
      payload
    );

    const bookingId =
      response?.data?.booking_id ||
      response?.booking_id ||
      response?.data?.bookingId ||
      response?.bookingId;

    let booking = parseBookingResponse(response);

    if ((!booking || !booking.bookingId) && bookingId) {
      const detail = await serviceBookingsApi.getBooking(bookingId);
      booking = parseBookingResponse(detail);
    }

    set((state) => ({
      buyerBookings: upsert(state.buyerBookings, booking),
    }));
    return booking;
  },

  async providerRespond(bookingId, responsePayload) {
    set({ error: null });
    try {
      const response = await serviceBookingsApi.providerRespond(
        bookingId,
        responsePayload
      );
      const booking = parseBookingResponse(response);
      
      // If we got a valid booking, update it; otherwise refetch
      if (booking && booking.bookingId) {
        set((state) => ({
          buyerBookings: upsert(state.buyerBookings, booking),
          providerBookings: upsert(state.providerBookings, booking),
        }));
        return booking;
      } else {
        // Refetch provider bookings to get updated data
        await get().fetchProviderBookings({ page: get().providerPagination.page });
        return null;
      }
    } catch (error) {
      set({ error: error.message || "Unable to respond to booking" });
      throw error;
    }
  },

  async buyerConfirm(bookingId, responsePayload) {
    set({ error: null });
    try {
      const response = await serviceBookingsApi.buyerConfirm(
        bookingId,
        responsePayload
      );
      const booking = parseBookingResponse(response);
      
      // If we got a valid booking, update it; otherwise refetch
      if (booking && booking.bookingId) {
        set((state) => ({
          buyerBookings: upsert(state.buyerBookings, booking),
          providerBookings: upsert(state.providerBookings, booking),
        }));
        return booking;
      } else {
        // Refetch buyer bookings to get updated data
        await get().fetchBuyerBookings({ page: get().buyerPagination.page });
        return null;
      }
    } catch (error) {
      set({ error: error.message || "Unable to confirm booking" });
      throw error;
    }
  },

  async markComplete(bookingId, payload) {
    set({ error: null });
    try {
      const response = await serviceBookingsApi.markComplete(bookingId, payload);
      const booking = parseBookingResponse(response);
      
      // Determine which list to refetch based on actor
      const isProvider = payload?.actor === "provider";
      
      // If we got a valid booking, update it; otherwise refetch
      if (booking && booking.bookingId) {
        set((state) => ({
          buyerBookings: upsert(state.buyerBookings, booking),
          providerBookings: upsert(state.providerBookings, booking),
        }));
        return booking;
      } else {
        // Refetch the appropriate list to get updated data
        if (isProvider) {
          await get().fetchProviderBookings({ page: get().providerPagination.page });
        } else {
          await get().fetchBuyerBookings({ page: get().buyerPagination.page });
        }
        return null;
      }
    } catch (error) {
      set({ error: error.message || "Unable to mark booking as complete" });
      throw error;
    }
  },

  async cancelBooking(bookingId, payload) {
    set({ error: null });
    try {
      const response = await serviceBookingsApi.buyerConfirm(bookingId, {
        action: "cancel",
        note: payload?.note,
      });
      const booking = parseBookingResponse(response);
      
      // If we got a valid booking, update it; otherwise refetch both lists
      if (booking && booking.bookingId) {
        set((state) => ({
          buyerBookings: upsert(state.buyerBookings, booking),
          providerBookings: upsert(state.providerBookings, booking),
        }));
        return booking;
      } else {
        // Refetch both lists to get updated data (cancellation affects both perspectives)
        await Promise.all([
          get().fetchBuyerBookings({ page: get().buyerPagination.page }),
          get().fetchProviderBookings({ page: get().providerPagination.page }),
        ]);
        return null;
      }
    } catch (error) {
      set({ error: error.message || "Unable to cancel booking" });
      throw error;
    }
  },
}));



