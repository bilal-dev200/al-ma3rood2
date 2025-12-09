import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import Link from "next/link";

export default function HeroSection({ categories = [], popularTags = [] }) {
  const primaryCategories = categories.slice(0, 4);

  return (
    <section
      className=" overflow-hidden rounded-b-[64px] bg-slate-900 text-white"
      style={{
        background: "#175f48",
        // background:
        //   "radial-gradient(circle at top left, #4aa6ff 0%, #1f4e96 55%, #0f1e3a 100%)",
      }}
    >
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Services" }]}
        styles={{
          nav: "flex justify-start px-10 pt-4 text-sm font-medium",
        }}
      />
      <div className="mt-3 border-b border-white opacity-40 mx-8"></div>

      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18)_0%,_rgba(15,30,58,0)_60%)]" /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-6 md:min-h-52">
          {/* <p className="text-xs uppercase tracking-[0.4em] text-blue-100/80">
            Trusted services marketplace
          </p> */}
          <h1 className="text-3xl leading-tight">
            Book trusted experts for every job, <br /> from tradies to tech.
          </h1>
          {/* <p className="text-base sm:text-lg text-blue-50/90">
            Compare verified reviews, secure quotes, and manage bookings in one
            dashboard. Services tailored to New Zealand households and growing
            businesses.
          </p> */}
          {/* <Link
            href="/services?sortBy=rating"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Explore top providers
          </Link> */}
          {/* <div className="flex flex-wrap gap-3 pt-2">
            {primaryCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-white/50"
              >
                <span className="h-2 w-2 rounded-full bg-white/70" />
                {category.label}
              </Link>
            ))}
          </div> */}
        </div>

        {/* {popularTags.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-100/70">
              Trending searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/services?query=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </section>
  );
}
