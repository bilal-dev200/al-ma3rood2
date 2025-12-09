import { getServiceBySlug } from "./data";

const CURRENT_USER = {
  id: "user-0001",
  name: "Hala Al Rashid",
  email: "hala.alrashid@example.com",
  phone: "+966500000000",
};

const CURRENT_PROVIDER = {
  id: "user-0001",
  name: "Ma3rood Services",
  email: "support@ma3rood.com",
  phone: "+966511111111",
};

let bookingSequence = 0;
let serviceBookings = [];

function clone(payload) {
  if (typeof structuredClone === "function") {
    return structuredClone(payload);
  }
  return JSON.parse(JSON.stringify(payload));
}

function buildServiceSnapshot(service, fallback = {}) {
  if (!service) {
    return {
      slug: fallback.slug,
      title: fallback.title || "Service",
      subtitle: fallback.subtitle || "",
      price: fallback.price || 0,
      priceUnit: fallback.priceUnit || "per project",
      regionLabel: fallback.regionLabel || "",
      areaLabel: fallback.areaLabel || "",
      photo: fallback.photo || { url: "/placeholder.svg", alt: fallback.title || "Service" },
    };
  }

  const regionLabel =
    service.regionLabel ||
    service.region_label ||
    service.region ||
    "";
  const areaLabel =
    service.area ||
    service.governorate ||
    service.governorate_label ||
    "";

  return {
    slug: service.slug,
    title: service.title,
    subtitle: service.subtitle,
    price: service.price,
    priceUnit: service.priceUnit || service.price_unit || "per project",
    regionLabel,
    areaLabel,
    photo: service.photo || { url: "/placeholder.svg", alt: service.title },
  };
}

function createTimelineEntry({ type, actor, message }) {
  return {
    id: `${type}-${Date.now()}`,
    type,
    actor,
    message,
    timestamp: new Date().toISOString(),
  };
}

