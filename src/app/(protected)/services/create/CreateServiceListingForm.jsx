"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { servicesApi } from "@/lib/api/services";
import SearchableDropdown from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdown";
import { useServicesStore } from "@/lib/stores/servicesStore";
import AvailabilitySchedule from "@/components/WebsiteComponents/listingforms/AvailabilitySchedule";

const listingSchema = z.object({
  title: z.string().min(4, "Add a clear service title"),
  subtitle: z
    .string()
    .min(20, "Subtitles help shoppers understand what you provide"),
  description: z
    .string()
    .min(60, "Share more detail about your process and deliverables"),
  category: z.string().min(1, "Choose a service category"),
  region: z.string().min(1, "Select a region"),
  area: z.string().min(1, "Select a governorate"),
  // price: z
  //   .string()
  //   .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price (numbers only)"),
  // priceUnit: z.string().min(3, "Add a price unit, e.g. per project"),
  experience: z.string().optional(),
  nextAvailability: z.string().optional(),
  availability: z.record(z.string(), z.array(z.object({
    start: z.string(),
    end: z.string(),
    enabled: z.boolean().optional()
  }))).optional(),
  images: z
    .any()
    .optional()
    .refine(
      (value) => !value || value instanceof FileList,
      "Upload valid image files"
    ),
});

