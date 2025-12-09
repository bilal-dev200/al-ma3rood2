import Image from "next/image";
import Link from "next/link";

export default function FeaturedHighlights({ featuredProviders = [] }) {
  if (!featuredProviders.length) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Featured this week
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Curated services with consistent five-star reviews and fast response
            times.
          </p>
        </div>
        <Link
          href="/services?sortBy=rating"
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Browse all services
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {featuredProviders.map((provider) => (
          <article
            key={provider.id}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={provider.image.url}
                alt={provider.image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            <div className="flex h-full flex-col gap-3 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {provider.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {provider.description}
              </p>
              <div className="mt-auto">
                <Link
                  href={provider.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {provider.ctaLabel}
                  <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


