"use client";

import { useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { ServiceBookingCard } from "@/components/services/service-booking-card";
import { useServiceBookingsStore } from "@/lib/stores/serviceBookingsStore";

export default function ServicesBookingsClient() {
  const buyerBookings = useServiceBookingsStore((state) => state.buyerBookings);
  const isLoading = useServiceBookingsStore((state) => state.isLoading);
  const error = useServiceBookingsStore((state) => state.error);
  const buyerPagination = useServiceBookingsStore(
    (state) => state.buyerPagination
  );
  const fetchBuyerBookings = useServiceBookingsStore(
    (state) => state.fetchBuyerBookings
  );
  const cancelBooking = useServiceBookingsStore(
    (state) => state.cancelBooking
  );
  const markComplete = useServiceBookingsStore((state) => state.markComplete);
  const buyerConfirm = useServiceBookingsStore((state) => state.buyerConfirm);

  useEffect(() => {
    fetchBuyerBookings({ page: 1 });
  }, [fetchBuyerBookings]);

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > buyerPagination.lastPage ||
      nextPage === buyerPagination.page
    ) {
      return;
    }
    fetchBuyerBookings({ page: nextPage });
  }

  async function handleCancel(booking) {
    try {
      await cancelBooking(booking.bookingId, {
        note: "Cancelled from dashboard",
      });
      toast.success("Booking cancelled.");
    } catch (error) {
      toast.error(error?.message || "Unable to cancel booking right now.");
    }
  }

  async function handleMarkComplete(booking) {
    try {
      await markComplete(booking.bookingId, {
        actor: "buyer",
        note: "Service completed successfully.",
      });
      toast.success("Marked as completed.");
    } catch (error) {
      toast.error(error?.message || "Unable to update completion status.");
    }
  }

  async function handleConfirm(booking) {
    try {
      await buyerConfirm(booking.bookingId, {
        action: "confirm",
        note: "Schedule confirmed.",
      });
      toast.success("Schedule confirmed.");
    } catch (error) {
      toast.error(error?.message || "Unable to confirm schedule.");
    }
  }

  function buildActions(booking) {
    const actions = [];
    // Buyer can cancel if status allows cancellation AND buyer hasn't confirmed yet
    if (
      [
        "pending-provider-confirmation",
        "provider-confirmed",
        "pending-buyer-confirmation",
      ].includes(booking.status) &&
      booking.status !== "buyer-confirmed" &&
      !(Array.isArray(booking.activity) && booking.activity.some(a => a.type === "marked_complete" && a.actor === "buyer"))
    ) {
      actions.push({
        label: "Cancel booking",
        variant: "secondary",
        onClick: () => handleCancel(booking),
      });
    }

    if (booking.status === "pending-buyer-confirmation") {
      actions.unshift({
        label: "Confirm schedule",
        onClick: () => handleConfirm(booking),
      });
    }

    if (
      ["in-progress", "awaiting-counterparty-confirmation"].includes(
        booking.status
      ) &&
      !booking.buyerMarkedCompleteAt
    ) {
      actions.unshift({
        label: "Mark service received",
        onClick: () => handleMarkComplete(booking),
      });
    }

    if (
      ["provider-confirmed", "buyer-confirmed"].includes(
        booking.status
      ) &&
      !booking.buyerMarkedCompleteAt
    ) {
      actions.unshift({
        label: "Mark service received",
        onClick: () => handleMarkComplete(booking),
      });
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
          My booked services
        </h1>
        <p className="text-sm text-slate-600">
          Manage confirmations, reschedules, and completion right here. Need to
          offer services?{" "}
          <Link href="/listing" className="text-blue-600 underline">
            Create a service listing
          </Link>
          .
        </p>
      </header>

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading your bookings…</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {!isLoading && !buyerBookings.length && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            You haven’t booked any services yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse vetted providers and lock your next service in minutes.
          </p>
          <Link
            href="/services"
            className="mt-4 inline-flex items-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white"
          >
            Browse services
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {buyerBookings.map((booking) => (
          <ServiceBookingCard
            key={booking.bookingId}
            booking={booking}
            perspective="buyer"
            actions={buildActions(booking)}
          />
        ))}
      </div>

      {buyerPagination.lastPage > 1 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-600">
            Page {buyerPagination.page} of {buyerPagination.lastPage} ·{" "}
            {buyerPagination.total} bookings
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(buyerPagination.page - 1)}
              disabled={buyerPagination.page <= 1 || isLoading}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(buyerPagination.page + 1)}
              disabled={
                buyerPagination.page >= buyerPagination.lastPage || isLoading
              }
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm	font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


