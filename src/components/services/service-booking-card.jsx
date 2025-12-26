"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User2,
  Mail,
  Phone,
  X,
  SaudiRiyal,
  MessageSquare,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "TBC";
  return new Date(date).toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatCurrency(amount, currency = "SAR") {
  if (!amount || !Number.isFinite(Number.parseFloat(amount))) return "TBC";
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function statusBadge(status) {
  const mapping = {
    "pending-provider-confirmation":
      "bg-amber-100 text-amber-700 border-amber-200",
    "pending-buyer-confirmation":
      "bg-amber-100 text-amber-700 border-amber-200",
    "provider-confirmed": "bg-blue-100 text-blue-700 border-blue-200",
    "buyer-confirmed": "bg-blue-100 text-blue-700 border-blue-200",
    "in-progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "awaiting-counterparty-confirmation":
      "bg-slate-100 text-slate-700 border-slate-200",
    "cancelled-by-provider": "bg-rose-100 text-rose-700 border-rose-200",
    "cancelled-by-buyer": "bg-rose-100 text-rose-700 border-rose-200",
  };
  return mapping[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function ServiceBookingCard({
  booking,
  perspective = "buyer",
  actions = [],
}) {
  const [showContactModal, setShowContactModal] = useState(false);

  if (!booking) return null;

  const service = booking.service || {
    slug: "",
    title: "Service",
    subtitle: "",
    regionLabel: "",
    areaLabel: "",
    photo: { url: "/placeholder.svg", alt: "Service" },
  };
  const counterpart =
    perspective === "buyer" ? booking.provider : booking.buyer;
  const allActivities = (booking.activity || []).slice().reverse() || [];
  const scheduleDate = booking.schedule?.date
    ? formatDate(booking.schedule.date)
    : "To be confirmed";
  const startTime = booking.schedule?.startTime || "TBC";
  const endTime = booking.schedule?.endTime || "TBC";
  const statusLabel = booking.status
    ? booking.status.replace(/-/g, " ")
    : "pending";
  const buyerNote = booking.buyerNote || booking.buyer_note || "";
  const quotePrice = booking.quote?.price || "N/A";
  const quoteCurrency = booking.quote?.currency || "SAR";
  const quotePriceUnit =
    booking.quote?.priceUnit || booking.quote?.price_unit || "";
  const askingPrice = booking.service?.price || "N/A";
  const askingPriceUnit = booking.service?.priceUnit || "";

  console.log("aaaaaa booking", booking);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
        <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-40">
          <Image
            src={service.photo?.url || "/placeholder.svg"}
            alt={service.photo?.alt || service.title}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Booking #{booking.bookingId}
              </p>
              <Link
                href={service.slug ? `/services/${service.slug}` : "/services"}
                className="text-xl font-semibold text-slate-900 hover:text-blue-600"
              >
                {service.title}
              </Link>
              <p className="text-sm text-slate-500">{service.subtitle}</p>
            </div>

            <span
              className={`inline-flex h-8 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-wide ${statusBadge(
                booking.status
              )}`}
            >
              {statusLabel}
            </span>
          </header>

          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Scheduled for
                </dt>
                <dd className="font-medium text-slate-900">{scheduleDate}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Time window
                </dt>
                <dd className="font-medium text-slate-900">
                  {startTime} – {endTime}
                </dd>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Region
                </dt>
                <dd className="font-medium text-slate-900">
                  {service.regionLabel}
                  {service.areaLabel ? ` • ${service.areaLabel}` : ""}
                </dd>
              </div>
            </div> */}
            {/* {quotePrice !== undefined && quotePrice !== null && (
              <div className="flex items-center gap-2">
                <SaudiRiyal className="h-4 w-4 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    Quoted price - Asking Price
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {quotePrice} - {askingPrice}
                  </dd>
                </div>
              </div>
            )} */}
            <div className="flex items-center gap-2">
              <User2 className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {perspective === "buyer" ? "Provider" : "Buyer"}
                </dt>
                <dd>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="font-medium text-blue-600 underline cursor-pointer"
                    // className="font-medium text-slate-900 hover:text-blue-600 hover:underline"
                  >
                    {counterpart?.name || "N/A"}
                  </button>
                </dd>
              </div>
            </div>
          </dl>

          {buyerNote && (
            <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Buyer's note
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                {buyerNote}
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Activity timeline
            </p>
            <div className="activity-timeline-container mt-2 max-h-24 overflow-y-auto pr-2">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .activity-timeline-container::-webkit-scrollbar {
                    width: 8px;
                  }
                  .activity-timeline-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                  }
                  .activity-timeline-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                  }
                  .activity-timeline-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                  }
                  .activity-timeline-container {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                  }
                `,
                }}
              />
              <ul className="space-y-2 text-sm text-slate-600">
                {allActivities.length === 0 ? (
                  <li className="text-slate-500">No activity yet.</li>
                ) : (
                  allActivities.map((item) => (
                    <li key={item.id} className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {item.message}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(item.timestamp)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {!!actions.length && (
        <footer className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 sm:px-6">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`inline-flex flex-1 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                action.variant === "secondary"
                  ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              } ${action.disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {action.label}
            </button>
          ))}
        </footer>
      )}

      {showContactModal && counterpart && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowContactModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {perspective === "buyer" ? "Provider" : "Buyer"} contact details
              </h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {counterpart.profile_photo || counterpart.avatar ? (
                <div className="flex justify-center">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">
                    <Image
                      src={counterpart.profile_photo || counterpart.avatar}
                      alt={counterpart.name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <User2 className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {counterpart.name || "N/A"}
                    </p>
                  </div>
                </div>

                {counterpart.email && (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </p>
                      <a
                        href={`mailto:${counterpart.email}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {counterpart.email}
                      </a>
                    </div>
                  </div>
                )}

                {counterpart.phone && (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Phone
                      </p>
                      <a
                        href={`tel:${counterpart.phone}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {counterpart.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Region
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {perspective === "provider"
                        ? booking?.booking_details?.region_name || "N/A"
                        : service.regionLabel || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items5-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Governorate
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {perspective === "provider"
                        ? booking?.booking_details?.governorate_name || "N/A"
                        : service.governorateLabel || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items5-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Address
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {perspective === "provider"
                        ? booking?.booking_details?.address || "N/A"
                        : service.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
