"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

/* =========================
   HELPERS
========================= */

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const formatDay = (day) =>
  day.charAt(0).toUpperCase() + day.slice(1);

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/* =========================
   COMPONENT
========================= */

export default function ServiceOverview({ service }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
console.log("service in overview", service);
  function handleBookServiceClick(e) {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  }

  function handleLoginClick() {
    setShowLoginModal(false);
    router.push("/login");
  }

  const priceValue = Number.isFinite(Number.parseFloat(service.price))
    ? Number.parseFloat(service.price)
    : Number.isFinite(Number.parseFloat(service.price_amount))
    ? Number.parseFloat(service.price_amount)
    : 0;

  const tags = service.tags || service.features || [];
  const badges = service.badges || service.achievements || [];

  const highlights = [
    {
      title: "Average response time",
      value:
        service.responseTime ||
        service.response_time ||
        "Usually responds within a day",
    },
    {
      title: "Next availability",
      value:
        service.nextAvailability ||
        service.next_availability ||
        "Availability on request",
    },
    {
      title: "Experience",
      value: service.experience || "Newly listed provider",
    },
  ];

  const priceUnit = service.priceUnit || service.price_unit || "per project";

  return (
    <article className="space-y-8">
      {/* =========================
          TOP CARD
      ========================= */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div />
          <a
            href="#service-booking"
            onClick={handleBookServiceClick}
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Book this service
          </a>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.title}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          DESCRIPTION
      ========================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          About this service
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
          {service.description}
        </p>
      </section>

      {/* =========================
          AVAILABILITY SCHEDULE
      ========================= */}
      {Array.isArray(service.schedule) && service.schedule.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Availability
          </h3>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {DAYS.map((day, index) => {
              const daySchedule = service.schedule.find(
                (s) => s.day === day
              );

              return (
                <div
                  key={day}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${
                    index !== DAYS.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">
                    {formatDay(day)}
                  </span>

                  {daySchedule ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {formatTime(daySchedule.from)} –{" "}
                      {formatTime(daySchedule.to)}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      Closed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================
          TAGS
      ========================= */}
      {!!tags.length && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            What&apos;s included
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {tag}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* =========================
          BADGES
      ========================= */}
      {!!badges.length && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Credentials
          </h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"
              >
                {badge}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* =========================
          LOGIN MODAL
      ========================= */}
      {showLoginModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Login required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600">
                Please log in to book this service.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLoginClick}
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
