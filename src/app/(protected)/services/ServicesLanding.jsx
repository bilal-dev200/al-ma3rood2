"use client";

import { Suspense, useEffect } from "react";
import HeroSection from "./components/hero-section";
import FeaturedHighlights from "./components/featured-highlights";
import ServicesBrowser from "./ServicesBrowser";
import ServicesResultsSkeleton from "./components/results-skeleton";
import { useServicesStore } from "@/lib/stores/servicesStore";

export default function ServicesLanding({
  categories: initialCategories,
  regions: initialRegions,
  featuredProviders,
  initialListings,
  priceBounds,
  initialFilters,
  popularTags,
}) {
  const setServiceMeta = useServicesStore((state) => state.setServiceMeta);
  
  // Store categories/regions in Zustand when component mounts
  // Categories and regions are already transformed from the server component
  useEffect(() => {
    setServiceMeta({
      categories: Array.isArray(initialCategories) ? initialCategories : [],
      regions: Array.isArray(initialRegions) ? initialRegions : [],
      isLoading: false,
    });
  }, [initialCategories, initialRegions, setServiceMeta]);

  return (
    <div className="w-full">
      <HeroSection categories={initialCategories} popularTags={popularTags} />
      {/* <FeaturedHighlights featuredProviders={featuredProviders} /> */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-0 md:-mt-30">
        <Suspense fallback={<ServicesResultsSkeleton />}>
          <ServicesBrowser
            initialListings={initialListings}
            priceBounds={priceBounds}
            initialFilters={initialFilters}
          />
        </Suspense>
      </section>
    </div>
  );
}


