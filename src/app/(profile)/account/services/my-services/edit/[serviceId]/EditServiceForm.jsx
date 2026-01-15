"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import Image from "next/image";
import { X } from "lucide-react";
import { servicesApi } from "@/lib/api/services";
import { categoriesApi } from "@/lib/api/category";
import { transformServiceCategories } from "@/lib/utils/serviceTransformers";
import SearchableDropdown from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdown";
import { useServicesStore } from "@/lib/stores/servicesStore";
import { useLocationStore } from "@/lib/stores/locationStore"; // Added location store
import { Image_URL } from "@/config/constants";
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
  city: z.string().min(1, "Select a city"),
  area: z.string().min(1, "Select an area"),
  price: z.string().optional(),
  priceUnit: z.string().optional(),
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

export default function EditServiceForm({ serviceId }) {
  const router = useRouter();
  const [isLoadingService, setIsLoadingService] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [deletingImageId, setDeletingImageId] = useState(null);

  // Get categories from Services Store
  const categories = useServicesStore((state) => state.categories);
  const isLoadingMeta = useServicesStore((state) => state.isLoadingMeta);
  const setServiceMeta = useServicesStore((state) => state.setServiceMeta);

  // Get locations from Location Store
  const {
    regions, // Direct access to regions
    fetchRegions, // Action to fetch regions
    cities: storeCities,
    areas: storeAreas,
    fetchCities,
    fetchAreas,
    isLoading: isLocationLoading
  } = useLocationStore();

  // Load categories if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      (async () => {
        try {
          const categoryTree = await categoriesApi.getCategoryTree("services");
          const formattedCategories = transformServiceCategories(
            categoryTree?.data ?? categoryTree?.categories ?? categoryTree ?? []
          ).filter((category) => category.id);

          setServiceMeta({
            categories: formattedCategories,
            regions: [],
            isLoading: false,
          });
        } catch (error) {
          toast.error(
            error?.message || "Unable to load service categories right now."
          );
        }
      })();
    }
  }, [categories.length, setServiceMeta]);

  // Load regions on mount
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Load service data
  useEffect(() => {
    (async () => {
      try {
        setIsLoadingService(true);
        // Fetch user services and find the one matching serviceId
        const response = await servicesApi.getUserServices({});
        const services = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];
        const service = services.find(
          (s) => String(s.id || s.service_id) === String(serviceId)
        );

        if (!service) {
          toast.error("Service not found.");
          router.push("/account/services/my-services");
          return;
        }

        setServiceData(service);

        // Extract existing images
        const images = Array.isArray(service.images) ? service.images : [];
        setExistingImages(images);
      } catch (error) {
        toast.error(error?.message || "Unable to load service data.");
        router.push("/account/services/my-services");
      } finally {
        setIsLoadingService(false);
      }
    })();
  }, [serviceId, router]);

  const defaultAvailability = {
    Sun: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Mon: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Tue: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Wed: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Thu: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Fri: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
    Sat: [{ start: "06:00 AM", end: "07:00 PM", enabled: true }],
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      region: "",
      city: "",
      area: "",
      price: "",
      priceUnit: "per project",
      experience: "",
      nextAvailability: "",
      availability: defaultAvailability,
      images: undefined,
    },
  });

  // Populate form when service data is loaded
  useEffect(() => {
    if (serviceData) {
      // Transform schedule array to availability object for the form
      const DAY_MAP_REVERSE = {
        sunday: "Sun",
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
      };

      const formatTo12h = (time24) => {
        if (!time24) return "";
        let [hours, minutes] = time24.split(":");
        let modifier = "AM";
        let h = parseInt(hours, 10);
        if (h >= 12) {
          modifier = "PM";
          if (h > 12) h -= 12;
        }
        if (h === 0) h = 12;
        return `${String(h).padStart(2, "0")}:${minutes} ${modifier}`;
      };

      const availability = {};
      if (Array.isArray(serviceData.schedule)) {
        serviceData.schedule.forEach(slot => {
          const dayKey = DAY_MAP_REVERSE[slot.day.toLowerCase()];
          if (dayKey) {
            if (!availability[dayKey]) availability[dayKey] = [];
            availability[dayKey].push({
              start: formatTo12h(slot.from || slot.start),
              end: formatTo12h(slot.to || slot.end),
              enabled: true
            });
          }
        });
      }

      const regionId = String(serviceData.region_id || serviceData.region?.id || "");
      const cityId = String(serviceData.city_id || serviceData.city?.id || "");
      const areaId = String(serviceData.area_id || serviceData.area?.id || "");

      // Trigger fetches for existing data
      if (regionId) fetchCities(regionId);
      if (cityId) fetchAreas(cityId);

      reset({
        title: serviceData.title || serviceData.name || "",
        subtitle: serviceData.subtitle || serviceData.summary || "",
        description: serviceData.description || "",
        category: String(serviceData.category_id || serviceData.category?.id || ""),
        region: regionId,
        city: cityId,
        area: areaId,
        price: serviceData.price !== null ? String(serviceData.price) : "",
        priceUnit: serviceData.price_unit || serviceData.priceUnit || "per project",
        experience: serviceData.experience || "",
        nextAvailability: serviceData.next_availability || serviceData.nextAvailability || "",
        availability: Object.keys(availability).length > 0 ? availability : defaultAvailability,
        images: undefined,
      });
    }
  }, [serviceData, reset, fetchCities, fetchAreas]); // dependencies updated

  const selectedRegion = watch("region");
  const selectedCategory = watch("category");
  const selectedPriceUnit = watch("priceUnit");
  const selectedCity = watch("city");

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

  // Prepare region options from Stores
  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      id: String(region.id),
      label: region.name,
    }));
  }, [regions]);

  // Prepare city options from Location Store
  const cityOptions = useMemo(() => {
    return storeCities.map((city) => ({
      id: String(city.id),
      label: city.name,
    }));
  }, [storeCities]);

  // Prepare area options from Location Store
  const areaOptions = useMemo(() => {
    return storeAreas.map((area) => ({
      id: String(area.id),
      label: area.name,
    }));
  }, [storeAreas]);

  // Handle location changes
  useEffect(() => {
    if (selectedRegion) {
      fetchCities(selectedRegion);
    }
  }, [selectedRegion, fetchCities]);

  useEffect(() => {
    if (selectedCity) {
      fetchAreas(selectedCity);
    }
  }, [selectedCity, fetchAreas]);

  // Auto-select area if only one option exists
  useEffect(() => {
    if (areaOptions.length === 1 && selectedCity) {
      const singleAreaId = areaOptions[0].id;
      // Only set if not already set to avoid loop (though hook-form handles this well usually)
      if (watch("area") !== singleAreaId) {
        setValue("area", singleAreaId);
      }
    }
  }, [areaOptions, selectedCity, setValue, watch]);

  // Reset fields when parent changes (but not on initial load if data matches)
  // Implementing simplified logic: controlled by UI changes mainly
  // The SearchableDropdown onChange handles the setValue, so we might not need extra effects for clearing unless strictly required.
  // Actually, form reset handles initial values. If user changes region, we 'should' clear city.
  // SearchableDropdown onChange can handle this cleaner if we pass a custom handler.

  const handleRegionChange = (val) => {
    setValue("region", val || "");
    if (val !== selectedRegion) {
      setValue("city", "");
      setValue("area", "");
    }
  };

  const handleCityChange = (val) => {
    setValue("city", val || "");
    if (val !== selectedCity) {
      setValue("area", "");
    }
  };

  // ... (keeping image delete and onSubmit logic mostly same, just ensuring correct types)
  async function handleDeleteImage(imageId) {
    if (!imageId || !serviceId) return;

    try {
      setDeletingImageId(imageId);
      await servicesApi.deleteImage(serviceId, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId && img.image_id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to delete image.");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function onSubmit(values) {
    try {
      const categoryId = Number.parseInt(values.category, 10);
      const regionId = Number.parseInt(values.region, 10);
      const cityId = Number.parseInt(values.city, 10);
      const areaId = Number.parseInt(values.area, 10);

      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("subtitle", values.subtitle.trim());
      formData.append("description", values.description.trim());
      if (!Number.isNaN(categoryId)) formData.append("category_id", categoryId);
      if (!Number.isNaN(regionId)) formData.append("region_id", regionId);
      if (!Number.isNaN(cityId)) formData.append("city_id", cityId);
      if (!Number.isNaN(areaId)) formData.append("area_id", areaId);

      if (values.availability) {
        const DAY_MAP = { Sun: "sunday", Mon: "monday", Tue: "tuesday", Wed: "wednesday", Thu: "thursday", Fri: "friday", Sat: "saturday" };
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

      if (values.experience) formData.append("experience", values.experience.trim());
      if (values.nextAvailability) formData.append("next_availability", values.nextAvailability.trim());

      const imageFiles = values.images instanceof FileList ? Array.from(values.images) : [];
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const response = await servicesApi.updateService(serviceId, formData);
      toast.success(response?.message || "Service updated successfully!");
      router.push("/account/services/my-services");
    } catch (error) {
      toast.error(error?.message || "Failed to update service listing.");
    }
  }

  if (isLoadingService || isLoadingMeta) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">Loading service data…</p>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900">
          Edit service listing
        </h2>
        <p className="text-sm text-slate-600">
          Update your service details to keep your listing current and accurate.
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
                onChange={handleRegionChange}
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
                City
              </label>
              <SearchableDropdown
                options={cityOptions}
                value={selectedCity || ""}
                onChange={handleCityChange}
                placeholder="Select city"
                searchPlaceholder="Search cities..."
                emptyMessage="No cities found"
                loading={isLocationLoading}
                disabled={(!cityOptions.length && !isLocationLoading) || !selectedRegion}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Area
              </label>
              <SearchableDropdown
                options={areaOptions}
                value={watch("area") || ""}
                onChange={(value) => setValue("area", value || "")}
                placeholder="Select area"
                searchPlaceholder="Search areas..."
                emptyMessage="No areas found"
                loading={isLocationLoading}
                disabled={(!areaOptions.length && !isLocationLoading) || !selectedCity}
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
            Availability
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Controller
                control={control}
                name="availability"
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
              <label className="block text-sm font-medium text-slate-700">
                Service Images
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-3 mb-4">
                  <p className="mb-2 text-xs font-medium text-slate-600">
                    Current Images ({existingImages.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {existingImages.map((image) => {
                      const imageId = image.id || image.image_id;
                      const imagePath = image.image_path || image.path;
                      const imageUrl = imagePath && Image_URL
                        ? `${Image_URL}${imagePath}`
                        : image.url || "/placeholder.svg";
                      const isDeleting = deletingImageId === imageId;

                      return (
                        <div
                          key={imageId}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <Image
                            src={imageUrl}
                            alt="Service image"
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(imageId)}
                            disabled={isDeleting}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition-opacity hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Delete image"
                          >
                            {isDeleting ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div>
                <p className="mb-2 text-xs font-medium text-slate-600">
                  {existingImages.length > 0 ? "Add More Images" : "Upload Images"}
                </p>
                <input
                  {...register("images")}
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-1 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Upload new images (JPG or PNG, 2&nbsp;MB max each).
                  {existingImages.length > 0 && " New images will be added to existing ones."}
                </p>
                {errors.images && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/account/services/my-services")}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating…" : "Update service"}
          </button>
        </div>
      </form>
    </div>
  );
}
