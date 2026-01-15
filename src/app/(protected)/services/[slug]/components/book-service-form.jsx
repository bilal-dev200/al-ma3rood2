"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { useServiceBookingsStore } from "@/lib/stores/serviceBookingsStore";
import { useLocationStore } from "@/lib/stores/locationStore";
import Select from "react-select";
import { useAuthStore } from "@/lib/stores/authStore";

const bookingSchema = z.object({
  preferredDate: z.string().min(1, "Choose a preferred date"),
  preferredTimeWindow: z.object({
    start: z.string().min(1, "Choose a start time"),
  }),
  startTime: z.string().min(1, "Add a start time"),
  endTime: z.string().min(1, "Add an end time"),
  addressLine1: z.string().min(5, "Add the service address"),
  regionId: z.string().optional(),
  cityId: z.string().min(1, "Select a city"),
  areaId: z.string().min(1, "Select an area"),
  projectDetails: z
    .string()
    .min(
      20,
      "Add at least 20 characters so the provider understands your needs"
    ),
  budget: z.string().optional(),
});

export default function BookServiceForm({ service }) {
  const { user } = useAuthStore();
  const [recentBooking, setRecentBooking] = useState(null);

  const {
    locations,
    getAllLocations,
    cities: storeCities,
    areas: storeAreas,
    fetchCities,
    fetchAreas,
    isLoading: isLocationLoading
  } = useLocationStore();

  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];

  const bookService = useServiceBookingsStore((state) => state.bookService);

  const userCityId = user?.city_id || user?.city?.id || "";
  const userAreaId = user?.area_id || user?.area?.id || "";
  const userRegionId = user?.region_id || user?.region?.id || "";

  const initialRegionId = userRegionId || "";
  const initialCityId = userCityId || "";
  const initialAreaId = userAreaId || "";

  const defaultDetails = useMemo(() => {
    const serviceName = service.title || "your service";
    const categoryLabel =
      service.subcategory ||
      service.subcategory_name ||
      service.category_name ||
      service.category ||
      "services";
    const areaLabel =
      service.regionLabel ||
      service.region ||
      service.region_label ||
      "your area";
    return `Hi ${serviceName},\n\nI'd like to lock in ${categoryLabel.toLowerCase()} in ${areaLabel}. Please confirm availability for the selected slot.`;
  }, [service]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      preferredDate: "",
      preferredTimeWindow: {
        start: "",
      },
      startTime: "09:00",
      endTime: "11:00",
      addressLine1: "",
      regionId: initialRegionId ? String(initialRegionId) : "",
      cityId: initialCityId ? String(initialCityId) : "",
      areaId: initialAreaId ? String(initialAreaId) : "",
      projectDetails: defaultDetails,
      budget: "",
    },
  });

  const selectedRegionId = watch("regionId");
  const selectedCityId = watch("cityId");

  // Populate form with user data when available
  useEffect(() => {
    if (!user) return;

    const userAddress =
      user.billing_address || user.address || user.delivery_address || "";
    const userRegionId = user.regions_id || user.regions?.id || "";
    const userCityId = user.city_id || user.city?.id || "";
    const userAreaId = user.area_id || user.area?.id || "";

    if (userAddress) setValue("addressLine1", userAddress);
    if (userRegionId) setValue("regionId", String(userRegionId));
    if (userCityId) setValue("cityId", String(userCityId));
    if (userAreaId) setValue("areaId", String(userAreaId));
  }, [user, setValue]);

  // Fetch cities when region changes or is set
  useEffect(() => {
    if (selectedRegionId) {
      fetchCities(selectedRegionId);
    }
  }, [selectedRegionId, fetchCities]);

  // Fetch areas when city changes or is set
  useEffect(() => {
    if (selectedCityId) {
      fetchAreas(selectedCityId).then((fetchedAreas) => {
        // Auto-select area if only one exists
        if (fetchedAreas && fetchedAreas.length === 1) {
          setValue("areaId", String(fetchedAreas[0].id));
        }
      });
    }
  }, [selectedCityId, fetchAreas, setValue]);

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  const router = useRouter(); // Initialize router

  async function onSubmit(values) {
    try {
      const booking = await bookService({
        ...values,
        serviceSlug: service.slug,
        serviceTitle: service.title,
        preferredTimeWindow: {
          start: values.preferredTimeWindow?.start || values.startTime,
          end: values.endTime,
        },
      });
      // toast.success("Booking created. We'll notify the provider.");

      // Extract provider details
      // Assuming service structure has user/creator info
      const providerEmail = service.user?.email || service.creator?.email || service.email || "";
      const providerPhone = service?.user?.phone || service.creator?.phone || service.user?.mobile || service.creator?.mobile || "";
      const providerName = service.user?.name || service.user?.username || service.creator?.name || "";
      const providerTitle = service.title || "";


      // Redirect to success page
      const params = new URLSearchParams();
      if (providerEmail) params.set("email", providerEmail);
      if (providerPhone) params.set("phone", providerPhone);
      if (providerName) params.set("name", providerName);
      if (providerTitle) params.set("service", providerTitle);


      router.push(`/services/booking-success?${params.toString()}`);

      // if (booking) {
      //   setRecentBooking(booking);
      // }
      // reset({
      //   ...values,
      //   regionId: values.regionId,
      //   cityId: values.cityId,
      //   areaId: values.areaId,
      //   projectDetails: defaultDetails,
      // });
    } catch (error) {
      toast.error(error?.message || "Unable to create booking right now.");
    }
  }

  // Only render form if user is logged in
  if (!user) {
    return null;
  }

  return (
    <section
      id="service-booking"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md"
    >
      <h3 className="text-lg font-semibold text-slate-900">
        Book this service
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Lock your slot and share the key details. The provider will confirm or
        suggest an alternative time.
      </p>

      {recentBooking && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">
            Booking #{recentBooking.bookingId} created successfully.
          </p>
          <p className="mt-1">
            Track status from{" "}
            <Link
              href="/account/services"
              className="font-semibold text-emerald-700 underline"
            >
              Account → Services
            </Link>
            .
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Preferred Date
            </label>
            <input
              {...register("preferredDate")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.preferredDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.preferredDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Preferred Time
            </label>
            <input
              {...register("preferredTimeWindow.start")}
              type="time"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.preferredTimeWindow?.start && (
              <p className="mt-1 text-xs text-red-500">
                {errors.preferredTimeWindow.start.message}
              </p>
            )}
          </div>
        </div>

        {/* <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              From
            </label>
            <input
              {...register("startTime")}
              type="time"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              To
            </label>
            <input
              {...register("endTime")}
              type="time"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.endTime && (
              <p className="mt-1 text-xs text-red-500">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div> */}

        <div className="flex flex-col gap-4">
          {/* Region Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Region
            </label>
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={regions.map((r) => ({ value: String(r.id), label: r.name }))}
                  value={regions.find(r => String(r.id) === field.value) ? { value: field.value, label: regions.find(r => String(r.id) === field.value)?.name } : null}
                  onChange={(val) => {
                    field.onChange(val ? val.value : "");
                    setValue("cityId", "");
                    setValue("areaId", "");
                  }}
                  placeholder="Select a region"
                  className="text-sm"
                  isLoading={isLocationLoading}
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.regionId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.regionId.message}
              </p>
            )}
          </div>

          {/* City Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={storeCities.map((c) => ({ value: String(c.id), label: c.name }))}
                  value={storeCities.find(c => String(c.id) === field.value) ? { value: field.value, label: storeCities.find(c => String(c.id) === field.value)?.name } : null}
                  onChange={(val) => {
                    field.onChange(val ? val.value : "");
                    setValue("areaId", "");
                  }}
                  onInputChange={(inputValue) => {
                    if (selectedRegionId) fetchCities(selectedRegionId, inputValue);
                  }}
                  placeholder="Select a city"
                  className="text-sm"
                  isLoading={isLocationLoading}
                  classNamePrefix="react-select"
                  isDisabled={!selectedRegionId}
                />
              )}
            />
            {errors.cityId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.cityId.message}
              </p>
            )}
          </div>

          {/* Area Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Area
            </label>
            <Controller
              name="areaId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={storeAreas.map((a) => ({ value: String(a.id), label: a.name }))}
                  value={storeAreas.find(a => String(a.id) === field.value) ? { value: field.value, label: storeAreas.find(a => String(a.id) === field.value)?.name } : null}
                  onChange={(val) => field.onChange(val ? val.value : "")}
                  onInputChange={(inputValue) => {
                    if (selectedCityId) fetchAreas(selectedCityId, inputValue);
                  }}
                  placeholder="Select an area"
                  className="text-sm"
                  isLoading={isLocationLoading}
                  classNamePrefix="react-select"
                  isDisabled={!selectedCityId}
                />
              )}
            />
            {errors.areaId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.areaId.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Service Address
          </label>
          <input
            {...register("addressLine1")}
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Street, building or landmark"
          />
          {errors.addressLine1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Project details
          </label>
          <textarea
            {...register("projectDetails")}
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.projectDetails && (
            <p className="mt-1 text-xs text-red-500">
              {errors.projectDetails.message}
            </p>
          )}
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-slate-700">
            Budget (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 price">$</span>
            </div>
            <input
              {...register("budget")}
              type="number"
              className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pl-8 pr-3 py-2
[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g. up to 1,200 SAR"
            />
          </div>
        </div> */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Booking…" : "Book now"}
        </button>
      </form>
    </section>
  );
}