async function buildSeedBooking({
  slug,
  status = "pending-provider-confirmation",
  buyer = CURRENT_USER,
  provider = CURRENT_PROVIDER,
  schedule,
  activity = [],
  buyerMarkedCompleteAt = null,
  providerMarkedCompleteAt = null,
}) {
  const service = await getServiceBySlug(slug);
  bookingSequence += 1;
  return {
    bookingId: `svc-book-${bookingSequence.toString().padStart(4, "0")}`,
    service: buildServiceSnapshot(service, { slug }),
    status,
    schedule: schedule || {
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "11:00",
    },
    quote: {
      price: service?.price || 0,
      priceUnit: service?.priceUnit || service?.price_unit || "per project",
      currency: "SAR",
      paymentRequired: true,
    },
    buyer,
    provider,
    buyerNote: "Looking forward to the service.",
    providerNote: "",
    buyerMarkedCompleteAt,
    providerMarkedCompleteAt,
    activity: activity.length
      ? activity
      : [
          createTimelineEntry({
            type: "booking_created",
            actor: "buyer",
            message: `${buyer.name} booked ${service?.title || "the service"}.`,
          }),
        ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function ensureSeeded() {
  if (serviceBookings.length) return;

  const bookingA = await buildSeedBooking({
    slug: "premium-home-cleaning-organisation",
    status: "provider-confirmed",
    activity: [
      createTimelineEntry({
        type: "booking_created",
        actor: "buyer",
        message: "Hala requested a Friday morning slot.",
      }),
      createTimelineEntry({
        type: "provider_confirmed",
        actor: "provider",
        message: "Provider confirmed the session.",
      }),
    ],
  });

  const bookingB = await buildSeedBooking({
    slug: "licensed-electrician-smart-home",
    status: "in-progress",
    buyer: {
      id: "user-0450",
      name: "Omar Altayeb",
      email: "omar@example.com",
      phone: "+966522222222",
    },
    provider: CURRENT_PROVIDER,
    activity: [
      createTimelineEntry({
        type: "booking_created",
        actor: "buyer",
        message: "Omar booked an electrical inspection.",
      }),
      createTimelineEntry({
        type: "provider_confirmed",
        actor: "provider",
        message: "You confirmed the visit.",
      }),
      createTimelineEntry({
        type: "buyer_confirmed",
        actor: "buyer",
        message: "Omar approved the quote.",
      }),
    ],
  });
  serviceBookings = [bookingB, bookingA];
}

function mutateBooking(bookingId, updater) {
  const index = serviceBookings.findIndex((item) => item.bookingId === bookingId);
  if (index === -1) {
    throw new Error("Booking not found");
  }
  const current = serviceBookings[index];
  const updated = updater({ ...current });
  serviceBookings[index] = {
    ...updated,
    updatedAt: new Date().toISOString(),
  };
  return serviceBookings[index];
}

export const mockServiceBookingsApi = {
  async createBooking(payload) {
    await ensureSeeded();
    const service = await getServiceBySlug(payload.serviceSlug);
    const bookingId = `svc-book-${(bookingSequence += 1)
      .toString()
      .padStart(4, "0")}`;
    const booking = {
      bookingId,
      service: buildServiceSnapshot(service, {
        slug: payload.serviceSlug,
        title: payload.serviceTitle,
      }),
      status: "pending-provider-confirmation",
      schedule: {
        date: payload.preferredDate || new Date().toISOString().slice(0, 10),
        startTime: payload.preferredTimeWindow?.start || "09:00",
        endTime: payload.preferredTimeWindow?.end || "11:00",
      },
      quote: {
        price: payload.budget
          ? Number.parseFloat(payload.budget)
          : service?.price || 0,
        priceUnit: service?.priceUnit || service?.price_unit || "per project",
        currency: "SAR",
        paymentRequired: true,
      },
      buyer: {
        id: CURRENT_USER.id,
        name: payload.fullName || CURRENT_USER.name,
        email: payload.email || CURRENT_USER.email,
        phone: payload.phone || CURRENT_USER.phone,
      },
      provider: {
        id: service?.providerId || `provider-${service?.slug || "unknown"}`,
        name: service?.title ? `${service.title} Team` : "Provider",
        email: "provider@example.com",
        phone: "+966533333333",
      },
      buyerNote: payload.projectDetails || payload.buyerNote || "",
      providerNote: "",
      buyerMarkedCompleteAt: null,
      providerMarkedCompleteAt: null,
      activity: [
        createTimelineEntry({
          type: "booking_created",
          actor: "buyer",
          message: `${payload.fullName || "Buyer"} requested ${
            service?.title || "this service"
          }.`,
        }),
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    serviceBookings.unshift(booking);
    return clone(booking);
  },

  async listBuyerBookings() {
    await ensureSeeded();
    const bookings = serviceBookings.filter(
    (booking) => booking.buyer.id === CURRENT_USER.id
    );
    return clone(bookings);
  },

  async listProviderBookings() {
    await ensureSeeded();
    const bookings = serviceBookings.filter(
      (booking) => booking.provider.id === CURRENT_PROVIDER.id
    );
    return clone(bookings);
  },

  async getBooking(bookingId) {
    await ensureSeeded();
    const booking = serviceBookings.find((item) => item.bookingId === bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return clone(booking);
  },

  async providerRespond(bookingId, { action, note, schedule }) {
    await ensureSeeded();
    const booking = mutateBooking(bookingId, (current) => {
      if (action === "confirm") {
        current.status = "provider-confirmed";
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "provider_confirmed",
            actor: "provider",
            message: note || "Provider confirmed the booking.",
          }),
        ];
      } else if (action === "decline") {
        current.status = "cancelled-by-provider";
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "provider_declined",
            actor: "provider",
            message: note || "Provider declined the booking.",
          }),
        ];
      } else if (action === "propose-new-slot" && schedule) {
        current.status = "pending-buyer-confirmation";
        current.schedule = {
          date: schedule.date || current.schedule.date,
          startTime: schedule.start_time || schedule.startTime || current.schedule.startTime,
          endTime: schedule.end_time || schedule.endTime || current.schedule.endTime,
        };
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "provider_proposed",
            actor: "provider",
            message:
              note ||
              "Provider proposed a new schedule.",
          }),
        ];
      }
      current.providerNote = note || current.providerNote;
      return current;
    });
    return clone(booking);
  },

  async buyerConfirm(bookingId, { action, note }) {
    await ensureSeeded();
    const booking = mutateBooking(bookingId, (current) => {
      if (action === "confirm") {
        current.status =
          current.status === "in-progress" ? "in-progress" : "buyer-confirmed";
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "buyer_confirmed",
            actor: "buyer",
            message: note || "Buyer confirmed the proposed plan.",
          }),
        ];
      } else if (action === "cancel") {
        current.status = "cancelled-by-buyer";
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "buyer_cancelled",
            actor: "buyer",
            message: note || "Buyer cancelled the booking.",
          }),
        ];
      }
      current.buyerNote = note || current.buyerNote;
      return current;
    });
    return clone(booking);
  },

  async markComplete(bookingId, { actor, note }) {
    await ensureSeeded();
    const booking = mutateBooking(bookingId, (current) => {
      const timestamp = new Date().toISOString();
      if (actor === "buyer") {
        current.buyerMarkedCompleteAt = timestamp;
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "buyer_marked_complete",
            actor: "buyer",
            message: note || "Buyer marked the service as completed.",
          }),
        ];
      } else {
        current.providerMarkedCompleteAt = timestamp;
        current.activity = [
          ...current.activity,
          createTimelineEntry({
            type: "provider_marked_complete",
            actor: "provider",
            message: note || "Provider marked the service as completed.",
          }),
        ];
      }

      if (current.buyerMarkedCompleteAt && current.providerMarkedCompleteAt) {
        current.status = "completed";
      } else {
        current.status = "awaiting-counterparty-confirmation";
      }

      return current;
    });
    return clone(booking);
  },

  async cancelBooking(bookingId, { actor, note }) {
    await ensureSeeded();
    const booking = mutateBooking(bookingId, (current) => {
      current.status = actor === "buyer" ? "cancelled-by-buyer" : "cancelled-by-provider";
      current.activity = [
        ...current.activity,
        createTimelineEntry({
          type: "booking_cancelled",
          actor,
          message: note || (actor === "buyer" ? "Buyer cancelled the booking." : "Provider cancelled the booking."),
        }),
      ];
      return current;
    });
    return clone(booking);
  },
};


