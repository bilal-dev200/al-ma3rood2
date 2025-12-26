"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { useServiceBookingsStore } from "@/lib/stores/serviceBookingsStore";
import { useLocationStore } from "@/lib/stores/locationStore";
import { useAuthStore } from "@/lib/stores/authStore";

const bookingSchema = z.object({
  preferredDate: z.string().min(1, "Choose a preferred date"),
  startTime: z.string().min(1, "Add a start time"),
  endTime: z.string().min(1, "Add an end time"),
  addressLine1: z.string().min(5, "Add the service address"),
  regionId: z.string().min(1, "Select a region"),
  governorateId: z.string().min(1, "Select a governorate"),
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
  const [regionOptions, setRegionOptions] = useState([]);
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const getAllLocations = useLocationStore((state) => state.getAllLocations);
  const bookService = useServiceBookingsStore((state) => state.bookService);

  const userRegionId = user?.regions_id || user?.regions?.id || "";
  const userGovernorateId =
    user?.governorates_id || user?.governorates?.id || "";
  const initialRegionId =
    userRegionId ||
    service.region_id ||
    service.regionId ||
    service.region ||
    "";
  const initialGovernorateId =
    userGovernorateId ||
    service.governorate_id ||
    service.governorateId ||
    service.governorate ||
    "";

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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      preferredDate: "",
      startTime: "09:00",
      endTime: "11:00",
      addressLine1: "",
      regionId: initialRegionId ? String(initialRegionId) : "",
      governorateId: initialGovernorateId ? String(initialGovernorateId) : "",
      projectDetails: defaultDetails,
      budget: "",
    },
  });

  const selectedRegionId = watch("regionId");
  const selectedGovernorateId = watch("governorateId");

  // Populate form with user data when available
  useEffect(() => {
    if (!user) return;

    const userAddress =
      user.billing_address || user.address || user.delivery_address || "";
    const userRegionId = user.regions_id || user.regions?.id || "";

    if (userAddress) setValue("addressLine1", userAddress);
    if (userRegionId) setValue("regionId", String(userRegionId));
  }, [user, setValue]);

  // Set governorate after governorate options are loaded for the selected region
  useEffect(() => {
    if (!user || !governorateOptions.length) return;

    const userGovernorateId =
      user.governorates_id || user.governorates?.id || "";
    const currentGovernorateId = selectedGovernorateId;

    // Only set if we have a user governorate ID and it's not already set, or if it's different
    if (
      userGovernorateId &&
      currentGovernorateId !== String(userGovernorateId)
    ) {
      // Check if the governorate exists in the current options
      const governorateExists = governorateOptions.some(
        (gov) => gov.id === String(userGovernorateId)
      );
      if (governorateExists) {
        setValue("governorateId", String(userGovernorateId));
      }
    }
  }, [user, governorateOptions, selectedGovernorateId, setValue]);

  useEffect(() => {
    async function hydrateRegions() {
      try {
        const countries = await getAllLocations();
        const saudi = Array.isArray(countries)
          ? countries.find((country) => country.name === "Saudi Arabia") ||
          countries[0]
          : null;
        const derivedRegions =
          saudi?.regions?.map((region) => ({
            id: String(region.id),
            label: region.name,
            governorates:
              region.governorates?.map((item) => ({
                id: String(item.id),
                label: item.name,
              })) || [],
          })) || [];
        setRegionOptions(derivedRegions);
      } catch (error) {
        console.error("Unable to load locations", error);
      }
    }

    hydrateRegions();
  }, [getAllLocations]);

  useEffect(() => {
    if (!regionOptions.length) {
      setGovernorateOptions([]);
      return;
    }

    const activeRegion = regionOptions.find(
      (region) => region.id === selectedRegionId
    );
    const derivedGovernorates = activeRegion?.governorates || [];
    setGovernorateOptions(derivedGovernorates);

    if (
      selectedGovernorateId &&
      !derivedGovernorates.some((item) => item.id === selectedGovernorateId)
    ) {
      setValue("governorateId", "");
    }

    if (!selectedRegionId) {
      setValue("governorateId", "");
    }
  }, [regionOptions, selectedRegionId, selectedGovernorateId, setValue]);

  const router = useRouter(); // Initialize router

  async function onSubmit(values) {
    try {
      const booking = await bookService({
        ...values,
        serviceSlug: service.slug,
        serviceTitle: service.title,
        preferredTimeWindow: {
          start: values.startTime,
          end: values.endTime,
        },
      });
      // toast.success("Booking created. We'll notify the provider.");

      // Extract provider details
      // Assuming service structure has user/creator info
      const providerEmail = service.user?.email || service.creator?.email || service.email || "";
      const providerPhone = service.user?.mobile || service.creator?.mobile || service.mobile || service.phone || "";
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
      //   governorateId: values.governorateId,
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
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Preferred date
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Region
            </label>
            {regionOptions.length ? (
              <select
                {...register("regionId")}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select a region</option>
                {regionOptions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register("regionId")}
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter region ID"
              />
            )}
            {errors.regionId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.regionId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Governorate
            </label>
            {regionOptions.length ? (
              <select
                {...register("governorateId")}
                disabled={!selectedRegionId || !governorateOptions.length}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {selectedRegionId
                    ? "Select a governorate"
                    : "Choose region first"}
                </option>
                {governorateOptions.map((governorate) => (
                  <option key={governorate.id} value={governorate.id}>
                    {governorate.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register("governorateId")}
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter governorate"
              />
            )}
            {errors.governorateId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.governorateId.message}
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