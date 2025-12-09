"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ServiceOverview({ service }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  function handleBookServiceClick(e) {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    // If user is logged in, let the default anchor behavior work (scroll to #service-booking)
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
      value: service.experience || service.experience_summary || "Newly listed provider",
    },
  ];
  const priceUnit = service.priceUnit || service.price_unit || "per project";

  console.log('serviceeee', service);

  return (
    <article className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm text-slate-500">Starting from</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(priceValue)}{" "}
              <span className="text-sm font-medium text-slate-500">
                {priceUnit}
              </span>
            </p>
          </div>
          <a
            href="#service-booking"
            onClick={handleBookServiceClick}
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Book this service
          </a>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-50 px-4 py-3">
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">About this service</h2>
        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
          {service.description}
        </p>
      </section>

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
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
                {tag}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!badges.length && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Credentials</h3>
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
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600">
                Please log in to book this service. You'll be able to access your
                booking history and manage your service requests.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
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


