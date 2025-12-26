"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Image_URL } from "@/config/constants";

function formatPrice(value) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function MyServiceCard({ service, onDelete }) {
    console.log('serviceeee in MyServiceCard', service);
  const serviceId = service.id || service.service_id;
  const title = service.title || service.name || "Untitled Service";
  const subtitle = service.subtitle || service.summary || service.description || "";
  const priceValue = Number.isFinite(Number.parseFloat(service.price))
    ? Number.parseFloat(service.price)
    : Number.isFinite(Number.parseFloat(service.price_amount))
    ? Number.parseFloat(service.price_amount)
    : 0;
  const priceUnit = service.priceUnit || service.price_unit || "per project";
  const regionLabel = service.region?.name || service.region_name || service.region || "";
  const areaLabel = service.area || service.governorate?.name || service.governorate_name || "";
  const responseTime = service.responseTime || service.response_time || "Response time varies";
  const nextAvailability = service.nextAvailability || service.next_availability || "";
  const categoryLabel = service.category_name || service.subcategory_name || service.category?.name || "";

  // Get image URL
  const imagePath = service.images?.[0]?.image_path || service.image_path;
  const imageUrl =
    service.photo?.url ||
    (imagePath && Image_URL ? `${Image_URL}${imagePath}` : "/placeholder.svg");

  const editHref = `/account/services/my-services/edit/${serviceId}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          {categoryLabel && (
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {categoryLabel}
            </p>
          )}
          <h3 className="mt-1 text-lg line-clamp-2 font-semibold text-slate-900">{title}</h3>
        </div>

        {subtitle && (
          <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
            {subtitle}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {(regionLabel || areaLabel) && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {areaLabel ? `${areaLabel}, ` : ""}
              {regionLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {responseTime}
          </span>
          {nextAvailability && (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {nextAvailability}
            </span>
          )}
        </div>

        {/* Price */}
        {/* <div className="mt-auto">
          <p className="text-xs text-slate-500">From</p>
          <p className="text-lg font-semibold text-slate-900">
            {formatPrice(priceValue)}
            <span className="text-xs font-medium text-slate-500">
              {" "}
              {priceUnit}
            </span>
          </p>
        </div> */}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <Link
            href={editHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Edit2 className="h-4 w-4" aria-hidden="true" />
            Edit Service
          </Link>
          <Link
            href={`/services/${service.slug || serviceId}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

