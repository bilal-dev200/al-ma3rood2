import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

function formatRating(rating, reviews) {
  return `${rating.toFixed(1)} (${reviews.toLocaleString("en-NZ")} reviews)`;
}

export default function ServiceHero({ service }) {
  const photo = service.photo || {};
  const photoUrl = photo.url || "/placeholder.svg";
  const regionLabel =
    service.regionLabel ||
    service.region ||
    service.region_label ||
    service.region_name ||
    "";
  const areaLabel =
    service.area ||
    service.governorate ||
    service.governorate_label ||
    service.governorate_name ||
    "";
  const ratingRaw =
    service.rating ?? service.average_rating ?? service.avg_rating;
  const parsedRating =
    ratingRaw !== undefined && ratingRaw !== null
      ? Number.parseFloat(ratingRaw)
      : null;
  const rating =
    parsedRating !== null && !Number.isNaN(parsedRating) ? parsedRating : null;
  const reviews =
    Number.parseInt(
      service.reviews ?? service.total_reviews ?? service.review_count ?? 0,
      10
    ) || 0;
  const experience = service.experience || service.experience_summary || "";
  const user = service.user?.name || "";
  const responseTime =
    service.responseTime || service.response_time || "";
  const subcategory =
    service.subcategory ||
    service.subcategory_name ||
    service.category_name ||
    service.category;
  const subtitle = service.subtitle || service.description;

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800/90 to-gray-900" />
        <Image
          src={photoUrl}
          alt={photo.alt || service.title}
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to services
            </Link>

            {service.isVerified && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Verified provider
              </span>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                {subcategory}
              </span>
              <p className="text-sm text-white/70">
                {regionLabel}
                {areaLabel ? `, ${areaLabel}` : ""}
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              {rating !== null && (
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {formatRating(rating, reviews)}
                </span>
              )}
              {user && (
                <>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-white/40 sm:block" />
                  <span>{user}</span>
                </>
              )}
              {experience && (
                <>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-white/40 sm:block" />
                  <span>{experience}</span>
                </>
              )}
              {responseTime ? (
                <>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-white/40 sm:block" />
                  <span>{responseTime}</span>
                </>
              ) : null}
            </div>

            <p className="max-w-2xl text-base sm:text-lg text-white/80">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


