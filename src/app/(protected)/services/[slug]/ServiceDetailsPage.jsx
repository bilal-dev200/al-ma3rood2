import ServiceHero from "./components/service-hero";
import ServiceOverview from "./components/service-overview";
import ServiceSidebar from "./components/service-sidebar";
import RelatedServices from "./components/related-services";

export default function ServiceDetailsPage({ service, relatedServices }) {
  return (
    <>
      <ServiceHero service={service} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <ServiceOverview service={service} />
          <ServiceSidebar service={service} />
        </div>
        <RelatedServices relatedServices={relatedServices} />
      </section>
    </>
  );
}


