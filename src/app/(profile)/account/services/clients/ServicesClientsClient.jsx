"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Clock, Calendar } from "lucide-react";
import { ServiceBookingCard } from "@/components/services/service-booking-card";
import { useServiceBookingsStore } from "@/lib/stores/serviceBookingsStore";

const suggestTimeSchema = z.object({
  date: z.string().min(1, "Select a date"),
  startTime: z.string().min(1, "Select start time"),
  endTime: z.string().min(1, "Select end time"),
  note: z.string().optional(),
});

export default function ServicesClientsClient() {
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const providerBookings = useServiceBookingsStore(
    (state) => state.providerBookings
  );
  const isLoading = useServiceBookingsStore((state) => state.isLoading);
  const error = useServiceBookingsStore((state) => state.error);
  const providerPagination = useServiceBookingsStore(
    (state) => state.providerPagination
  );
  const fetchProviderBookings = useServiceBookingsStore(
    (state) => state.fetchProviderBookings
  );
  const providerRespond = useServiceBookingsStore(
    (state) => state.providerRespond
  );
  const markComplete = useServiceBookingsStore((state) => state.markComplete);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(suggestTimeSchema),
  });

  useEffect(() => {
    fetchProviderBookings({ page: 1 });
  }, [fetchProviderBookings]);

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > providerPagination.lastPage ||
      nextPage === providerPagination.page
    ) {
      return;
    }
    fetchProviderBookings({ page: nextPage });
  }

  async function handleConfirm(booking) {
    try {
      await providerRespond(booking.bookingId, {
        action: "confirm",
        note: "Confirmed via dashboard.",
      });
      toast.success("Booking confirmed.");
    } catch (error) {
      toast.error(error?.message || "Unable to confirm booking.");
    }
  }

  async function handleDecline(booking) {
    try {
      await providerRespond(booking.bookingId, {
        action: "decline",
        note: "Declined via dashboard.",
      });
      toast.success("Booking declined.");
    } catch (error) {
      toast.error(error?.message || "Unable to decline booking.");
    }
  }

  function handleSuggest(booking) {
    setSelectedBooking(booking);
    reset({
      date: booking.schedule?.date || "",
      startTime: booking.schedule?.startTime || "09:00",
      endTime: booking.schedule?.endTime || "11:00",
      note: "",
    });
    setShowSuggestModal(true);
  }

  async function onSubmitSuggestTime(values) {
    if (!selectedBooking) return;

    try {
      await providerRespond(selectedBooking.bookingId, {
        action: "propose-new-slot",
        schedule: {
          date: values.date,
          start_time: values.startTime,
          end_time: values.endTime,
        },
        note: values.note || "Suggested a new slot.",
      });
      toast.success("New schedule proposed.");
      setShowSuggestModal(false);
      setSelectedBooking(null);
      reset();
    } catch (error) {
      console.log("aaaaaa error", error);
      toast.error(error?.message || "Unable to propose a new slot.");
    }
  }

  async function handleMarkDelivered(booking) {
    try {
      await markComplete(booking.bookingId, {
        actor: "provider",
        note: "Service delivered.",
      });
      toast.success("Marked as delivered.");
    } catch (error) {
      toast.error(error?.message || "Unable to update completion status.");
    }
  }

  async function handleCancel(booking) {
    try {
      await providerRespond(booking.bookingId, {
        action: "decline",
        note: "Cancelled due to conflict.",
      });
      toast.success("Booking cancelled.");
    } catch (error) {
      toast.error(error?.message || "Unable to cancel this booking.");
    }
  }

  function buildActions(booking) {
    const actions = [];

    if (booking.status === "pending-provider-confirmation") {
      actions.push(
        {
          label: "Confirm booking",
          onClick: () => handleConfirm(booking),
        },
        // {
        //   label: "Suggest new time",
        //   onClick: () => handleSuggest(booking),
        //   variant: "secondary",
        // },
        {
          label: "Decline",
          onClick: () => handleDecline(booking),
          variant: "secondary",
        }
      );
    } else if (
      [
        "in-progress",
        "awaiting-counterparty-confirmation",
      ].includes(booking.status)
    ) {
      if (!booking.providerMarkedCompleteAt) {
        actions.push({
          label: "Mark job delivered",
          onClick: () => handleMarkDelivered(booking),
        });
      }
      // Provider cannot cancel once booking is in-progress or they've confirmed
    } else if (
      booking.status === "provider-confirmed" ||
      booking.status === "buyer-confirmed"
    ) {
      if (!booking.providerMarkedCompleteAt) {
        actions.push({
          label: "Mark job delivered",
          onClick: () => handleMarkDelivered(booking),
        });
      }
      // Provider cannot cancel once they've confirmed
    }

    return actions;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Services
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Requests for my services
        </h1>
        <p className="text-sm text-slate-600">
          Review new requests, confirm timings, and keep clients updated as you
          work through your bookings.
        </p>
      </header>

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading your requests…</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {!isLoading && !providerBookings.length && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No service requests yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Publish or refresh your service listings to receive new bookings.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {providerBookings.map((booking) => (
          <ServiceBookingCard
            key={booking.bookingId}
            booking={booking}
            perspective="provider"
            actions={buildActions(booking)}
          />
        ))}
      </div>

      {providerPagination.lastPage > 1 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-600">
            Page {providerPagination.page} of {providerPagination.lastPage} ·{" "}
            {providerPagination.total} requests
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(providerPagination.page - 1)}
              disabled={providerPagination.page <= 1 || isLoading}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(providerPagination.page + 1)}
              disabled={
                providerPagination.page >= providerPagination.lastPage ||
                isLoading
              }
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showSuggestModal && selectedBooking && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => {
              setShowSuggestModal(false);
              setSelectedBooking(null);
              reset();
            }}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Suggest new time
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowSuggestModal(false);
                  setSelectedBooking(null);
                  reset();
                }}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitSuggestTime)}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-4 w-4" />
                  Preferred date
                </label>
                <input
                  {...register("date")}
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock className="h-4 w-4" />
                    Start time
                  </label>
                  <input
                    {...register("startTime")}
                    type="time"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock className="h-4 w-4" />
                    End time
                  </label>
                  <input
                    {...register("endTime")}
                    type="time"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Note (optional)
                </label>
                <textarea
                  {...register("note")}
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Add any additional details about the new schedule..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestModal(false);
                    setSelectedBooking(null);
                    reset();
                  }}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Suggest new time"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