export default function CreateServiceListingForm() {
  const router = useRouter();

  // Get categories and regions from Zustand store
  const categories = useServicesStore((state) => state.categories);
  const regions = useServicesStore((state) => state.regions);
  const isLoadingMeta = useServicesStore((state) => state.isLoadingMeta);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      region: "",
      area: "",
      price: "",
      priceUnit: "per project",
      experience: "",
      nextAvailability: "",
      availability: {
        Sun: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Mon: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Tue: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Wed: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Thu: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Fri: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        Sat: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
      },
      images: undefined,
    },
  });

  const selectedRegion = watch("region");
  const selectedCategory = watch("category");
  const selectedPriceUnit = watch("priceUnit");

  // Common price unit options for services
  const priceUnitOptions = [
    "per project",
    "per hour",
    "per day",
    "per week",
    "per month",
    "per session",
    "per visit",
    "per item",
    "per square meter",
    "per square foot",
    "per person",
    "per room",
    "per page",
    "per word",
    "per minute",
    "fixed price",
    "starting from",
    "call for quote",
  ];

  // Prepare category options for SearchableDropdown
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id ?? category.value,
      label: category.label ?? category.name ?? category.value,
      depth: category.depth ?? 0,
      isParent: category.isParent ?? false,
      parentLabel: category.parentLabel ?? null,
      fullPath: category.fullPath ?? category.label ?? category.name,
    }));
  }, [categories]);

  // Prepare region options for SearchableDropdown
  const regionOptions = useMemo(() => {
    return regions.map((region) => {
      const value = region.id ?? region.value;
      const label = region.label ?? region.name ?? region.title ?? value;
      return {
        id: String(value),
        label: String(label),
      };
    });
  }, [regions]);

  // Prepare governorate options for SearchableDropdown
  const governorateOptions = useMemo(() => {
    const match = regions.find(
      (region) =>
        region.id === selectedRegion || region.value === selectedRegion || String(region.id) === String(selectedRegion)
    );
    if (!match) return [];

    let areas = [];
    if (Array.isArray(match.areas) && match.areas.length) {
      areas = match.areas;
    } else if (Array.isArray(match.governorates) && match.governorates.length) {
      areas = match.governorates;
    }

    return areas.map((area) => {
      if (typeof area === "string") {
        return { id: area, label: area };
      }
      const value = area.id ?? area.value ?? area.slug ?? area.name;
      const label = area.label ?? area.name ?? value;
      return {
        id: String(value),
        label: String(label),
      };
    });
  }, [regions, selectedRegion]);

  useEffect(() => {
    setValue("area", "");
  }, [selectedRegion, setValue]);

  async function onSubmit(values) {
    try {
      const categoryId = Number.parseInt(values.category, 10);
      const regionId = Number.parseInt(values.region, 10);
      const governorateId = Number.parseInt(values.area, 10);

      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("subtitle", values.subtitle.trim());
      formData.append("description", values.description.trim());
      if (!Number.isNaN(categoryId)) {
        formData.append("category_id", categoryId);
      }
      if (!Number.isNaN(regionId)) {
        formData.append("region_id", regionId);
      }
      if (!Number.isNaN(governorateId)) {
        formData.append("governorate_id", governorateId);
      }
      // formData.append("price", values.price);
      // formData.append("price_unit", values.priceUnit.trim());
      if (values.experience) {
        formData.append("experience", values.experience.trim());
      }
      if (values.nextAvailability) {
        formData.append("next_availability", values.nextAvailability.trim());
      }

      if (values.availability) {
        const DAY_MAP = {
          Sun: "sunday",
          Mon: "monday",
          Tue: "tuesday",
          Wed: "wednesday",
          Thu: "thursday",
          Fri: "friday",
          Sat: "saturday",
        };

        const formatTo24h = (timeStr) => {
          if (!timeStr || !timeStr.includes(" ")) return timeStr;
          const [time, modifier] = timeStr.split(" ");
          let [hours, minutes] = time.split(":");
          if (hours === "12") hours = "00";
          if (modifier === "PM") hours = parseInt(hours, 10) + 12;
          return `${String(hours).padStart(2, "0")}:${minutes}`;
        };

        let index = 0;
        Object.entries(values.availability).forEach(([day, slots]) => {
          slots.forEach((slot) => {
            if (slot.enabled !== false) {
              formData.append(`schedule[${index}][day]`, DAY_MAP[day] || day.toLowerCase());
              formData.append(`schedule[${index}][from]`, formatTo24h(slot.start));
              formData.append(`schedule[${index}][to]`, formatTo24h(slot.end));
              index++;
            }
          });
        });
      }

      const imageFiles =
        values.images instanceof FileList ? Array.from(values.images) : [];
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const response = await servicesApi.createService(formData);
      toast.success(response?.message || "Your service listing is live!");
      reset({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        region: "",
        area: "",
        price: "",
        priceUnit: "per project",
        experience: "",
        nextAvailability: "",
        availability: {
          Sun: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Mon: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Tue: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Wed: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Thu: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Fri: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
          Sat: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
        },
        images: undefined,
      });
      const slug = response?.data?.slug || response?.slug;
      if (slug) {
        router.push(`/services/${slug}`);
      }
    } catch (error) {
      console.error("Error creating service listing:", error);

      // Handle API validation errors - check multiple possible error structures
      const validationErrors =
        error?.data?.data ||
        error?.data?.errors ||
        error?.response?.data?.data ||
        error?.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        // Fallback to general error message
        const errorMessage =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create service listing. Please try again.";
        toast.error(errorMessage);
      }
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900">
          Service listing details
        </h2>
        <p className="text-sm text-slate-600">
          Provide as much detail as possible so shoppers choose you with
          confidence.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Overview
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Service title
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Premium home cleaning & organisation"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Subtitle
              </label>
              <input
                {...register("subtitle")}
                type="text"
                placeholder="Summarise what clients can expect"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {errors.subtitle && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.subtitle.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Detailed description
              </label>
              <textarea
                {...register("description")}
                rows={6}
                placeholder="Describe your process, deliverables, and what makes your service unique."
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Category & location
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <SearchableDropdown
                options={categoryOptions}
                value={selectedCategory || ""}
                onChange={(value) => setValue("category", value || "")}
                placeholder="All categories"
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found"
                showHierarchy={true}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Region
              </label>
              <SearchableDropdown
                options={regionOptions}
                value={selectedRegion || ""}
                onChange={(value) => setValue("region", value || "")}
                placeholder="All regions"
                searchPlaceholder="Search regions..."
                emptyMessage="No regions found"
              />
              {errors.region && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.region.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Governorate
              </label>
              <SearchableDropdown
                options={governorateOptions}
                value={watch("area") || ""}
                onChange={(value) => setValue("area", value || "")}
                placeholder="Any governorate"
                searchPlaceholder="Search governorates..."
                emptyMessage="No governorates found"
                disabled={!governorateOptions.length || !selectedRegion}
              />
              {errors.area && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.area.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Experience highlights (optional)
              </label>
              <input
                {...register("experience")}
                type="text"
                placeholder="e.g. 10+ years experience, Master Electricians member"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {/* Pricing &  */}
            Availability
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* <div>
              <label className="block text-sm font-medium text-slate-700">
                Starting price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 price">$</span>
                </div>
                <input
                  {...register("price", {
                    onChange: (e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      if (value !== "" && (!isNaN(numValue) && numValue < 0)) {
                        e.target.value = "";
                      }
                    }
                  })}
                  type="number"
                  min="0"
                  className="w-full mt-1 rounded-2xl border border-slate-200 bg-white py-3 text-slate-900 shadow-sm text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 pl-8 pr-3
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter price e,g, 150"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price unit
              </label>
              <SearchableDropdown
                options={priceUnitOptions}
                value={selectedPriceUnit || ""}
                onChange={(value) => setValue("priceUnit", value)}
                placeholder="Select price unit"
                searchPlaceholder="Search price units..."
                emptyMessage="No price units found"
              />
              {errors.priceUnit && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.priceUnit.message}
                </p>
              )}
            </div> */}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Next availability (optional)
              </label>
              <input
                {...register("nextAvailability")}
                type="text"
                placeholder="e.g. Available from mid-January"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Weekly availability schedule
              </label>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <AvailabilitySchedule
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Service Images (optional)
              </label>
              <input
                {...register("images")}
                type="file"
                accept="image/*"
                multiple
                className="mt-1 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              />
              <p className="mt-1 text-xs text-slate-500">
                Upload Images that showcase your work (JPG or PNG,
                2&nbsp;MB max each).
              </p>
              {errors.images && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Publishing…" : "Publish service"}
          </button>
        </div>
      </form>
    </div>
  );
}
