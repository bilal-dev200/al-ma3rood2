import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, ShieldCheck, Star } from "lucide-react";

function formatPrice(value) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function ServiceMeta({ listing }) {
  const regionLabel =
    listing.regionLabel?.name || "";
  const areaLabel =
    listing.area?.name || "";
  const responseTime =
    listing.responseTime || listing.response_time || "Response time varies";
  const nextAvailability =
    listing.nextAvailability || listing.next_availability || "";

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {areaLabel ? `${areaLabel}, ` : ""}
        {regionLabel}
      </span>
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
  );
}

export default function ServiceCard({ listing, viewMode = "grid" }) {
  const slug = listing.slug || listing.id || listing.service_slug;
  const href = `/services/${slug}`;
  const isGrid = viewMode === "grid";
  const subtitle = listing.subtitle || listing.summary || listing.description;
  const priceUnit = listing.priceUnit || listing.price_unit || "per project";
  const ratingRaw =
    listing.rating ?? listing.average_rating ?? listing.avg_rating;
  const parsedRating =
    ratingRaw !== undefined && ratingRaw !== null
      ? Number.parseFloat(ratingRaw)
      : null;
  const rating =
    parsedRating !== null && !Number.isNaN(parsedRating) ? parsedRating : null;
  const reviews =
    Number.parseInt(
      listing.reviews ?? listing.total_reviews ?? listing.review_count ?? 0,
      10
    ) || 0;
  const tags = listing.tags || listing.features || [];
  const badges = listing.badges || listing.achievements || [];
  const subcategoryLabel =
    listing.subcategory ||
    listing.subcategory_name ||
    listing.category_name ||
    listing.category?.name ||
    listing.category;
  const photo = listing.photo || {};
  const imageUrl = photo.url || "/placeholder.svg";
  const imageAlt = photo.alt || listing.title;
  const isVerified = Boolean(
    listing.isVerified ?? listing.is_verified ?? false
  );
  const priceValue = Number.isFinite(Number.parseFloat(listing.price))
    ? Number.parseFloat(listing.price)
    : Number.isFinite(Number.parseFloat(listing.price_amount))
    ? Number.parseFloat(listing.price_amount)
    : 0;

  return (
    <Link
      href={href}
      className={`group relative flex overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        isGrid ? "flex-col" : "flex-col sm:flex-row"
      }`}
    >
      <div
        className={`relative ${
          isGrid
            ? "h-48 w-full"
            : "h-48 w-full sm:h-auto sm:min-h-[200px] sm:w-64"
        }`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={
            isGrid
              ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 100vw"
          }
        />
        {isVerified && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-medium text-white shadow">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>

      <div
        className={`flex flex-1 flex-col gap-4 p-5 ${
          isGrid ? "" : "sm:p-6"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {subcategoryLabel}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2 h-14">
              {listing.title}
            </h3>
          </div>
          {rating !== null && (
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
              {rating.toFixed(1)}
              <span className="text-[11px] font-normal text-amber-500/80">
                ({reviews})
              </span>
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 h-12">
          {subtitle}
        </p>

        <ServiceMeta listing={listing} />

        <div className="flex flex-wrap items-center gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            {/* <p className="text-xs text-slate-500">From</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatPrice(priceValue)}
              <span className="text-xs font-medium text-slate-500">
                {" "}
                {priceUnit}
              </span>
            </p> */}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
            View details
            <span aria-hidden="true" className="transition group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}


