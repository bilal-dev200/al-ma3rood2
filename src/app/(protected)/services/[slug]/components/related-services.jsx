import ServiceCard from "../../components/service-card";

export default function RelatedServices({ relatedServices = [] }) {
  if (!relatedServices.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Similar services you might like
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Compare providers with matching expertise and availability.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {relatedServices.map((item) => (
          <ServiceCard key={item.slug} listing={item} viewMode="grid" />
        ))}
      </div>
    </section>
  );
}


