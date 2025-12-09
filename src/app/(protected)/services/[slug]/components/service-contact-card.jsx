import { Clock, MapPin, ShieldCheck, Star } from "lucide-react";

export default function ServiceContactCard({ service }) {
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
  const responseTime =
    service.responseTime || service.response_time || "Typically responds within a day";
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

  const info = [
    {
      icon: MapPin,
      label: "Based in",
      value: `${regionLabel}${areaLabel ? ` • ${areaLabel}` : ""}`,
    },
    {
      icon: Clock,
      label: "Response time",
      value: responseTime,
    },
    {
      icon: ShieldCheck,
      label: "Status",
      value: service.isVerified ? "Verified provider" : "Pending verification",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* <header className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Star className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Provider rating
          </p>
          {rating !== null ? (
            <p className="text-lg font-semibold text-slate-900">
              {rating.toFixed(1)}{" "}
              <span className="text-sm font-medium text-slate-500">
                ({reviews.toLocaleString("en-NZ")} reviews)
              </span>
            </p>
          ) : (
            <p className="text-sm font-medium text-slate-500">No reviews yet</p>
          )}
        </div>
      </header> */}

      <ul className="mt-4 space-y-3">
        {info.map((item) => (
          <li key={item.label} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3">
            <item.icon className="mt-1 h-5 w-5 text-blue-500" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="text-sm font-medium text-slate-900">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}


