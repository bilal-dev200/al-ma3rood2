"use client";

import { useEffect, useState } from "react";
import CreateServiceListingForm from "./CreateServiceListingForm";
import { categoriesApi } from "@/lib/api/category";
import { locationsApi } from "@/lib/api/location";
import { transformServiceCategories, transformRegionsResponse } from "@/lib/utils/serviceTransformers";
import { useServicesStore } from "@/lib/stores/servicesStore";
import { toast } from "react-toastify";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const setServiceMeta = useServicesStore((state) => state.setServiceMeta);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    (async () => {
      try {
        const [categoryTree, locationData] = await Promise.all([
          categoriesApi.getCategoryTree("services"),
          locationsApi.getAllLocations(),
        ]);
        if (!active) return;
        
        const formattedCategories = transformServiceCategories(
          categoryTree?.data ?? categoryTree?.categories ?? categoryTree ?? []
        ).filter((category) => category.id);
        const formattedRegions = transformRegionsResponse(locationData);
        
        const meta = {
          categories: formattedCategories,
          regions: formattedRegions,
          isLoading: false,
        };
        setServiceMeta(meta);
        setIsLoading(false);
      } catch (error) {
        if (!active) return;
        const errorMeta = { categories: [], regions: [], isLoading: false };
        setServiceMeta(errorMeta);
        setIsLoading(false);
        toast.error(
          error?.message || "Unable to load service categories right now."
        );
      }
    })();
    
    return () => {
      active = false;
    };
  }, [setServiceMeta]);

  return (
    <main className="bg-white min-h-screen">
      <section className="relative overflow-hidden rounded-b-[48px] bg-gradient-to-br from-blue-600 via-blue-500 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18)_0%,_rgba(15,30,58,0)_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            List your expertise
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
            Create a Ma3rood service listing in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
            Share your skills, add availability, and reach ready-to-book
            customers. Update quotes, manage leads, and promote your business
            from one dashboard.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
            Loading service form…
          </div>
        ) : (
          <CreateServiceListingForm />
        )}
      </section>
    </main>
  );
}


