import ServiceContactCard from "./service-contact-card";
import BookServiceForm from "./book-service-form";

export default function ServiceSidebar({ service }) {
  return (
    <aside className="space-y-6 lg:space-y-8">
      <ServiceContactCard service={service} />
      <BookServiceForm service={service} />
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Why book on Ma3rood?
        </h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            Compare vetted providers with verified reviews before you confirm.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            Save favourite services and manage quote requests in your dashboard.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            Get alerted when your shortlisted providers add new availability.
          </li>
        </ul>
      </section>
    </aside>
  );
}


